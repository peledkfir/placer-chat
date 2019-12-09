
import { vuexfireMutations, firestoreAction } from 'vuexfire'
import firebase from 'firebase/app'
import 'firebase/firestore'
import * as _ from 'lodash';

export default {
    state: {
        me: {},
        messages: [],
        users: [],
        onlineStatus: [],
    },

    getters: {
        me: (state: any) => {
            const id = firebase.auth().currentUser ? firebase.auth().currentUser!.uid : undefined;
            return { id, ...state.me };
        },
        messages: (state: any) => _.chain(state.messages)
            .concat(state.onlineStatus)
            .sortBy(obj => {
                if (_.isNumber(obj.time)) {
                    return new Date(obj.time);
                } else if (obj.time) {
                    return obj.time.toDate();
                }

                return 0;
            })
            .value(),
        users: (state: any) => _.keyBy(state.users, 'id'),
    },

    mutations: {
        addOnlineStatus(state: any, payload: any) {
            state.onlineStatus.push(payload);
        },
        ...vuexfireMutations
    },

    actions: {
        bindOnlineStatsRef: (context: any) => {
            firebase.firestore().collection('status')
                .where('state', '==', 'online')
                .onSnapshot(snapshot => {
                    snapshot.docChanges().forEach(change => {
                        if (change.type === 'added') {
                            context.commit('addOnlineStatus', { id: change.doc.id, status: 'online', time: new Date().getTime() });
                        }
                        if (change.type === 'removed') {
                            context.commit('addOnlineStatus', { id: change.doc.id, status: 'offline', time: new Date().getTime() });
                        }
                    });
                });
        },

        bindMeRef: firestoreAction(context => {
            const userRef = firebase.firestore().doc(`users/${firebase.auth().currentUser!.uid}`);
            return context.bindFirestoreRef('me', userRef);
        }),

        bindMessagesRef: firestoreAction(context => {
            // context contains all original properties like commit, state, etc
            // and adds `bindFirestoreRef` and `unbindFirestoreRef`
            // we return the promise returned by `bindFirestoreRef` that will
            // resolve once data is ready
            return context.bindFirestoreRef('messages', firebase.firestore().collection('grp/main/messages').orderBy('time'));
        }),

        bindUsersRef: firestoreAction(context => {
            return context.bindFirestoreRef('users', firebase.firestore().collection('users'));
        }),

        sendMessage: firestoreAction((context, payload) => {
            payload.author = firebase.auth().currentUser!.uid;
            payload.time = firebase.firestore.FieldValue.serverTimestamp();
            return firebase.firestore().collection('grp/main/messages').add(payload);
        }),

        updateName: firestoreAction((context, payload) => {
            return firebase.firestore().doc(`users/${firebase.auth().currentUser!.uid}`).set({ id: firebase.auth().currentUser!.uid, name: payload });
        }),
    },
}