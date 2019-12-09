import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

export default function trackPresence() {
    if (!firebase.auth().currentUser) {
        return;
    }

    // Fetch the current user's ID from Firebase Authentication.
    var uid = firebase.auth().currentUser!.uid;

    // Create a reference to this user's specific status node.
    // This is where we will store data about being online/offline.
    var userStatusDatabaseRef = firebase.database().ref('/status/' + uid);

    var userStatusFirestoreRef = firebase.firestore().doc('/status/' + uid);

    // We'll create two constants which we will write to 
    // the Realtime database when this device is offline
    // or online.
    var isOfflineForDatabase = {
        state: 'offline',
        last_changed: firebase.database.ServerValue.TIMESTAMP,
    };

    var isOnlineForDatabase = {
        state: 'online',
        last_changed: firebase.database.ServerValue.TIMESTAMP,
    };

    // Firestore uses a different server timestamp value, so we'll 
    // create two more constants for Firestore state.
    var isOfflineForFirestore = {
        state: 'offline',
        last_changed: firebase.firestore.FieldValue.serverTimestamp(),
    };

    var isOnlineForFirestore = {
        state: 'online',
        last_changed: firebase.firestore.FieldValue.serverTimestamp(),
    };

    // Create a reference to the special '.info/connected' path in 
    // Realtime Database. This path returns `true` when connected
    // and `false` when disconnected.
    firebase.database().ref('.info/connected').on('value', function (snapshot) {
        // If we're not currently connected, don't do anything.
        if (snapshot.val() == false) {
            // Instead of simply returning, we'll also set Firestore's state
            // to 'offline'. This ensures that our Firestore cache is aware
            // of the switch to 'offline.'
            userStatusFirestoreRef.set(isOfflineForFirestore);
            return;
        }

        // If we are currently connected, then use the 'onDisconnect()' 
        // method to add a set which will only trigger once this 
        // client has disconnected by closing the app, 
        // losing internet, or any other means.
        userStatusDatabaseRef.onDisconnect().set(isOfflineForDatabase).then(function () {
            // The promise returned from .onDisconnect().set() will
            // resolve as soon as the server acknowledges the onDisconnect() 
            // request, NOT once we've actually disconnected:
            // https://firebase.google.com/docs/reference/js/firebase.database.OnDisconnect

            // We can now safely set ourselves as 'online' knowing that the
            // server will mark us as offline once we lose connection.
            userStatusDatabaseRef.set(isOnlineForDatabase);

            // We'll also add Firestore set here for when we come online.
            userStatusFirestoreRef.set(isOnlineForFirestore);
        }).catch(reason => {
            // console.log(reason);
        });
    });
}
