<template>
	<view id="app">
		<view class="banner">
            <image class="logo" src="/static/image/rank/banner.png" mode="widthFix"></image>
        </view>
		<view class="top_block">获取客户最多的<text>前50名</text>直通车用户</view>
		<view class="list_block">

			<view
				class="item"
				v-for="(item, index) in rankList"
				:key="index"
			>
				<div class="left">
					<view class="rank">
						<image src="/static/image/rank/rank1.png" mode="" v-if="index==0">
						<image src="/static/image/rank/rank2.png" mode="" v-if="index==1">
						<image src="/static/image/rank/rank3.png" mode="" v-if="index==2">
						<text v-if="index>2">{{index}}</text>
					</view>
					<image class="avatar" :src="item.avatar" mode="">
					<view class="name clamp_one">{{item.name}}</view>
				</div>
				<div class="right">
					已获取<text>{{item.cnt}}个</text>顾客
					<text class="random">+{{item.random}}</text>
				</div>
			</view>

		</view>
	</view>
</template>

<script>
	import { mapState, mapMutations } from "vuex";
	export default {
		data() {
			return {
				rankList: [],
			};
		},
		computed: {
			...mapState(['userInfo', 'wxid'])
		},
		onShow() {
			this.getRankData()
		},
		methods: {
			// 获客榜排行
			getRankData() {
				this.$http
					.post(`/?r=api/direct/rank`, {
						wxid: this.wxid
					})
					.then(response => {
						if (response.code === 200) {
							let result = response.data
							this.rankList = result
							this.rankList.forEach(item => {
								let random = Math.floor(Math.random()*(10-1))+1
								item.random = random
							})
						}
					});
			}
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
		margin: 30rpx auto 10rpx;
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
			padding: 30rpx 0;
			border-bottom: 1px solid #F5F5F5;
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
						border-radius: 50%;
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
					border-radius: 50%;
				}
				.name {
					flex: 1;
					color: #1A2742;
					font-size: 30rpx;
					font-weight: bold;
					padding-right: 20rpx;
				}
			}
			.right {
				position: relative;
				color: #5A6888;
				font-size: 28rpx;
				white-space: nowrap;
				text {
					color: #F85448;
					font-weight: bold;
				}
				.random {
					position: absolute;
					top: -34rpx;
					right: 80rpx;
					font-size: 26rpx;
					animation: mymove 1s;
					animation-timing-function: linear;
					opacity: 0;
				}
			}
			@keyframes mymove {
				0% {
					opacity: 1;
					top: -34rpx;
				}

				25% {
					opacity: 0.8;
					top: -38rpx;
				}

				50% {
					opacity: 0.4;
					top: -40rpx;
				}

				75% {
					opacity: 0.2;
					top: -48rpx;
				}

				100% {
					opacity: 0;
					top: -50rpx;
				}
			}

		}
	}
}
</style>
