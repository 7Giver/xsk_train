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

// #ifdef H5
import jwx from './common/jwx.js'
Vue.prototype.$jwx = jwx
// #endif

// 跳转授权
Vue.prototype.$getAuthorize = () => {
  let href = window.location.href
  let temp = href.split('?')[1]; // 通过拆分链接判断是否获取参数存储
  if (temp) {
    let url = decodeURIComponent(href)
    let urlObj = getUrlparam(url)
    if (!urlObj.wxid) {
      window.location.href = `${testURL}?r=api/user/authorize&path=${href}`
      return false
    }
    uni.setStorage({
      key: 'userMsg',
      data: urlObj,
      success: () => {}
    })
  } else {
      let url = window.location.href
      window.location.href = `${testURL}?r=api/user/authorize&path=${url}`
    uni.setStorage({
      key: "openPost",
      data: true
    })
  }

  function getUrlparam(url) {
    let askText = url.split('?')[1];
    let result = {};
    let newStr = askText.replace('#/','')
    let askAry = newStr.split('&');
    askAry.forEach(item => {
      let n = item.split('=');
      let key = n[0];
      let value = n[1];
      result[key] = value;
    });
    return result
  }
}

Vue.prototype.$baseURL = baseURL
Vue.prototype.$dataURL = dataURL
Vue.prototype.$http = http

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
