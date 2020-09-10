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
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		onShow() {

		},
		methods: {
			
		}
	}
</script>

<style lang="scss">
#app {
	padding-bottom: 40rpx;
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
		.border {
			display: block;
			width: 100%;
		}
	}
}
</style>
