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

        // #ifdef H5
        uni.setStorageSync('state_ios_href', location.href)
        // #endif
    },
    onShow: function () {
        // console.log("App Show");
        // let url = 'http://dt.sousou.com/#/pages/mine/connection?nickname=Heiz&openid=o8MX9wwt5ozZ033IVjTqqNsM4c1A&headimgurl=http%3A%2F%2Fthirdwx.qlogo.cn%2Fmmopen%2Fvi_32%2FkFbNaxXYDdlzenEeANr0qW0tDY2WOaQLT1nAtySsEXwia2mITxEDTlRzA8dlUeHsuhOxyVHISU2oMhvGBtRdLxw%2F132&wxid=wpxgorng#/'
        // console.log(this.$common.getQueryString('wxid', url));
        this.getUserMsg();
    },
    onHide: function () {
        // console.log("App Hide");
    },
    methods: {
        ...mapMutations({
            setWxid: "setWxid",
            setUserInfo: "setUserInfo",
        }),
        // 获取用户信息
        async getUserMsg() {
            let wxid = this.wxid || uni.getStorageSync("wxid")
            // let wxid = 'kxepkmr7'
            if (wxid) {
                this.setWxid(wxid)
                await this.getUserInfo(wxid)
                // let info = uni.getStorageSync("userInfo")
                // info.id ? this.setUserInfo(info) : await this.getUserInfo(wxid)
            } else {
                if (location.href.indexOf("wxid") >= 0) {
                    let wxid = this.$common.getQueryString("wxid")
                    uni.setStorageSync("wxid", wxid)
                    this.setWxid(wxid)
					await this.getUserInfo(wxid)
                } else {
                    this.$common.authH5()
                }
            }
		},
		// 获取信息
		getUserInfo(wxid) {
            return new Promise((resolve, reject) => {
                this.$http
                    .post(`/?r=api/user/info`, {
                        wxid: wxid,
                    })
                    .then((response) => {
                        if (response.code === 200) {
                            uni.setStorageSync("userInfo", response.data)
                            this.setUserInfo(response.data)
                        } else if (response.code === -1) {
                            this.$api.msg(response.msg)
                            uni.removeStorageSync('wxid');
                            uni.removeStorageSync('userInfo');
                            setTimeout(() => {
                                location.reload()
                            }, 800)
                        }
                    });
            })
			
		}
    },
};
</script>

<style lang="scss">
/*每个页面公共css */
@import "@/static/css/app.scss";
</style>
