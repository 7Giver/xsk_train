import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
		wxid: '',
		userInfo: {}
	},
    mutations: {
		setWxid(state, wxid) {
			state.wxid = wxid
		},
		setUserInfo(state, userInfo) {
			state.userInfo = userInfo
		},
	},
    actions: {
		async getUserInfo({ commit }) {
			try {
				let wxid = uni.getStorageSync("wxid")
				if (!wxid) {
					return false
				}
				let obj = {
					wxid: wxid
				}
				uni.request({
					url: 'http://ztc1.st712.com/?r=api/user/info',
					data: JSON.stringify(obj),
					header: {
						'content-type':'multipart/form-data',
					},
					method: 'POST',
					success: (res) => {
						commit('setUserInfo', {
							userInfo: res.data.data
						})
					}
				})
			} catch (e) {
				console.log('getUserInfoError',e);
			}
		}
	}
})
export default store