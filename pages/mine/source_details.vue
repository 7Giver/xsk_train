<template>
	<view id="app">
		<uni-nav-bar title="客源详情" left-icon="back" @clickLeft="back"></uni-nav-bar>
		<view class="banner">
			<image src="/static/image/pay/border.png" mode="widthFix">
		</view>
		<view class="header">
			<view class="item">客源姓名：<text>{{guest.name}}</text></view>
			<view class="item">客源区域：<text>{{guest.province}} {{guest.city}}</text></view>
			<view class="item"><view>日</view><view>期：</view><text>{{guest.add_time}}</text></view>
			<view class="item">联系电话：
				<text>{{guest.mobile}}</text>
				<view class="phone" @click="goCall(guest.mobile)">
					<image src="/static/image/index/icon_tel.png" mode="widthFix">
					<text>拨打</text>
				</view>
			</view>
		</view>
		<view class="block"></view>
		<view class="content">
			<view class="title">客源详情</view>
			<view class="source_detail">{{guest.detail || '暂无详情'}}</view>
			<view class="title">客源意向</view>
			<view class="source_block">
				<view :class="{'on':sourceIndex == 1}" @click="selectSource(1)">有意向</view>
				<view :class="{'on':sourceIndex == 2}" @click="selectSource(2)">无意向</view>
			</view>
			<view class="title">备注</view>
			<textarea v-model="guest.remark" placeholder="请输入备注信息"/>
		</view>
		<view class="submit_btn" @click="submit">更新信息</view>
	</view>
</template>

<script>
	import uniNavBar from "@/components/uni-nav-bar/uni-nav-bar.vue";
	export default {
		components: {
			uniNavBar
		},
		data() {
			return {
				guest: {}, // 客源信息
				sourceIndex: 1, //客源意向
			};
		},
		onLoad(option) {
			this.getSourceDetail(option.id)
		},
		methods: {
			// 获取客源详情
			getSourceDetail(id) {
				this.$http
					.post(`/?r=api/customer/detail`, {
						id: id
					})
					.then(response => {
						// console.log(response)
						if (response.code === 200) {
							this.guest = response.data
							this.sourceIndex = this.guest.is_tention
						}
					})
			},
			// 返回我的页面
			back() {
				uni.switchTab({
					url: '/pages/mine/mine'
				})
			},
			//选择客源意向
			selectSource(index) {
				index === 1 ? this.sourceIndex = 1 : this.sourceIndex = 2
			},
			// 调起电话
			goCall(tel) {
				uni.makePhoneCall({
    				phoneNumber: tel
				})
			},
			// 提交信息
			submit() {
				if(!this.guest.id) {
					this.$api.msg('缺少客源信息')
					return false
				}
				let obj = {
					id: this.guest.id,
					remark: this.guest.remark,
					is_tention: this.sourceIndex
				}
				// console.log(obj)
				this.$http
					.post(`/?r=api/customer/remark`, obj)
					.then(response => {
						// console.log(response)
						if (response.code === 200) {
							uni.showToast({
								title: '提交成功',
								icon: 'none',
								success: res => {
									setTimeout(() => {
										uni.redirectTo({
											url: '/pages/train/detail'
										})
									}, 600)
								}
							})
						}
					})
			}
		}
	}
</script>

<style lang="scss">
#app {
	padding-bottom: 120rpx;
	.banner {
		width: 100%;
		image {
			display: block;
			width: 100%;
		}
	}
	.header {
		padding-left: 36rpx;
		.item {
			display: flex;
			align-items: center;
			color: #232739;
			font-size: 28rpx;
			margin: 20rpx auto;
			letter-spacing: 1rpx;
			&:nth-child(3) {
				>:first-child {
					margin-right: 56rpx;
				}
			}
			.phone {
				display: flex;
				align-items: center;
				color: #2589FF;
				font-size: 26rpx;
				margin-left: 40rpx;
				padding: 8rpx 20rpx;
				border-radius: 30rpx;
				background: rgba(166,206,255, 0.3);
				image {
					display: block;
					width: 25rpx;
					margin-right: 10rpx;
				}
			}
			text {
				font-size: 28rpx;
				color: #9CA1B4;
			}
		}
	}
	.block {
		height: 20rpx;
		background: #F5F5F5;
	}
	.content {
		padding: 30rpx 36rpx;
		.title {
			display: flex;
			align-items: center;
			color: #403C3F;
			font-size: 36rpx;
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
		.source_detail {
			color: #666;
			font-size: 30rpx;
			margin: 40rpx auto;
			padding-left: 30rpx;
		}
		textarea {
			width: 100%;
			height: 240rpx;
			padding: 14rpx 24rpx;
			margin: 20rpx auto 30rpx;
			color: #333;
			font-size: 30rpx;
			border-radius: 10rpx;
			background: #F5F5F4;
		}
		.source_block {
			display: flex;
			align-items: center;
			margin: 30rpx auto;

			>view {
				color: #9CA1B4;
				width: 150rpx;
				font-size: 30rpx;
				text-align: center;
				line-height: 60rpx;
				margin-right: 50rpx;
				border-radius: 8rpx;
				background: #F5F5F4;
			}

			.on {
				color: #fff;
				background: #4B7EF6;
			}
		}
	}
	.submit_btn {
		position: fixed;
		bottom: 0;
		width: 100%;
		color: #fff;
		text-align: center;
		line-height: 110rpx;
		background: linear-gradient(90deg,rgba(255,86,100,1),rgba(255,61,47,1));
	}
}
</style>

