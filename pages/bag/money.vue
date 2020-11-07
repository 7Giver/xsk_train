<template>
	<view>
		<view class="card_infor">
			<image src="/static/image/money/cardimg.png"></image>
			<text>银行卡信息</text>
		</view>
		<image src="/static/image/money/addcards.png" class="addcard" v-if="isShow" @click="addbank"></image>
		<view class="iscard" v-else v-for="(item, index) in banklist" :key="index">
			<view class="card_title">卡号</view>
			<view class="card_content">{{cardnum}}</view>
			<view class="card_button" @click="changecard(item.id)">（点击可修改银行卡）</view>
		</view>
		<view class="card_infor">
			<image src="/static/image/money/caiwuimg.png"></image>
			<text>现金提现</text>
		</view>
		<view class="tixian">
			<input type="number" v-model="price" />
			<text @click="getAllmoney">全部提现</text>
		</view>
		<view class="txbtn" @click="getmoney">去提现</view>
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
				price:'',
				allPrice: '', //全部可提现金额
				isShow:false,
				banklist:[],
				cardnum:''
			};
		},
		onShow() {
			this.getUserInfo()
			this.getbanklist()
		},
		computed: {
			...mapState(['userInfo', 'wxid']),
		},
		methods:{
			...mapMutations({
				setWxid: "setWxid",
				setUserInfo: "setUserInfo",
			}),
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
			getbanklist() {
				this.$http
					.post(`/?r=api/user/bank-list`, {
						wxid: this.wxid
					})
					.then((response) => {
						if (response.code === 200) {
							this.allPrice = response.data.commission
							if(response.data.list.length == 0) {
								this.isShow = true
							}else{
								this.banklist = response.data.list
								var cardnum = response.data.list[0].card_no
								var cardnum = cardnum.replace(/\s/g,'').replace(/(.{4})/g,"$1 ");
								this.cardnum = cardnum
							}
						}
					});
				
			},
			// 添加银行卡
			addbank() {
				uni.navigateTo({
					url: 'detail',
				});
			},
			// 修改银行卡号
			changecard(id) {
				uni.navigateTo({
					url: `detail?id=${id}`,
				});
			},
			// 全部提现
			getAllmoney() {
				if (this.allPrice) {
					this.price = this.allPrice
				} else {
					this.$api.msg('暂无提现金额')
				}
			},
			// 提现
			getmoney() {
				if (!this.banklist.length) {
					this.$api.msg('请添加银行卡')
					return false
				}
				if (!this.price) {
					this.$api.msg('请输入提现金额')
					return false
				}
				this.$http
					.post(`/?r=api/user/cash`, {
						wxid: this.wxid,
						price: this.price,
						bank_id: this.banklist[0].id
					})
					.then((response) => {
						if(response.code == 200) {
							uni.showToast({
								title:response.msg,
								duration: 1500
							})
							uni.navigateTo({
								url: '/pages/bag/bag'
							})
						}else if(response.code == 500){
							uni.showToast({
								title:response.msg,
								duration: 1500
							})
						}
					});
			}
		}
	}
</script>

<style lang="scss">
	.card_infor {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		padding: 20rpx;

		image {
			width: 40rpx;
			height: 40rpx;
		}

		text {
			font-size: 36rpx;
			color: #333537;
			margin-left: 20rpx;
		}
	}

	.addcard {
		width: 620rpx;
		height: 170rpx;
		margin-left: 50rpx;
		margin-top: 20rpx;
	}

	.iscard {
		width: 620rpx;
		height: 170rpx;
		margin-left: 50rpx;
		margin-top: 20rpx;
		background-image: url('/static/image/money/iscard.png');
		background-size: 100% 100%;
		padding:15rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: left;
		.card_title{
			font-size: 26rpx;
			color:#FFFFFF;
		}
		.card_content{
			font-size: 40rpx;
			color:#fff;
		}
		.card_button{
			font-size: 24rpx;
			color:#fff;
			width:240rpx;
			position: relative;
			left:350rpx;
		}
	}
	.tixian{
		border-bottom: 1rpx solid #F5F5F6;
		width:80%;
		margin:0 auto;
		display: flex;
		justify-content: space-between;
		align-items: center;
		text{
			font-size: 26rpx;
			color:#5887F5;
		}
	}
	.txbtn{
		width:640rpx;
		height:96rpx;
		background: #FF594B;
		border-radius: 48rpx;
		font-size: 36rpx;
		color:#fff;
		text-align: center;
		line-height:96rpx;
		margin:300rpx auto;
	}
</style>
