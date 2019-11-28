import { userLogin } from '../api/user'

const types = {
  SET_USER_INFO: 'set_user_info'
};

const initState = () => ({
  is_login: false,
  login_id: null,
  phone: null,
});
const state = initState();

const getters = {};

const mutations = {
  [types.SET_USER_INFO](state, payload) {
    console.log(state, payload)
    state.is_login = true;
    state.login_id = payload.login_id;
    state.phone = payload.phone;
  },
};

const actions = {
  async login({ commit }, payload) {
    const { phone, pass } = payload
    const res = await userLogin({ phone, pass })
    commit(types.SET_USER_INFO, res);
    return res;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
