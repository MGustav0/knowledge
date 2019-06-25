import 'font-awesome/css/font-awesome.css' /**Necessário para o ícone do menu */

import Vue from 'vue'

import App from './App'

import './config/bootstrap'
import './config/msgs'
import store from './config/store'
import router from './config/router'

Vue.config.productionTip = false

require('axios').defaults.headers.common['Authorization'] = 'bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwibmFtZSI6Ikd1c3Rhdm8gZGUgT2xpdmVpcmEgTW9yZWlyYSIsImVtYWlsIjoiZ3VzdGF2b21vcmVpcmE4OEBnbWFpbC5jb20iLCJhZG1pbiI6dHJ1ZSwiaWF0IjoxNTYxNTAwMDg3LCJleHAiOjE1ODc0MjAwODd9.T2pZr6Sh6Mq6iGuc4gl8FYAOXhgCkB5G4DKBVJUMEZE'

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')