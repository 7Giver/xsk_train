<template>
	<view id="app">
		<view class="header">
			<view class="avatar">
				<image src="/static/image/rank/user.png" mode=""></image>
			</view>
			<view class="nickname">马小跳</view>
		</view>
		<view class="content_block">
			<image class="border" src="/static/image/pay/border.png" mode="widthFix"></image>
			<view class="container">
				<view class="input_block">
					<view class="item">
						<view class="left">商户名称：
							<text class="clamp_one">{{guest.company}}</text>
						</view>
					</view>
					<view class="item">
						<view class="left">联系电话：
							<text class="clamp_one">{{guest.company_tel}}</text>
						</view>
					</view>
					<view class="item" v-if="guest.company_address">
						<view class="left">商户地址：
							<text class="clamp_two">{{guest.company_address || '尚未完善'}}</text>
						</view>
					</view>
				</view>
				<view class="title">您选择的客源数量</view>
				<view class="tip_block">
					<view>{{guest.customer_num}}+</view>
				</view>
				<view class="title">您选择的投放时长</view>
				<view class="tip_block">
					<view>{{guest.market_type}}个月</view>
				</view>
				<view class="title">您选择的投放区域</view>
				<view class="area_block">
					<view class="item" v-for="(item, index) in guest.area" :key="index">
						<view class="main">
							<text v-if="index == 0">区域一</text>
							<text v-else-if="index == 1">区域二</text>
							<text v-else>区域三</text>
							<view>
								<text>{{item.province}}</text>
								<text>{{item.city}}</text>
							</view>
						</view>
					</view>
				</view>
				<view class="title">赠品</view>
				<view class="gift_block">
					<view class="item">
						<view class="label">赠品 1</view>
						<view class="block">
							<view class="left">
								<image src="/static/image/pay/card.png" mode="widthFix"></image>
								<text>名片</text>
							</view>
							<div class="right">(点击预览)</div>
						</view>
					</view>
					<view class="item">
						<view class="label">赠品 2</view>
						<view class="block">
							<view class="left">
								<image src="/static/image/pay/ring.png" mode="widthFix"></image>
								<text>彩铃</text>
							</view>
							<div class="right">(点击预览)</div>
						</view>
					</view>
					<view class="item">
						<view class="label">赠品 3</view>
						<view class="block">
							<view class="left">
								<image src="/static/image/pay/routine.png" mode="widthFix"></image>
								<text>小程序</text>
							</view>
							<div class="right">(点击预览)</div>
						</view>
					</view>
				</view>
				<view class="title">支付方式</view>
				<view class="pay_list">
					<view class="item">
						<view class="left">
							<image src="/static/image/pay/wx.png" alt="" />
							<view>微信支付</view>
						</view>
						<image src="/static/image/pay/pay_check.png" mode=""></image>
						<!-- <image src="/static/image/pay/pay_nocheck.png" mode="" v-else></image> -->
					</view>
				</view>
			</view>
		</view>
		<!-- 协议 -->
		<view class="agreement" @click="checkagree">
			<view class="checked">
				<image v-if="agreement" src="/static/image/pay/check.png" mode=""></image>
				<image v-else src="/static/image/pay/nocheck.png" mode=""></image>
			</view>
			<view>我已阅读并同意<text @click.stop="goTrainService">《直通车投放服务协议》</text></view>
		</view>
		<!-- 底部 -->
		<view class="bottom">
			<view class="left">
				<view class="source">
					原价:<text>￥{{guest.money}}</text>
					<view class="coupon">立减: ￥{{guest.money-guest.amount}}</view>
				</view>
				<view class="real">
					实付:<text>￥{{guest.amount}}</text>
				</view>
			</view>
			<view class="right" @click="submit">立即支付</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				guest: {
					company: '大庆五金',
					company_tel: '13023367790',
					company_address: '五犯得上发射点反馈无法和是大家反馈进度反馈上空的飞机考虑俄方微风时空裂缝快乐圣诞节放假',
					customer_num: 100,
					market_type: 3,
					money: 1699,
					amount: 400,
					area: [
						{
							add_time: "1599786813",
							city: "呼和浩特",
							customers: "0",
							id: "454",
							order_id: "188",
							province: "内蒙古"
						},
						{
							add_time: "1599786813",
							city: "呼和浩特",
							customers: "0",
							id: "454",
							order_id: "188",
							province: "内蒙古"
						},
						{
							add_time: "1599786813",
							city: "呼和浩特",
							customers: "0",
							id: "454",
							order_id: "188",
							province: "内蒙古"
						}
					]
				},
				order_sn: '',
				agreement: true,
			};
		},
		onShow() {

		},
		methods: {

			// 直通车协议
			goTrainService() {
				uni.navigateTo({
					url: '/pages/pay/train_service?order_sn='+this.order_sn
				})
			},
		}
	}
</script>

