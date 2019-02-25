import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import VueLazyLoad from 'vue-lazyload'

import '@/common/styles/base.css'

// import VueCookie from 'vue-cookie'
// Vue.use(VueCookie)

Vue.config.productionTip = false
Vue.use(VueLazyLoad, {
  loading: require('./common/images/lazy-loading.png')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
