
import { vuexfireMutations, firestoreAction } from 'vuexfire'
import firebase from 'firebase/app'
import 'firebase/firestore'

export default {
    state: {
        messages: [],
    },

    getters: {
        messages: (state: any) => state.messages,
    },

    mutations: {
        ...vuexfireMutations
    },

    actions: {
        bindMessagesRef: firestoreAction(context => {
            // context contains all original properties like commit, state, etc
            // and adds `bindFirestoreRef` and `unbindFirestoreRef`
            // we return the promise returned by `bindFirestoreRef` that will
            // resolve once data is ready
            return context.bindFirestoreRef('messages', firebase.firestore().collection('grp/main/messages').orderBy('time'))
        }),

        sendMessage: firestoreAction((context, payload) => {
            return firebase.firestore().collection('grp/main/messages').add(payload);
        }),
    },
}