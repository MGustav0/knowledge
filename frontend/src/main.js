import 'font-awesome/css/font-awesome.css' /**Necessário para o ícone do menu */

import Vue from 'vue'

import App from './App'

import './config/bootstrap'
import './config/msgs'
import store from './config/store'
import router from './config/router'

Vue.config.productionTip = false

require('axios').defaults.headers.common['Authorization'] = 'bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwibmFtZSI6Ikd1c3Rhdm8gZGUgT2xpdmVpcmEgTW9yZWlyYSIsImVtYWlsIjoiZ3VzdGF2b21vcmVpcmE4OEBnbWFpbC5jb20iLCJhZG1pbiI6dHJ1ZSwiaWF0IjoxNTYwODA0NzYzLCJleHAiOjE1ODY3MjQ3NjN9.VIuZjRFmsPCf9pJVyk4wOFVHjhSEk-YLlji3Ao6zGqE'

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')