import Vue from 'vue'
import App from './App'
import store from './store'
import uni_request from './common/uni_request.js'
import * as Common from './common/api.js'

const baseURL = 'http://server.yingku878.com' // 接口地址
const dataURL = 'http://cdn.tuku658.com' // 引用资源地址
const http = uni_request({
  baseURL: baseURL, 
  header:{
    'content-type':'multipart/form-data',
  },
  timeout: 60000,
  // #ifdef H5
  withCredentials: true
  // #endif
})

// #ifdef H5
import jwx from './common/jwx.js'
Vue.prototype.$jwx = jwx
// #endif

Vue.prototype.$baseURL = baseURL
Vue.prototype.$dataURL = dataURL
Vue.prototype.$store = store
Vue.prototype.$common = Common;
Vue.prototype.$http = http

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
