import 'font-awesome/css/font-awesome.css' /**Necessário para o ícone do menu */

import Vue from 'vue'

import App from './App'

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')