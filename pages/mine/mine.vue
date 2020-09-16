<template>
	<view id="app" v-show="pageshow">
		<scroll-view class="scroll_content" scroll-y @scrolltolower="getMoreList">
			<view class="header">
				<view class="avatar">
					<image :src="userInfo.avatar" mode=""></image>
				</view>
				<view class="nickname">{{userInfo.nick_name}}</view>
			</view>
			<view class="content_block" v-if="!hasdetail">
				<view class="title">您希望增加多少客源？</view>
				<view class="tip_block">
					<view
						:class="{'on':clientIndex == index}"
						v-for="(item, index) in clientList"
						:key="index"
						@click="selectClient(index)"
					>
						{{item.label}}
					</view>
				</view>
				<view class="title">您希望投放的时长？</view>
				<view class="tip_block">
					<view
						:class="{'on':timeIndex == index}"
						v-for="(item, index) in timeList"
						:key="index"
						@click="selectTime(index)"
					>
						{{item.label}}
					</view>
				</view>
				<view class="title">您想要投放的区域？<text>(最多三个区域)</text></view>
				<view class="area_block">
					<view class="item" v-for="(item, index) in putInList" :key="index" v-cloak>
						<view class="main">
							<text v-if="index==0">区域一</text>
							<text v-else-if="index==1">区域二</text>
							<text v-else>区域三</text>
							<view>
								<picker
									:id="index"
									mode="multiSelector"
									@change="classifyChange"
									@columnchange="columnchange"
									:value="item.classifyIndex"
									:range="item.classifyArr"
									range-key="province"
								>
									<view>{{item.name}}</view>
								</picker>
							</view>
						</view>
						<view class="btn">
							<!-- <image src="/static/train/add.png" mode="widthFix" v-if="index==0 && putInList.length<3" @click="addArea"> -->
							<image src="/static/image/mine/minus.png" mode="widthFix" v-show="index!==0 && putInList.length>1" @click="delArea(index)">
						</view>
					</view>
					<view class="add" v-if="putInList.length<3" @click="addArea"></view>
				</view>
				<view class="title">怎么把客源给您?</view>
				<view class="form_block">
					<view class="input_block">
						<view class="must">手机号码</view>
						<input id="tel" type="number" v-model="guest.tel" @input="postMobile" maxlength="11" placeholder="请输入手机号码" placeholder-style="color:#D2D3D8" />
					</view>
					<view class="input_block">
						<view>商户名<text>(选填)</text></view>
						<input id="company" type="text" v-model="guest.name" placeholder="请输入商户名" placeholder-style="color:#D2D3D8"/>
					</view>
					<view class="input_block">
						<view>地址<text>(选填)</text></view>
						<input id="address" type="text" v-model="guest.address" placeholder="请输入地址" placeholder-style="color:#D2D3D8" />
					</view>
				</view>
				<view class="submit_btn" @click="submit">立即获客</view>
			</view>
			<div class="detial_block" v-else>
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
					<view class="title">您选择的投放区域</view>
					<view class="area_block">
						<view class="item" v-for="(item, index) in guest.areaList" :key="index">
							<view class="left">
								<text v-if="index==0">区域一</text>
								<text v-else-if="index==1">区域二</text>
								<text v-else>区域三</text>
								<text>{{item.province}}</text>
							</view>
							<view class="right">
								<text>{{item.city}}</text>
								<text>{{item.customers}}个</text>
							</view>
						</view>
					</view>
					<view class="title">您选择的客源数量<text>({{guest.customer_num}}+)</text></view>
					<progress :percent="guest.customer_percent" activeColor="#7FA6FF" show-info stroke-width="4" />
					<view class="title">投放时长进度<text>({{guest.market_type}}个月)</text></view>
					<progress :percent="guest.time_percent" activeColor="#7FA6FF" show-info stroke-width="4" />
					<view class="title">客源列表</view>
					<view class="list_block">
						<view class="main_title">
							<text>姓名</text>
							<text>区域</text>
							<text>状态</text>
							<text>日期</text>
							<text>详情</text>
						</view>
						<view class="client_list" v-if="customers.length !== 0">
							<view class="item" v-for="(item, index) in customers.slice(0,6)" :key="index" @click="goDetail(item.id)">
								<text>{{item.name}}</text>
								<text>{{item.city}}</text>
								<text v-if="item.is_tention==0">未选择</text>
								<text v-if="item.is_tention==1">有意向</text>
								<text v-if="item.is_tention==2">无意向</text>
								<text>{{item.add_time}}</text>
								<view>详情</view>
							</view>
						</view>
						<view class="more" v-if="!loadingMore && customers.length !== 0" @click="showMore">加载更多</view>
						<view class="listNone" v-if="customers.length == 0">暂无数据</view>
					</view>
				</view>
			</div>
			<uni-load-more v-if="customers.length>0 && loadingMore" :status="loadingType"></uni-load-more>
		</scroll-view>
		<view class="bottom_btn" @click="goNext" v-if="hasdetail">继续投放</view>
	</view>
