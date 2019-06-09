// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'



// 


Vue.config.productionTip = false



// 全局css
import './assets/css/reset.css' //样式重置
import './assets/css/public.css' //公共样式
/* eslint-disable no-new */



new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
