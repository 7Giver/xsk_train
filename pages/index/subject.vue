<template>
	<view id="app">
		<view class="header">
			<image class="bg_img" src="/static/image/index/pic_1.png" mode="widthFix"></image>
			<view class="msg_block">
				<view class="title">直通车累计为<text>{{randomObj.client}}</text>位用户提供了</view>
				<view class="train_data">
					<view class="item">
						<view>人脉</view>
						<view>{{randomObj.friendShip}}</view>
					</view>
					<view class="item">
						<view>需求</view>
						<view>{{randomObj.demand}}</view>
					</view>
					<view class="item">
						<view>订单</view>
						<view>{{randomObj.orders}}</view>
					</view>
				</view>
				<!-- 公告 -->
				<view class="notice">
					<image class="icon_l" src="/static/image/index/icon_lb.png" mode=""></image>
					<view class="cont">
						<swiper vertical="true" autoplay="true" circular="true" class="notice_swiper" @change="goRandom">
							<swiper-item v-for="(item, index) in noticeList" :key="index">
								<view><text>{{item.nickname}}</text>{{randomTime}}分钟前成功开通直通车</view>
							</swiper-item>
						</swiper>
					</view>
				</view>
			</view>
		</view>
		<view class="container">
			<view class="train_block" style="padding-bottom:40rpx">
				<view class="title">搜搜直通车简介</view>
				<view class="content">
					<view class="text">搜搜集团旗下搜搜直通车，于2015年起，已累计为17万客户提供了<text>2500多万客源</text>，以及超过5亿人次的品牌曝光。与<text>百度</text>、<text>360</text>、<text>搜狗</text>建立稳定持续的战略合作关系。搜索引擎代理投放产业发起者，树立了行业品牌标杆持续引领行业发展。</view>
				</view>
				<view class="show_more" @click="showMore">查看更多</view>
			</view>
			<view class="train_block">
				<view class="title">每日签单真实案例</view>
				<view class="content">
					<scroll-view class="scroll-view" scroll-x="true" @scroll="scroll">
						<view class="scroll-view-item" v-for="(item, index) in showList" :key="index" @click="fullImg(index)">
							<image :src="item" mode=""></image>
						</view>
                	</scroll-view>
				</view>
			</view>
			<view class="train_block">
				<view class="title">直通车投放效果展示</view>
				<view class="content">
					<scroll-view class="scroll-view" scroll-x="true" @scroll="scroll_video">
						<!-- <view class="video_block" v-for="(item, index) in videoList" :key="index">
							<video 
								id="myVideo"
								:src="item.video"
								:poster="item.poster"
								:muted="true"
								:show-fullscreen-btn="true"
								:enable-progress-gesture="false"
								:object-fit="index == 0 ? 'contain' : 'fill'"
								@error="videoErrorCallback"
								controls
							>
							</video>
						</view> -->
						<view class="effect_block" v-for="(item, index) in effectList" :key="index" @click="effectFullImg(index)">
							<image :src="item" mode=""></image>
						</view>
                	</scroll-view>
				</view>
			</view>
			<view class="icon_block">
				<view class="item" v-for="(item,index) in icon_list" :key="index">
					<image :src="item.icon" mode="widthFix"></image>
					<view>{{item.title}}</view>
				</view>
			</view>
			<view class="train_block">
				<view class="title">直通车获客流程</view>
				<view class="content">
					<image src="/static/image/index/pic_2.png" mode="widthFix"></image>
				</view>
			</view>
			<view class="train_block">
				<view class="title">三大服务助您获客</view>
				<view class="content">
					<image src="/static/image/index/pic_3.png?v=7" mode="widthFix"></image>
				</view>
			</view>
		</view>
		<view class="confim_btn" @click="goNext('mine')">
			<view>点击立即开启直通车</view>
			<text>无限量自动领取精准客户</text>
			<!-- <image class="finger" src="/static/image/index/finger.gif" mode="widthFix"> -->
		</view>
		<!-- 活动弹窗 -->
    <uni-popup
      :show="activityDailog"
      type="center"
      :animation="true"
      :custom="true"
      :mask-click="true"
      @change="activityChange"
    >
      <view class="activity_block">
        <view class="activity">
          <image :src="activity.poster" mode="widthFix"></image>
          <!-- 跳转活动页 -->
          <!-- <view class="look btn" @click.stop="goNext('national')">
            {{ activity.btn }}
          </view> -->
          <!-- 双11跳转我的 -->
          <view class="look btn" @click.stop="goNext('mine')">
            {{ activity.btn }}
          </view>
        </view>
        <image
          class="close"
          src="/static/image/activity/close.png"
          mode=""
          @click="activityClose"
        ></image>
      </view>
    </uni-popup>
	</view>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import UniPopup from "@/components/uni-dialog/uni-dialog.vue";

	export default {
		components: {
			UniPopup,
		},
		data() {
			return {
				randomObj: {  //随机数对象
					client: 170360,
					friendShip: 25013580,
					demand: 23645894,
					orders: 15261843,
				},
				randomTime: 0, //随机时间
				old: {
					scrollTop: 0
				},
				effectList: [
					'/static/image/index/show1.png',
					'/static/image/index/show2.png',
					'/static/image/index/show3.png',
					'/static/image/index/show4.png',
					'/static/image/index/show5.png',
					'/static/image/index/show6.png',
				],
				videoList: [
					{
						video: `${this.$dataURL}/video/e7/e71468eca4550533548846b5f85bd8ba.mp4`,
						poster: `${this.$dataURL}/image/2b/2bd5f6fab5ab32b24998be5b8f6f636a.png`,
					},
					{
						video: `${this.$dataURL}/video/73/7309a5c693660ea4071fe5613733db98.mp4`,
						poster: `${this.$dataURL}/image/e5/e5f74955ab746c7c561243eff0ad7dfd.png`,
					},
					{
						video: `${this.$dataURL}/video/f3/f3469a54e71d0b9e953f9b4250f07845.mp4`,
						poster: `${this.$dataURL}/image/e5/e5f74955ab746c7c561243eff0ad7dfd.png`,
					},
					{
						video: `${this.$dataURL}/video/f4/f4766f3383374a9764b5721517ac8a72.mp4`,
						poster: `${this.$dataURL}/image/ca/ca51a428173f57d46205933c8ec53d2d.png`,
					},
				],
				noticeList: [
					{nickname: '彭万*'},
					{nickname: '林*'},
					{nickname: '范长*'},
					{nickname: '王*'},
					{nickname: '范长*'},
					{nickname: '洪学*'},
					{nickname: '吴国*'},
					{nickname: '张*'},
					{nickname: '孙杵*'},
					{nickname: '孙书*'},
					{nickname: '郝爱*'},
				],
				icon_list: [
					{
						icon: '/static/image/index/icon_jzdw.png',
						title: '精准定位'
					},
					{
						icon: '/static/image/index/icon_zjxz.png',
						title: '专家协助'
					},
					{
						icon: '/static/image/index/icon_xgjf.png',
						title: '效果计费'
					},
					{
						icon: '/static/image/index/icon_lhkk.png',
						title: '灵活可控'
					}
				],
				showList: [],
				activityDailog: false, //活动弹窗
				activityTimer: null, // 活动定时器
				activity: {
					poster: "/static/image/activity/double11.png",
					btn: "立即参与",
				}, //活动对象
			};
		},
		computed: {
    	...mapState(['userInfo', 'wxid'])
  	},
		onShow() {
			uni.setNavigationBarTitle({
				title: "搜搜直通车快速获客"
			})
			this.getUserInfo()
			this.initActivity();
			this.getShowList()
			this.setRandom()
			this.goRandom()
		},
		onUnload() {
			this.clearTimer();
		},
		methods: {
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
							this.goShare()
						}
					});
			},
			getShowList() {
				this.$http
					.post(`/?r=api/index/safe`, {})
					.then(response => {
						if (response.code === 200) {
								// console.log(response);
								this.showList = response.data.list
						}
					})
			},
			scroll(e) {
				// console.log(e)
				this.old.scrollTop = e.detail.scrollTop
			},
			scroll_video(e) {

			},
			// 全屏展示图片
			fullImg(index) {
				uni.previewImage({
					urls: this.showList,
					current: index
				})
			},
			effectFullImg(index) {
				uni.previewImage({
					urls: this.effectList,
					current: index
				})
			},
			//首页随机数
			setRandom() {
				let plus = Math.floor(Math.random()*(100-10))+10
				let randomObj = uni.getStorageSync('randomObjV2')
                if (randomObj) {
					randomObj.client = randomObj.client*1 + plus
					randomObj.friendShip = randomObj.friendShip*1 + plus
					randomObj.demand = randomObj.demand*1 + plus
					randomObj.orders = randomObj.orders*1 + plus
					uni.setStorage({
						key: "randomObjV2",
						data: randomObj
					})
					this.randomObj = randomObj
                } else {
                    uni.setStorage({
						key: "randomObjV2",
						data: this.randomObj
					})
				}
			},
			// 随机数
			goRandom() {
				this.randomTime = Math.floor(Math.random()*(30-5))+5
			},
			//跳转页面
			goNext(type) {
				switch (type) {
					case "mine":
						uni.switchTab({
							url: "/pages/mine/mine",
						});
						break;
					default:
						break;
				}
			},
			// 调用微信自定义分享
			goShare() {
				let url = location.origin + "/" + location.hash.split("?")[0] + '?pid=' + this.userInfo.id;
				let obj = {
					title: `搜搜直通车快速获客`,
					desc: `精准获取本地人脉 开启无限获客新模式`,
					shareUrl: url,
					imgUrl: `${this.$dataURL}/image/ed/ed3413bfbcb35385ee657537d71a98ab.png`
				}
				// console.log(obj);
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
						//朋友圈分享
						let shareData1 = {
							title: obj.title, // 分享标题
							shareUrl: obj.shareUrl, // 分享链接
							imgUrl: obj.imgUrl, // 分享图标
						}
						this.$jwx.onMenuShareTimeline(shareData1, function(response) {
							// console.log('response', response)
						})
					})
				}
				// #endif
			},
			// 视频报错回调
			videoErrorCallback(e) {
				uni.showModal({
					content: e.target.errMsg,
					showCancel: false
				})
			},
			// 跳转公司介绍
			showMore() {
				uni.switchTab({
					url: '/pages/about/about'
				})
			},
			// 监听展示弹窗状态
			activityChange(e) {
				if (!e.show) {
					this.activityClose()
				}
			},
			// 关闭活动弹窗
			activityClose() {
				this.activityDailog = false;
				this.clearTimer()
			},
			// 是否在活动期间
			isActivity(start, end) {
				let startTime = new Date(start).getTime() / 1000;
				let endTime = new Date(end).getTime() / 1000;
				let nowTime = new Date().getTime() / 1000;
				let startDiff = parseInt(nowTime - startTime);
				let endDiff = parseInt(nowTime - endTime);
				let result = false;

				if (startDiff >= 0 && endDiff <= 0) {
					result = true;
				}
				return result;
			},
			// 载入活动定时器
			initActivity() {
				let start = "2020/11/1 00:00:00";
				let end = "2020/11/11 23:59:59";
				
				// let start = "2020/10/30 18:55:10";
				// let end = "2020/11/11 18:59:20";

				this.activityTimer = setInterval(() => {
					let nowTime = new Date().getTime() / 1000;
					let endTime = new Date(end).getTime() / 1000;
					let flag = this.isActivity(start, end);
					// console.log(flag);
					if (!this.userInfo.is_direct && flag) {
						this.$nextTick(() => {
							this.activityDailog = true;
						})
					}
					if (nowTime > endTime) {
						this.$nextTick(() => {
							this.activityClose()
						})
					}
				}, 1000);
			},
			// 清除定时器
			clearTimer() {
				clearInterval(this.activityTimer);
				this.activityTimer = null;
				console.log("clear");
			},
		}
	}
