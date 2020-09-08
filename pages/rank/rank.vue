<template>
	<view id="app">
		<view class="banner">
            <image class="logo" src="/static/image/rank/banner.png" mode="widthFix"></image>
        </view>
		<view class="top_block">获取客户最多的<text>前50名</text>直通车用户</view>
		<view class="list_block">
			<view class="item">
				<div class="left">
					<view class="rank">
						<image src="/static/image/rank/rank1.png" mode="">
						<!-- <image src="/static/image/rank/rank2.png" mode=""> -->
						<!-- <image src="/static/image/rank/rank3.png" mode=""> -->
					</view>
					<image class="avatar" src="/static/image/rank/user.png" mode="">
					<view class="name">把啦啦小魔仙</view>
				</div>
				<div class="right">已获取<text>965个</text>顾客</div>
			</view>
			<view class="item">
				<div class="left">
					<view class="rank">
						<image src="/static/image/rank/rank2.png" mode="">
						<!-- <image src="/static/image/rank/rank2.png" mode=""> -->
						<!-- <image src="/static/image/rank/rank3.png" mode=""> -->
					</view>
					<image class="avatar" src="/static/image/rank/user.png" mode="">
					<view class="name">把啦啦小魔仙</view>
				</div>
				<div class="right">已获取<text>965个</text>顾客</div>
			</view>
			<view class="item">
				<div class="left">
					<view class="rank">
						<image src="/static/image/rank/rank3.png" mode="">
						<!-- <image src="/static/image/rank/rank2.png" mode=""> -->
						<!-- <image src="/static/image/rank/rank3.png" mode=""> -->
					</view>
					<image class="avatar" src="/static/image/rank/user.png" mode="">
					<view class="name">把啦啦小魔仙</view>
				</div>
				<div class="right">已获取<text>965个</text>顾客</div>
			</view>
			<view class="item" v-for="(item, index) in 6" :key="index">
				<div class="left">
					<view class="rank">
						<text>{{'0'+(4+index)}}</text>
					</view>
					<image class="avatar" src="/static/image/rank/user.png" mode="">
					<view class="name">把啦啦小魔仙</view>
				</div>
				<div class="right">已获取<text>965个</text>顾客</div>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss">
#app {
	.banner {
        width: 100%;
        image {
			display: block;
            width: 100%;
        }
    }
	.top_block {
		width: 80%;
		margin: 30rpx auto;
		padding: 20rpx 30rpx;
		color: #FF5858;
		font-size: 28rpx;
		text-align: center;
		border-radius: 80rpx;
		background: #FFEDF7;
		text {
			font-weight: bold;
		}
	}
	.list_block {
		padding: 0 30rpx;

		.item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 50rpx;
			.left {
				display: flex;
				align-items: center;
				.rank {
					width: 50rpx;
					height: 50rpx;
					image {
						display: block;
						width: 100%;
						height: 100%;
					}
					text {
						color: #B2B8C2;
						font-size: 34rpx;
					}
				}
				.avatar {
					display: block;
					width: 90rpx;
					height: 90rpx;
					margin: 0 20rpx;
				}
				.name {
					color: #1A2742;
					font-size: 30rpx;
					font-weight: bold;
				}
			}
			.right {
				color: #5A6888;
				font-size: 30rpx;
				text {
					color: #F85448;
					font-weight: bold;
				}
			}
		}
	}
}
</style>
