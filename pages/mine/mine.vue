<template>
	<view id="app">
		<view class="header">
			<view class="avatar">
				<image src="/static/image/rank/user.png" mode=""></image>
			</view>
			<view class="nickname">马小跳</view>
		</view>
		<view class="content_block">
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
					<input id="tel" type="number" v-model="guest.tel" @input="getDetail" maxlength="11" placeholder="请输入手机号码" placeholder-style="color:#D2D3D8" />
				</view>
				<view class="input_block">
					<view>商户名<text>(选填)</text></view>
					<input id="company" type="number" v-model="guest.company" placeholder="请输入商户名" placeholder-style="color:#D2D3D8"/>
				</view>
				<view class="input_block">
					<view>地址<text>(选填)</text></view>
					<input id="address" type="number" v-model="guest.address" placeholder="请输入地址" placeholder-style="color:#D2D3D8" />
				</view>
			</view>
			<view class="submit_btn">提交</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				guest: {},
				clientIndex: 1, // 增加客源
				timeIndex: 1,  // 投放时长
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
		onShow() {
			this.getAreaList()
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
			// 上传合法手机号，获取信息
			postMobile(tel) {
				this.$http
					.post(`/?r=api/index/mobile`, {
						wxid: this.setObj.wxid,
						mobile: tel
					})
					.then(response => {
						// console.log(response)
						if (response.code === 200) {
							let result = response.data
							this.$set(this.guest, 'company_name', result.company)
							this.$set(this.guest, 'address', result.address)
							if (result.company_id) {
								this.$set(this.guest, 'company_id', result.company_id)
							}
						}
					})
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
					uni.showToast({
						title: '区域不得重复',
						icon: 'none'
					});
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
			getDetail(e) {
				let value = e.target.value
				if (value.length == 11) {
					if (!(/^1[3456789]\d{9}$/.test(value))) {
						uni.showToast({
							title: '请输入正确的手机号',
							icon: 'none',
						});
						return false
					}
					// this.postMobile(this.guest.tel)
				}
			},
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
		padding: 40rpx 30rpx;
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
			padding: 40rpx 0;
			view {
				color: #5A6888;
				width: 160rpx;
				font-size: 30rpx;
				text-align: center;
				line-height: 60rpx;
				margin-right: 40rpx;
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
}
</style>
