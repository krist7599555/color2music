import Vue from 'vue'
import App from './App.vue'
// import './registerServiceWorker'
import router from './router'
import VueCompositionApi from '@vue/composition-api'

Vue.use(VueCompositionApi)

import "pepjs" // pointer jquery
import "jquery" // pointer jquery

// import Rx from 'rxjs/Rx'
// import VueRx from 'vue-rx'
// Vue.use(VueRx, Rx)

import './assets/css/tailwind.css'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
