import Vue from 'vue'
import Vuex from 'vuex'
import MessagesModule from './store/MessagesModule';

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    messagesModule: MessagesModule,
  }
})
