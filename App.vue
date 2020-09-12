<script>
import { mapState, mapMutations } from "vuex";
// var testjs = require("@/common/vconsole.min.js");
// new testjs()
export default {
	computed: {
    	...mapState(['userInfo', 'wxid'])
  	},
    onLaunch: function () {
        // console.log('App Launch')
    },
    onShow: function () {
        console.log("App Show");
        // let url = 'http://dt.sousou.com/#/pages/mine/connection?nickname=Heiz&openid=o8MX9wwt5ozZ033IVjTqqNsM4c1A&headimgurl=http%3A%2F%2Fthirdwx.qlogo.cn%2Fmmopen%2Fvi_32%2FkFbNaxXYDdlzenEeANr0qW0tDY2WOaQLT1nAtySsEXwia2mITxEDTlRzA8dlUeHsuhOxyVHISU2oMhvGBtRdLxw%2F132&wxid=wpxgorng#/'
        // console.log(this.$common.getQueryString('wxid', url));
        this.getUserMsg();
    },
    onHide: function () {
        console.log("App Hide");
    },
    methods: {
        ...mapMutations({
            setWxid: "setWxid",
            setUserInfo: "setUserInfo",
        }),
        // 获取用户信息
        getUserMsg() {
            let wxid = this.wxid || uni.getStorageSync("wxid");
            if (wxid) {
                this.getUserInfo(wxid)
            } else {
                if (location.href.indexOf("wxid") >= 0) {
                    let wxid = this.$common.getQueryString("wxid");
					uni.setStorageSync("wxid", wxid);
					this.getUserInfo(wxid)
                } else {
                    this.$common.authH5();
                }
            }
		},
		// 获取信息
		getUserInfo(wxid) {
			this.$http
				.post(`/?r=api/user/info`, {
					wxid: wxid,
				})
				.then((response) => {
					if (response.code === 200) {
                        uni.setStorageSync("wxid", wxid);
                        uni.setStorageSync("userInfo", response.data);
						this.setWxid(wxid)
						this.setUserInfo(response.data);
					}
				});
		}
    },
};
</script>

<style lang="scss">
/*每个页面公共css */
@import "@/static/css/app.scss";
</style>
