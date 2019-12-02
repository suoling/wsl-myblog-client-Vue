import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import Vue from 'vue';
import user from './user';

Vue.use(Vuex);

const state = {};

const getters = {};

const mutations = {};

const actions = {};

export default new Vuex.Store({
  modules: {
    user
  },
  state,
  getters,
  mutations,
  actions,
  plugins: [createPersistedState({
    storage: window.sessionStorage,
  })],
});
