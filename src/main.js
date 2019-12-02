import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import './assets/styles/reset.scss'
import moment from 'moment' 

Vue.use(ElementUI);
Vue.use(mavonEditor);

Vue.config.productionTip = false


Vue.filter('datefmt',function(input,fmtstring){
  return moment(input).format(fmtstring)
}) 

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
