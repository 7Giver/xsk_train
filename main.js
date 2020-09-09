import Vue from 'vue'
import App from './App'
import uni_request from './common/uni_request.js'

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

Vue.prototype.$baseURL = baseURL
Vue.prototype.$dataURL = dataURL
Vue.prototype.$http = http

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
