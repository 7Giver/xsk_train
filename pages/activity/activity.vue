<template>
	<view id="app">
		<image src="/static/image/activity/national_poster.png" mode="widthFix"></image>
		<view class="has_btn" @click.stop="goNext('activity')">参与活动 免费领礼</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		onShow() {
			this.goShare()
		},
		methods: {
			// 跳转页面
			goNext(type) {
				switch (type) {
					case 'activity':
						uni.switchTab({
							url: '/pages/mine/mine'
						})
						break;
				}
			},
			// 调用微信自定义分享
			goShare() {
				let obj = {
					title: `中秋国庆放狠价`,
					desc: `双节期间开通搜搜直通车，领取价值千元礼包`,
					shareUrl: this.$common.WxShareUrl(),
					imgUrl: `${this.$dataURL}/image/58/580a19df160423578b741b96af3f450c.png`
				}
				// #ifdef H5
				if (this.$jwx && this.$jwx.isWechat()) {
					this.$jwx.initJssdk(res => {
						let shareData = {
							title: obj.title, // 分享标题
							desc: obj.desc, // 分享描述
							shareUrl: obj.shareUrl, // 分享链接
							imgUrl: obj.imgUrl, // 分享图标
						}
						this.$jwx.onMenuShareAppMessage(shareData, function(response) {
							// console.log('response', response)
						})
						//朋友圈分享
						let shareData1 = {
							title: obj.title, // 分享标题
							shareUrl: obj.shareUrl, // 分享链接
							imgUrl: obj.imgUrl, // 分享图标
						}
						this.$jwx.onMenuShareTimeline(shareData1, function(response) {
							// console.log('response', response)
						})
					})
				}
				// #endif
			},
		}
	}
</script>

<style lang="scss">
#app {
	image {
		display: block;
		width: 100%;
	}

	.has_btn {
		position: fixed;
		left: 50%;
		bottom: 70rpx;
		transform: translate(-50%,-50%);
		width: 80%;
		color: #FEEACF;
		font-weight: bold;
		text-align: center;
		font-size: 38rpx;
		line-height: 90rpx;
		letter-spacing: 1rpx;
		border-radius: 130rpx;
		background: linear-gradient(90deg, #DB2848, #E24B36);
	}
}
</style>