</script>

<style lang="scss">
#app {
	padding-bottom: 230rpx;
	background: #DBEDFF;
	.header {
		position: relative;
		.bg_img {
			display: block;
			width: 100%;
		}
		.msg_block {
			position: absolute;
			bottom: 0;
			width: 100%;
			.title {
				width: 86%;
				padding: 9rpx 0;
				margin: 0 auto;
				color: #fff;
				font-size: 30rpx;
				letter-spacing: 1px;
				text-align: center;
				border-radius: 40rpx;
				background: rgba(0,0,0,.5);
				text {
					color: #FF1616;
					font-size: 32rpx;
					padding: 0 10rpx;
				}
			}
			.train_data {
				display: flex;
				align-items: center;
				justify-content: space-around;
				.item {
					color: #fff;
					padding: 16rpx 0 16rpx;
					font-size: 32rpx;
					letter-spacing: 1px;
					text-align: center;

					>:first-child {
						color: #F9EF78;
						text-shadow: 1px 2px 5px #00478f;
					}
				}
			}
		}
		.notice {
			display: flex;
			align-items: center;
			background: rgba(0, 0, 0, 0.5);
			padding: 4rpx 12rpx;
			.icon_l {
				width: 28rpx;
				height: 24rpx;
				margin-left: 16rpx;
			}
			.cont {
				flex: 1;
				margin-left: 16rpx;
			}
			.notice_swiper {
				width: 100%;
				height: 60rpx;
				line-height: 24rpx;
				view {
					width: 100%;
					color: #fff;
					display: inline-block;
					font-size: 24rpx;
					line-height: 60rpx;
					letter-spacing: 1px;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
					text {
						margin-right: 8rpx;
					}
				}
			}
		}
	}
	.container {
		padding: 0 36rpx;
		.train_block {
			position: relative;
			margin: 74rpx auto 0;
			border-radius: 20rpx;
			background: #B9DCFF;
			.title {
				position: absolute;
				top: 0;
				left: 50%;
				transform: translate(-50%, -50%);
				display: flex;
				align-items: center;
				justify-content: center;
				width: 80%;
				margin: 0 auto;
				color: #fff;
				font-size: 34rpx;
				line-height: 70rpx;
				text-align: center;
				letter-spacing: 1px;
				border-radius: 12rpx;
				background: linear-gradient(90deg, #7BBCFF, #2F97FF);
				z-index: 1;
				&::before,
				&::after {
					content: '';
					display: block;
					width: 14rpx;
					height: 14rpx;
					border-radius: 50%;
					background: #fff;
				}
				&::before {
					margin-right: 30rpx;
				}
				&::after {
					margin-left: 30rpx;
				}
			}
			&:first-child {
				.content {
					padding: 60rpx 40rpx 28rpx;
				}	
			}
			.content {
				padding: 78rpx 40rpx 40rpx;
				.text {
					color: #004E77;
					font-size: 28rpx;
					line-height: 56rpx;
					text {
						color: #FF1616;
					}
				}
				.scroll-view {
					white-space: nowrap;
					.scroll-view-item {
						color: #fff;
						display: inline-block;
						width: 360rpx;
						height: 650rpx;
						&:not(:last-child) {
							margin-right: 20rpx;
						}
						image {
							display: block;
							width: 100%;
							height: 100%;
						}
					}
				}
				image {
					display: flex;
					width: 100%;
				}
				.video_block {
					width: 510rpx;
					height: 370rpx;
					display: inline-block;
					&:not(:last-child) {
						margin-right: 20rpx;
					}
					#myVideo {
						width: 100%;
						height: 100%;
					}
				}
				.effect_block {
					width: 510rpx;
					height: 370rpx;
					display: inline-block;
					&:not(:last-child) {
						margin-right: 20rpx;
					}
					image {
						width: 100%;
						height: 100%;
					}
				}
			}
			.show_more {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 90%;
				margin: 0 auto;
				color: #0080FF;
				font-size: 32rpx;
				line-height: 80rpx;
				letter-spacing: 1rpx;
				text-align: center;
				background: #AAD2F9;
				border-radius: 70rpx;
				&::after {
					content: "";
					width: 15rpx;
					height: 15rpx;
					border-top: 1px solid #4B7EF6;
					border-right: 1px solid #4B7EF6;
					transform: rotate(45deg);
					margin-left: 2rpx;
				}
			}
		}
		.icon_block {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-top: 30rpx;
			.item {
				display: flex;
				align-items: center;
				flex-direction: column;
				color: #446382;
				font-size: 26rpx;
				image {
					display: block;
					width: 98rpx;
				}
			}
		}
	}
	.confim_btn {
		position: fixed;
		left: 7.5%;
		bottom: 60rpx;
		z-index: 2;
		display: flex;
		align-items: center;
		flex-direction: column;
		width: 85%;
		height: 120rpx;
		color: #fff;
		text-align: center;
		letter-spacing: 1px;
		text-shadow: 2px 4px 2px #FF6134;
		border-radius: 20rpx;
		background: linear-gradient(180deg, #FF9F65, #FF6134);
		animation: mymove 5s infinite;
		animation-direction: alternate;
		animation-timing-function: ease-in-out;
		@keyframes mymove {
			0% {
				transform: scale(1);
				/*开始为原始大小*/
			}

			25% {
				transform: scale(1.1);
				/*放大1.1倍*/
			}

			50% {
				transform: scale(1);
			}

			75% {
				transform: scale(1.1);
			}
		}
		view {
			display: flex;
			align-items: center;
			font-size: 38rpx;
			margin-top: 12rpx;
			&::after,
			&::before {
				content: "";
				width: 100rpx;
				height: 1px;
				opacity: 0.75;
			}
			&::before {
				margin-right: 14rpx;
				background: linear-gradient(-90deg, #FFDCCC, #FF8B56);
			}
			&::after {
				margin-left: 14rpx;
				background: linear-gradient(90deg, #FFDCCC, #FF8B56);
			}
		}
		text {
			font-size: 24rpx;
			margin-top: 2rpx;
		}
		.finger {
			position: absolute;
			top: -28rpx;
			right: 10rpx;
			width: 200rpx;
		}
	}
	::v-deep .uni-popup__wrapper.center {
		height: 80%;
	}
}
</style>