</template>

<script>
	import { mapState, mapMutations } from "vuex";
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	export default {
		components: {
			uniLoadMore
		},
		data() {
			return {
				guest: {
					tel: '',
					company: '',
					address: '',
					company_tel: '',
					company_address: '',
				},
				clientIndex: 1, // 增加客源
				timeIndex: 1,  // 投放时长
				page: 1, // 分页
				pageshow: false, //页面显示
				hasdetail: false, //是否投放
				loadingMore: false, //显示更多
				loadingType: "more",
				customers: [],
				clientList: [
					{
						label: '20+',
						value: 20
					},
					{
						label: '100+',
						value: 100
					}
				],
				timeList: [
					{
						label: '1个月',
						value: 1
					},
					{
						label: '3个月',
						value: 3
					},
					{
						label: '6个月',
						value: 6
					},
				],
				childArr: [], // 二级分类数据源
				areaList: [],  // 地区数据
				checkList: [], //选择后的区域
				putInList: [
					{
						name: '选择区域',
						classifyIndex: [0, 0],
						classifyArr: [[], []]
					}
				]
			};
		},
		computed: {
    		...mapState(['userInfo', 'wxid'])
  		},
		onShow() {
			this.getAreaList()
			this.getGuestMsg()
			this.goShare()
			this.goShareCircle()
			setTimeout(() => {
				this.pageshow = true
				if (this.userInfo.is_direct == 1) {
					this.hasdetail = true
					this.getDetail()
					this.getClientList()
				}
			}, 400)
		},
		methods: {
			// 获取省市信息
			getAreaList() {
				this.$http
					.post(`/?r=api/index/district`, {})
					.then(response => {
						if (response.code === 200) {
							this.areaList = response.data
							this.getAllClassify()
						}
					});
			},
			// 获取缓存表单信息
			getGuestMsg() {
				let value = uni.getStorageSync('formData')
				if (value.tel) {
					this.guest.tel = value.tel
					this.guest.name = value.name
					this.guest.address = value.address
				}
			},
			// 获取直通车订单详情
			getDetail() {
				this.$http
					.post(`/?r=api/order/direct-detail`, {
						wxid: this.wxid
					})
					.then(response => {
						// console.log(response)
						if (response.code === 200) {
							this.guest = response.data
							this.getGuestMsg()
						}
					});
			},
			// 获取客源列表
			getClientList() {
				if (this.loadingType === 'noMore') {
				  //防止重复加载
				  return false;
				}
				this.loadingType = 'loading';
				this.$http
					.post(`/?r=api/order/customer-list`, {
						wxid: this.wxid,
						page: this.page
					})
					.then(response => {
						// console.log(response)
						if (response.code === 200) {
							let resultData = response.list;
							if (resultData.length > 0) {
								if (this.page == 1) {
									if (resultData.length < 10) {
										this.loadingType = 'noMore';
									} else {
										this.page++
										this.loadingType = 'more';
									}
									this.customers = resultData
								} else {
									this.page++
									if (resultData.length < 10) {
										this.loadingType = 'noMore';
									} else {
										this.loadingType = 'more';
									}
									this.customers = this.customers.concat(resultData)
								}
							} else {
								this.loadingType = 'noMore';
							}
						}
					});
			},
			//继续投放
			goNext() {
				this.hasdetail = !this.hasdetail
			},
			//客源显示更多
			showMore() {
				this.loadingMore = true
			},
			// 跳转客源详情
			goDetail(id) {
				// console.log(index)
				// return false
				uni.navigateTo({
					url: '/pages/mine/source_details?id='+id
				})
			},
			// 分页加载
			getMoreList(e) {
				// console.log(e)
				this.loadingMore ? this.getClientList() : false
			},
			// 选择客源数
			selectClient(index) {
				this.clientIndex = index
				index == 0 ? this.total_cash = 499 : this.total_cash = 1699
			},
			// 选择投放时长
			selectTime(index) {
				this.timeIndex = index
			},
			// 添加地区
			addArea() {
				this.putInList.push({
					name: '选择区域',
					classifyIndex: [0, 0],
					classifyArr: [[], []]
				})
				this.getAllClassify()
			},
			// 删除地区
			delArea(index) {
				this.putInList.splice(index, 1)
			},
			// 初始化数据
			getAllClassify() {
				this.areaList.forEach((item, index) => {
					this.childArr.push(item.city)
				})
				this.putInList.forEach((item, index) => {
					item.classifyArr[0] = this.areaList
					item.classifyArr[1] = this.childArr[0]
				})
			},
			// 选择地区index
			classifyChange(e) {
				let index = Number(e.target.id)
				let value = e.target.value
				let item = this.putInList[index]
				item.classifyIndex = value
				if (item.classifyArr[0].length !== 0) {
					item.name = item.classifyArr[0][item.classifyIndex[0]].province
				}
				if (item.classifyArr[1].length !== 0) {
					item.name += ' ' + item.classifyArr[1][item.classifyIndex[1]]
				}
				this.changeArray()
			},
			// 获取二级
			columnchange(e) {
				let index = Number(e.target.id)
				let item = this.putInList[index]
				if (e.detail.column == 0) {
					item.classifyArr[1] = this.childArr[e.detail.value]
				}
			},
			// 区域去重
			changeArray() {
				let arr = this.putInList.filter(item => item.name !== '选择区域')
				let res = new Map()
				let newArr = arr.filter((a) => !res.has(a.name) && res.set(a.name, 1))
				if (newArr.length !== arr.length) {
					this.$api.msg('区域不得重复');
					this.putInList = newArr
				}
				this.getCheckList(newArr)
			},
			// 获取选中地址
			getCheckList(res) {
				let arr = []
				res.forEach(item => {
					arr.push(item.name)
				})
				let result = []
				arr.forEach(item => {
					result.push(item.split(' '))
				})
				let newArr = []
				result.forEach(item => {
					newArr.push({
						province: item[0],
						city: item[1]
					})
				})
				this.checkList = [...new Set(newArr)]
			},
			// 监听手机号输入
			postMobile(e) {
				let value = e.target.value
				if (value.length == 11) {
					if (!(/^1[3456789]\d{9}$/.test(value))) {
						this.$api.msg('请输入正确的手机号')
						return false
					}
					this.$http
						.post(`/?r=api/index/mobile`, {
							wxid: this.wxid,
							mobile: this.guest.tel
						})
						.then(response => {
							if (response.code === 200) {
								let result = response.data
								this.$set(this.guest, 'company_name', result.company)
								this.$set(this.guest, 'address', result.address)
								if (result.company_id) {
									this.$set(this.guest, 'company_id', result.company_id)
								}
							}
						})
				}
			},
			// 调用微信自定义分享
			goShare() {
				let url = location.origin + '/#' + location.href.split('#')[1]
				let obj = {
					title: `快速获客`,
					desc: `海量精准客源等你来领`,
					shareUrl: url,
					imgUrl: `${this.$dataURL}/image/d7/d7fadb2c8ee2b68a8d43f693b4027527.png`
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
					})
				}
				// #endif
			},
			// 调用微信分享朋友圈
			goShareCircle() {
				let url = location.origin + '/#' + location.href.split('#')[1]
				let obj = {
					title: `快速获客`,
					shareUrl: url,
					imgUrl: `${this.$dataURL}/image/d7/d7fadb2c8ee2b68a8d43f693b4027527.png`
				}
				// #ifdef H5
				if (this.$jwx && this.$jwx.isWechat()) {
					this.$jwx.initJssdk(res => {
						let shareData = {
							title: obj.title, // 分享标题
							shareUrl: obj.shareUrl, // 分享链接
							imgUrl: obj.imgUrl, // 分享图标
						}
						this.$jwx.onMenuShareTimeline(shareData, function(response) {
							// console.log('response', response)
						})
					})
				}
				// #endif
			},
			// 直通车下单
			submit() {
				if (!this.wxid) {
					this.$api.msg('缺少wxid 无法下单')
					return false
				}
				if (!this.guest.tel) {
					this.$api.msg('请输入手机号')
					return false
				}
				if (!(/^1[3456789]\d{9}$/.test(this.guest.tel))) {
					this.$api.msg('请输入正确的手机号')
					return false
				}
				if (!this.checkList.length) {
					this.$api.msg('请选择投放区域')
					return false
				}
				if (this.checkList.length !== this.putInList.length) {
					this.$api.msg('请选择投放区域')
					return false
				}
				let obj = {
					tel: this.guest.tel,
					company: this.guest.name || '',
					address: this.guest.address || '',
					wxid: this.wxid,
					area: this.checkList,
					customers: this.clientList[this.clientIndex].value,
					type: this.timeList[this.timeIndex].value
				}
				let storage = {
					tel: this.guest.tel,
					name: this.guest.name || '',
					address: this.guest.address || '',
				}
				uni.setStorageSync('formData', storage)
				// console.log(obj)
				// return false
				this.$http
					.post(`/?r=api/order/direct-submit`, obj)
					.then(response => {
						// console.log(response)
						if (response.code === 200) {
							uni.navigateTo({
								url: `/pages/pay/pay?order_sn=${response.data.order_sn}`
							})
						}
					});
			}
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
		padding: 40rpx 0 190rpx;
		background: url('/static/image/mine/header_bg.png') no-repeat center / 100% 100%;
		.avatar {
			width: 140rpx;
			height: 140rpx;
			image {
				display: block;
				width: 100%;
				height: 100%;
				border: 8rpx solid #fff;
				background: #fff;
				border-radius: 50%;
			}
		}
		.nickname {
			color: #fff;
			font-size: 32rpx;
			font-weight: bold;
			letter-spacing: 2rpx;
			margin-top: 8rpx;
		}
	}
	.content_block {
		margin: -170rpx 30rpx 0;
		padding: 30rpx 30rpx 40rpx;
		border-radius: 14rpx;
		background: #fff;
		.title {
			display: flex;
			align-items: center;
			color: #101E38;
			font-size: 32rpx;
			text {
				color: #999999;
				font-size: 28rpx;
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
			padding: 20rpx 0;
			view {
				color: #5A6888;
				width: 160rpx;
				font-size: 30rpx;
				text-align: center;
				line-height: 60rpx;
				margin-right: 30rpx;
				border-radius: 10rpx;
				background: #F5F5F4;
			}
			.on {
				color: #fff;
				background: #4B7EF6;
			}
		}
		.area_block {
			.item {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin: 26rpx auto;
				.main {
					flex: 1;
					display: flex;
					align-items: center;
					justify-content: space-between;
					border: 1px solid #F0F0F0;
					font-size: 28rpx;
					padding: 16rpx 28rpx;
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
					}
				}
				.btn {
					width: 70rpx;
					padding-left: 18rpx;
					overflow: hidden;

					>image {
						display: block;
						width: 52rpx;
					}
				}
			}
			.add {
				width: 300rpx;
				height: 46rpx;
				margin: 0 auto 30rpx;
				background: #D8D8D8;
				position: relative;
				&::before,
				&::after {
					content: "";
					position: absolute;
					height: 30rpx;
					width: 2px;
					top: 4px;
					left: 50%;
					background: #fff;
				}
				&::after {
					transform: rotate(90deg);
				}
			}
		}
		.form_block {
			padding-bottom: 30rpx;
			.input_block {
				display: flex;
				align-items: center;
				margin: 30rpx auto;
				padding: 0 20rpx;
				line-height: 80rpx;
				border-radius: 10rpx;
				border: 1px solid #EDEDEF;
				.must::before {
					content: "*";
					color: #FC3849;
					font-size: 32rpx;
					margin-right: 8rpx;
				}
				view {
					color: #3E485A;
					width: 210rpx;
					font-size: 30rpx;
					text {
						font-size: 26rpx;
						margin-left: 4rpx;
					}
				}
				input {
					font-size: 28rpx;
				}
			}
		}
		.submit_btn {
			color: #fff;
			font-size: 36rpx;
			line-height: 90rpx;
			letter-spacing: 2rpx;
			border-radius: 20rpx;
			text-align: center;
			background: linear-gradient(90deg, #FF5664, #FF3E30);
		}
	}
	.detial_block {
		margin: -170rpx 30rpx 120rpx;
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
			.area_block {
				.item {
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin: 22rpx auto;
					border: 1px solid #F5F5F5;
					border-radius: 10rpx;
					view {
						flex: 1;
						display: flex;
						align-items: center;
						justify-content: space-between;
						font-size: 30rpx;
						line-height: 66rpx;
						padding: 0 14rpx;
					}
					.right {
						text:last-child {
							text-align: right;
							color: #FF4947;
						}
					}
				}
			}
			progress {
				padding: 30rpx 0 0;
			}
			.list_block {
				height: calc(100% - 700px);
				padding-top: 30rpx;
				.main_title {
					display: flex;
					align-items: center;
					justify-content: space-around;
					color: #774B4D;
					font-size: 26rpx;
					font-weight: bold;
					line-height: 66rpx;
					background: #F9F1E8;
					text {
						flex: 1;
						text-align: center;
						&:nth-child(4) {
							flex: 1.8;
						}
						&:nth-child(5) {
							flex: 1.1;
						}
					}
				}
				.client_list {
					.item {
						display: flex;
						align-items: center;
						justify-content: space-around;
						color: #786566;
						font-size: 26rpx;
						padding: 20rpx 0;
						border-bottom: 1px solid #EEE7E4;
						* {
							flex: 1;
							text-align: center;
							&:nth-child(4) {
								flex: 1.8;
							}
							// &:nth-child(5) {
							// 	flex: 1.1;
							// }
						}
						view {
							display: flex;
							align-items: center;
							justify-content: center;
							color: #4B7EF6;
							image {
								width: 36rpx;
								border-radius: 50%;
							}
							&::after {
								content: "";
								width: 12rpx;
								height: 12rpx;
								border-top: 1px solid #4B7EF6;
								border-right: 1px solid #4B7EF6;
								transform: rotate(45deg);
								margin-left: 4rpx;
							}
						}
					}
				}
				.more {
					display: flex;
					align-items: center;
					justify-content: center;
					color: #4B7EF6;
					font-size: 28rpx;
					line-height: 90rpx;
					text-align: center;
					letter-spacing: 1px;
					&::after {
						content: "";
						width: 12rpx;
						height: 12rpx;
						border-top: 1px solid #4B7EF6;
						border-right: 1px solid #4B7EF6;
						transform: rotate(135deg);
						margin-left: 10rpx;
						margin-bottom: 12rpx;
					}
				}
				.listNone {
					display: flex;
					align-items: center;
					justify-content: center;
					height: 180rpx;
					color: #999;
					font-size: 28rpx;
				}
			}
		}
	}
	.bottom_btn {
		position: fixed;
		bottom: 100rpx;
		width: 100%;
		color: #fff;
		font-size: 32rpx;
		line-height: 96rpx;
		text-align: center;
		letter-spacing: 1px;
		background: linear-gradient(90deg, #FF5664, #FF3D2F);
	}
}
</style>
