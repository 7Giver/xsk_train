import Vue from 'vue'
import App from './App'
import store from './store'
import uni_request from './common/uni_request.js'
import * as Common from './common/api.js'

const baseURL = 'http://ztc1.st712.com' // 接口地址
const testURL = 'http://server.st712.com' // 测试接口
const dataURL = 'http://ztc2.st712.com/' // 引用资源地址
const http = uni_request({
  baseURL: baseURL,
//   baseURL: testURL, //测试接口
  header:{
    'content-type':'multipart/form-data',
  },
  timeout: 60000,
  // #ifdef H5
  withCredentials: true
  // #endif
})
const msg = (title, duration=1500, mask=false, icon='none')=>{
	//统一提示方便全局修改
	if(Boolean(title) === false){
		return;
	}
	uni.showToast({
		title,
		duration,
		mask,
		icon
	});
}
const json = type=>{
	//模拟异步请求数据
	return new Promise(resolve=>{
		setTimeout(()=>{
			resolve(Json[type]);
		}, 500)
	})
}
// #ifdef H5
import jwx from './common/jwx.js'
Vue.prototype.$jwx = jwx
// #endif

Vue.prototype.$baseURL = baseURL
Vue.prototype.$testURL = testURL
Vue.prototype.$dataURL = dataURL
Vue.prototype.$store = store
Vue.prototype.$common = Common;
Vue.prototype.$http = http
Vue.prototype.$api = {msg, json};

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
