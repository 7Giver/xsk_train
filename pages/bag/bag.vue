<template>
	<view>
		<view class="my_bag">
			<view class="my_bag_t">
				<view class="my_money">
					<view class="my_tt">累计总金额(元)</view>
					<view class="my_num">{{wallet.total_commission}}</view>
				</view>
				<view class="my_mx" @click="mingxi">明细</view>
			</view>
			<view class="my_bag_b">
				<view class="my_ke">
					<view class="ke_top">可提现(元)</view>
					<view class="ke_bot">{{wallet.commission}}</view>
				</view>
				<view class="my_yi">
					<view class="yi_top">已提现(元)</view>
					<view class="yi_bot">{{wallet.is_withdraw}}</view>
				</view>
				<view class="my_today">
					<view class="today_top">今日收益(元)</view>
					<view class="today_bot">{{wallet.today_commission}}</view>
				</view>
			</view>
		</view>

		<view class="attention">
			<view class="att_list">温馨提示：</view>
			<view class="att_list">1. 提现需要1-5个工作日完成，请耐心注意查收银行</view>
			<view class="att_list">卡明细。</view>
			<view class="att_list">2. 每笔提现征收5%的个人所得税。</view>
			<view class="att_list" v-if="wallet.cash_limit">3. 最低提现额为{{wallet.cash_limit}}元人民币。</view>
		</view>

		<view class="tixian" @click="tomoney">去提现</view>
		<view class="yaoqing" @click="goNext('subject')">
			<image src="/static/image/bag/liwu.png" mode=""></image>
			<text>邀请有礼</text>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from "vuex";
	export default {
		data() {
			return {
				wallet:{}
			};
		},
		computed: {
			...mapState(['userInfo', 'wxid']),
		},
		onShow() {
			this.getUserInfo()
			this.goShare()
			this.getwallet()
		},
		methods: {
			...mapMutations({
				setWxid: "setWxid",
				setUserInfo: "setUserInfo",
			}),
			mingxi() {
				uni.navigateTo({
					url:'spead'
				})
			},
			tomoney() {
				uni.navigateTo({
					url: 'money',
				});
			},
			//获取用户信息
			getUserInfo() {
				this.$http
					.post(`/?r=api/user/info`, {
						wxid: this.wxid,
					})
					.then((response) => {
						if (response.code === 200) {
							this.setUserInfo(response.data);
						}
					});
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
			getwallet() {
				this.$http
					.post(`/?r=api/user/wallet`, {
						wxid: this.wxid
					})
					.then((response) => {
						if (response.code === 200) {
							this.wallet = response.data
						}
					});
			},
			// 页面跳转
			goNext(type) {
				switch (type) {
					case 'subject':
						uni.navigateTo({
							url: '/pages/index/subject'
						})
						break;

					default:
						break;
				}
			},
		}
	}
</script>

<style lang="scss">
	.my_bag {
		height: 320rpx;
		background: #4075F0;
		padding: 20rpx 40rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;

		.my_bag_t {
			display: flex;
			justify-content: space-between;
			align-items: center;
			width: 100%;

			.my_money {
				.my_tt {
					font-size: 26rpx;
					color: #FFFFFF;
				}

				.my_num {
					font-size: 50rpx;
					color: #FFFFFF;
					margin-top: 6rpx;
				}
			}

			.my_mx {
				width: 110rpx;
				height: 44rpx;
				border: 1rpx solid #fff;
				border-radius: 22rpx;
				font-size: 26rpx;
				color: #fff;
				text-align: center;
				line-height: 44rpx;
			}
		}

		.my_bag_b {
			display: flex;
			justify-content: space-between;
			align-items: center;
			width: 100%;

			.my_ke {
				position: relative;

				.ke_top {
					font-size: 26rpx;
					color: #CCDBFF;
				}

				.ke_bot {
					font-size: 36rpx;
					color: #fff;
				}
			}

			.my_ke::after {
				content: '';
				width: 1rpx;
				height: 40rpx;
				background: #fff;
				position: absolute;
				left: 200rpx;
				top: 20rpx;
			}

			.my_yi {
				position: relative;

				.yi_top {
					font-size: 26rpx;
					color: #CCDBFF;
				}

				.yi_bot {
					font-size: 36rpx;
					color: #fff;
				}
			}

			.my_yi::after {
				content: '';
				width: 1rpx;
				height: 40rpx;
				background: #fff;
				position: absolute;
				left: 200rpx;
				top: 20rpx;
			}

			.my_today {
				.today_top {
					font-size: 26rpx;
					color: #CCDBFF;
				}

				.today_bot {
					font-size: 36rpx;
					color: #fff;
				}
			}
		}
	}

	.attention {
		font-size: 28rpx;
		color: #999999;
		padding-left: 60rpx;
		margin-top: 200rpx;

		.att_list {
			margin-top: 10rpx;
		}
	}

	.tixian {
		width: 640rpx;
		height: 96rpx;
		background: #FF594B;
		border-radius: 48rpx;
		margin: 100rpx auto;
		font-size: 36rpx;
		color: #fff;
		text-align: center;
		line-height: 96rpx;
		margin-bottom: 40rpx;
	}

	.yaoqing {
		width: 640rpx;
		height: 96rpx;
		border-radius: 48rpx;
		margin: 20rpx auto;
		font-size: 36rpx;
		color: #FF4C56;
		text-align: center;
		line-height: 96rpx;
		border: 1rpx solid #FF4435;
		display: flex;
		justify-content: center;
		align-items: center;

		image {
			width: 40rpx;
			height: 36rpx;
		}

		text {
			margin-left: 10rpx;
		}
	}
</style>