<style lang="scss">
#app {
	padding-bottom: 150rpx;
	background: #F7F9FB;
	.header {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		padding: 70rpx 0 150rpx;
		background: url('/static/image/mine/header_bg.png') no-repeat center / 100% 100%;
		.avatar {
			width: 160rpx;
			height: 160rpx;
			image {
				display: block;
				width: 100%;
				height: 100%;
				border: 13rpx solid #fff;
				background: #fff;
				border-radius: 50%;
			}
		}
		.nickname {
			color: #fff;
			font-size: 30rpx;
			letter-spacing: 2rpx;
			margin-top: 14rpx;
		}
	}
	.content_block {
		margin: -110rpx 30rpx 0;
		padding: 0rpx 0 40rpx;
		border-radius: 14rpx;
		background: #fff;
		overflow: hidden;
		.border {
			display: block;
			width: 100%;
		}
		.container {
			padding: 0 30rpx;
			.input_block {
				padding: 20rpx 0;
				margin-bottom: 20rpx;
				border-bottom: 1px solid #F5F5F5;
				.item {
					display: flex;
					align-items: center;
					justify-content: space-between;
					font-size: 28rpx;
					line-height: 60rpx;
					.left {
						flex: 1;
						display: flex;
						white-space: nowrap;
						font-weight: bold;
						text {
							color: #9CA1B4;
							font-weight: normal;
						}
					}
					&:last-child {
						.left {
							text {
								line-height: 40rpx;
								margin-top: 12rpx;
							}
						}
					}
				}
			}
			.title {
				display: flex;
				align-items: center;
				color: #403C3F;
				font-size: 34rpx;
				text {
					color: #999999;
					font-size: 30rpx;
					padding-left: 10rpx;
				}
				&::before {
					content: "";
					display: block;
					width: 8rpx;
					height: 32rpx;
					margin-right: 18rpx;
					background: #4B7EF6;
				}
			}
			.tip_block {
				display: flex;
				align-items: center;
				padding: 30rpx 0;
				view {
					color: #fff;
					width: 150rpx;
					font-size: 30rpx;
					text-align: center;
					line-height: 60rpx;
					margin-right: 50rpx;
					border-radius: 8rpx;
					background: #4B7EF6;
				}
			}
			.area_block {
				.item {
					margin: 26rpx auto;
					.main {
						flex: 1;
						display: flex;
						align-items: center;
						justify-content: space-between;
						border: 1px solid #F0F0F0;
						font-size: 28rpx;
						padding: 16rpx 20rpx;
						border-radius: 10rpx;
						view {
							display: flex;
							align-items: center;
							color: #4B7EF6;
							image {
								display: block;
								width: 22rpx;
								margin-left: 20rpx;
							}
							text:first-child {
								margin-right: 20rpx;
							}
						}
					}
				}
			}
			.gift_block {

				.item {
					display: flex;
					align-items: center;
					justify-content: space-between;
					padding: 14rpx 20rpx;
					margin: 22rpx auto;
					border: 1px solid #F0F0F0;
					border-radius: 10rpx;
					.label {
						display: flex;
						align-items: center;
						font-size: 30rpx;
						white-space: nowrap;
						&::before {
							content: "";
							width: 10rpx;
							height: 10rpx;
							margin-right: 14rpx;
							border-radius: 50%;
							background: #FF4A48;
						}
					}
					.block {
						display: flex;
						align-items: center;
						justify-content: space-between;
						.left {
							display: flex;
							align-items: center;
							width: 168rpx;
							font-size: 28rpx;
							image {
								width: 56rpx;
								margin-right: 14rpx;
							}
						}
						.right {
							color: #249CFA;
							font-size: 24rpx;
						}
					}
				}
			}
			.pay_list {
				margin: 26rpx auto 0;
				border-top: 1px solid #F0F0F0;
				.item {
					display: flex;
					align-items: center;
					justify-content: space-between;
					padding: 16rpx 18rpx;
					border-bottom: 1px solid #F0F0F0;
					.left {
						display: flex;
						align-items: center;
						image {
							width: 60rpx;
							height: 60rpx;
							margin-right: 12rpx;
						}
						view {
							font-size: 32rpx;
							padding-bottom: 8rpx;
						}
					}
					image {
						width: 50rpx;
						height: 50rpx;
						border-radius: 50%;
					}
				}
			}
		}
	}
	.agreement {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 40rpx;
		.checked {
			padding-right: 10rpx;
			image {
				display: block;
				width: 28rpx;
				height: 28rpx;
				border-radius: 50%;
			}
		}
		view {
			color: #333;
			font-size: 24rpx;
			text {
				color: #4B7EF6;
			}
		}
	}
	.bottom {
		position: fixed;
		bottom: 0;
		display: flex;
		width: 100%;
		background: #fff;
		border-top: 1px solid #F0F0F0;
		.left {
			flex: 2;
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: 30rpx;
			padding: 0 30rpx;
			.source {
				color: #333;
				margin-right: 20rpx;
				.coupon {
					color: #FF423A;
					font-size: 24rpx;
					font-weight: bold;
				}
				text {
					color: #999;
					text-decoration: line-through;
				}
			}
			.real {
				color: #333;
				text {
					color: #FF423A;
					font-size: 40rpx;
					font-weight: bold;
				}
			}
		}
		.right {
			flex: 1;
			color: #fff;
			font-size: 32rpx;
			line-height: 120rpx;
			text-align: center;
			background: linear-gradient(90deg, #FF5664, #FF3D2F);
		}
	}
}
</style>
