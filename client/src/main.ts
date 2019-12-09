import * as firebase from 'firebase/app';
import 'firebase/auth';
import Vue from 'vue';
import './plugins/moment';
import vuetify from '@/plugins/vuetify';
import AppView from './AppView.vue';
import i18n from './i18n';
import router from './router';
import store from './store';
import trackPresence from './presence';

Vue.config.productionTip = false

// Initialize Firebase
const config = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_FIREBASE_URL,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
};
firebase.initializeApp(config);

// Bootstrap
let app: Vue | null = null;

firebase.auth().signInAnonymously().then(() => {
  if (app) {
    app.$store.dispatch("bindMeRef");
  }
});
firebase.auth().onAuthStateChanged((user) => {
  if (!app) {
    trackPresence();

    app = new Vue({
      i18n,
      router,
      store,
      vuetify,
      render: h => h(AppView)
    }).$mount('#app');
  } else if (user) {
    app.$store.dispatch("bindMeRef");
  }
});

