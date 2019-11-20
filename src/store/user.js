const types = {
  SET_USER_ID: 'set_user_id'
};

const initState = () => ({
  userId: null, // 企业微信的唯一标识
});
const state = initState();

const getters = {};

const mutations = {
  [types.SET_USER_ID](state, payload) {
    console.log(state, payload)
    state.userId = payload.userId;
  },
};

const actions = {
  // async login({ commit, state }, payload) {
  //   const response = await authLogin(payload, state.loginType);
  //   commit(types.SET_USER_INFO, response);
  //   return response;
  // }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
