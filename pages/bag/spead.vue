<template>
	<view>
		<view class="spread">
			<text class="dpay" :class="index == 0 ? 'isActive' : ''" @click="daipay">待付款</text>
			<text class="haspay" :class="index == 1 ? 'isActive' : ''"@click="haspay">已付款</text>
		</view>
		<view class="spreadt">
			<text class="dpay">  </text>
			<text class="haspay" >已付款</text>
		</view>
		<view class="spead_item" v-if="index == 0">
			<view class="spead_list" v-for="(item,index) in recommend" :key="index">
				<view class="sl_l">
					<image :src="item.avatar" mode=""></image>
					<view class="sl_name">
						<text class="name">{{item.name}}</text>
						<text class="time">{{item.show_time}}</text>
					</view>
				</view>
				<view class="sl_r" @click="callit(item.mobile)">
					<image src="/static/image/bag/call3.png" mode=""></image>
					<text>电话</text>
				</view>
			</view>
		</view>
		<view class="spead_item" v-if="index == 1">
			<view class="spead_list" v-for="(item, index) in haspaylist" :key="index">
				<view class="sl_l">
					<image :src="item.avatar" mode=""></image>
					<view class="sl_name">
						<text class="name">{{item.name}}</text>
						<text class="time">{{item.show_time}}</text>
					</view>
				</view>
				<view class="sl_r2">
					<text class="add">{{item.price}}</text>
				</view>
			</view>
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
				index:0,
				page1:1,
				page2:1,
				recommend:[],
				haspaylist:[]
			};
		},
		// 下拉刷新
		onPullDownRefresh() {
			this.page1 = 1
			this.getrecommend(1)
			
		},
		// 上拉加载更多
		onReachBottom() {
			if(this.index == 0) {
				this.getrecommend(1)
			}else if(this.index == 1) {
				this.getrecommend(2)
			}
		},
		onShow() {
			this.getrecommend(1)
		},
		computed: {
			...mapState(['userInfo', 'wxid']),
		},
		methods:{
			...mapMutations({
				setWxid: "setWxid",
				setUserInfo: "setUserInfo",
			}),
			// 打电话
			callit(tel) {
				if(tel == '') {
					uni.showToast({
						title:'对方暂未填写手机号',
						duration:1500
					})
				}else{
					uni.makePhoneCall({
					    phoneNumber: tel
						
					  });
				}
				
			},
			daipay() {
				this.index = 0
				this.getrecommend(1)
			},
			haspay() {
				this.index = 1
				this.getrecommend(2)
			},
			// 待付款明细
			getrecommend(type) {
				this.$http.post(`/?r=api/user/recommend`,{
					wxid: this.wxid,
					type:type,
					page:this.page1
				}).then((res)=>{
					if(res.code == 200 && type == 1) {
						var data = res.data.list
						if(data.length<20 && this.page1 == 1) {
							this.recommend = data
							uni.showToast({title:'没有更多数据了',duration:1000})
						}else if(data.length<20 && this.page1 > 1){
							this.recommend = this.recommend.concat(data)
							uni.showToast({title:'没有更多数据了',duration:1000})
						}
						if(data.length >= 20 && this.page1 == 1) {
							this.page1+1
							this.recommend = data
						}else if(data.length >= 20 && this.page1 > 1){
							this.page1+1
							this.recommend = this.recommend.concat(data)
						}
						
					}else if(res.code == 200 && type == 2) {
						var data = res.data.list
						if(data.length<20 && this.page2 == 1) {
							this.haspaylist = data
							uni.showToast({title:'没有更多数据了',duration:1000})
						}else if(data.length<20 && this.page2 > 1){
							this.haspaylist = this.haspaylist.concat(data)
							uni.showToast({title:'没有更多数据了',duration:1000})
						}
						if(data.length >= 20 && this.page2 == 1) {
							this.page2+1
							this.haspaylist = data
						}else if(data.length >= 20 && this.page2 > 1){
							this.page2+1
							this.haspaylist = this.haspaylist.concat(data)
						}
					}else{
						console.log('code is not 200')
					}
					uni.stopPullDownRefresh()
				})
			}
		}
	}
</script>

<style lang="scss">
	.spread{
		position: fixed;
		top:0;
		left:0;
		border-bottom: 10rpx solid #f5f5f5;
		width:100%;
		display: flex;
		justify-content: space-around;
		align-items: center;
		padding:20rpx;
		background: #fff;
		z-index:99;
		.dpay{
			font-size: 36rpx;
			color:#999999;
		}
		
		.haspay{
			font-size: 36rpx;
			color:#999999;
		}
		.isActive{
			font-weight: 600;
			color:#333537;
		}
	}
	.spreadt{
		height:98rpx;
		border-bottom: 10rpx solid #f5f5f5;
	}
	.spead_item{
		padding:0 40rpx;
		.spead_list{
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-bottom:1rpx solid #f5f5f5;
			padding:30rpx 0;
			.sl_l{
				display: flex;
				justify-content: space-between;
				align-items: center;
				image{
					width:88rpx;
					height:88rpx;
					border-radius: 50%;
				}
				.sl_name{
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					align-items: left;
					margin-left: 20rpx;
					.name{
						font-size: 32rpx;
						color:#333537;
						font-weight: 600;
						margin-top: -8rpx;
						width:160rpx;
						overflow:hidden;
						text-overflow:ellipsis;
						white-space:nowrap;
					}
					.time{
						font-size: 26rpx;
						color:#999999;
						margin-top: 10rpx;
						
					}
				}
			}
			.sl_r{
				width:118rpx;
				height:50rpx;
				background: #FF423A;
				border-radius: 25rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				image{
					height:27rpx;
					width:24rpx;
				}
				text{
					font-size: 24rpx;
					color:#fff;
					margin-left: 4rpx;
				}
				
			}
			.sl_r2{
				background: #fff;
				.add{
					font-size: 32rpx;
					color:#FF5465;
					background: #fff;
				}
			}
		}
	}
</style>
