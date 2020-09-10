<script>
import { mapState, mapMutations } from 'vuex';
// var testjs = require("@/common/vconsole.min.js");
// new testjs()
	export default {
		onLaunch: function() {
			// console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			...mapMutations({
				setWxid: 'setWxid',
				setUserInfo: 'setUserInfo'
			}),
			// 获取用户信息
			getUserInfo() {
				let value = uni.getStorageSync('wxid')
				if (value.wxid) {
					value.wxid = value.wxid.replace('#/','');
					uni.setStorageSync('userMsg', value);
					this.$test
						.post(`/?r=api/user/info`, {
							wxid: value.wxid
						})
						.then(response => {
							if (response.code === 200) {
								this.$set(response.data, 'wxid', value.wxid)
								this.setUserInfo(response.data)
							}
						});
				}
			},
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "@/static/css/app.scss";
</style>
