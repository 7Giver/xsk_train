<template>
	<view>
		<view class="addinfor">
			<view class="vardnum">
				<view class="num">银行卡号码</view>
				<input type="text" v-model="card_no" />
			</view>
			<view class="vardnum">
				<view class="num">持卡人</view>
				<input type="text" v-model="name" />
			</view>
			<view class="vardnum">
				<view class="num">联系电话</view>
				<input type="text" v-model="mobile" />
			</view>
			<view class="sure" @click="addbank">确认绑定</view>
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
				card_no: '',
				name: '',
				mobile: '',
				id: ''
			}
		},
		onLoad: function(option) { //option为object类型，会序列化上个页面传递的参数
			console.log(option.id)
			this.id = option.id
		},
		computed: {
			...mapState(['userInfo', 'wxid']),
		},
		methods: {
			...mapMutations({
				setWxid: "setWxid",
				setUserInfo: "setUserInfo",
			}),
			// 添加银行卡信息
			addbank() {
				var str = /[1-9]\d{12,18}/
				var call =/^1[3|4|5|7|8][0-9]{9}$/
				if(!str.test(this.card_no)) {
					uni.showToast({
					    title: '请正确填写银行卡号!',
					    duration: 2000
					});
					return
				}else if(this.name == ''){
					uni.showToast({
					    title: '请填写姓名',
					    duration: 2000
					});
					return
				}else if(!call.test(this.mobile)) {
					uni.showToast({
					    title: '请正确填写手机号!',
					    duration: 2000
					});
					return
				}
				this.$http.post(`/?r=api/user/bank-edit`, {
					wxid: this.wxid,
					id: this.id,
					card_no: this.card_no,
					name: this.name,
					mobile: this.mobile
				}).then((res)=>{
					if(res.code == 200) {
						uni.showToast({
						    title: '绑定成功!',
						    duration: 1500
						});
						setTimeout(()=>{
							uni.navigateTo({
								url: 'money',
							})
						},1500)
					}else{
						console.log('code is not 200')
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.addinfor {
		padding: 40rpx;

		.vardnum {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			align-items: left;
			margin-top: 20rpx;

			.num {
				font-size: 36rpx;
				color: #333537;
				margin-left: 30rpx;
			}

			input {
				width: 100%;
				height: 90rpx;
				border: none;
				background: #F5F5F6;
				border-radius: 10rpx;
				margin-top: 20rpx;
				padding: 10rpx;
				margin-left: 12rpx;
			}
		}

		.sure {
			width: 640rpx;
			height: 96rpx;
			background: #FF594B;
			border-radius: 48rpx;
			text-align: center;
			line-height: 96rpx;
			font-size: 36rpx;
			color: #FFFFFF;
			margin: 400rpx auto;
		}
	}
</style>
