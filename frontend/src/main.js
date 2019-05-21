import 'font-awesome/css/font-awesome.css' /**Necessário para o ícone do menu */

import Vue from 'vue'

import App from './App'

import './config/bootstrap'
import store from './config/store'

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')