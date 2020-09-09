<template>
    <view id="app">
        <view class="banner">
            <image class="logo" src="/static/image/index/banner.png" mode="widthFix"></image>
        </view>
		<view class="content_block">
			<view class="top_block">
				<view class="top">
					<view class="item">
						<view class="title">今日新增</view>
						<text>1065</text>
					</view>
					<view class="item">
						<view class="title">总需求数</view>
						<text>1065</text>
					</view>
				</view>
				<!-- 公告 -->
				<view class="notice_block">
					<image class="icon_l" src="/static/image/index/icon_notice.png" mode=""></image>
					<view class="cont">
						<swiper
							:vertical="true"
							:autoplay="true"
							:circular="true"
							class="notice_swiper"
						>
							<swiper-item
								v-for="(item, index) in noticeList"
								:key="index"
							>
								<view>恭喜<text>{{ item.title }}</text>成功开通了地图定位标注</view>
							</swiper-item>
						</swiper>
					</view>
				</view>
        	</view>
			<view class="select_block">
				<view class="item">
					<text>地区</text>
					<picker @change="areaChange" :value="areaIndex" :range="area">
                        <view class="uni-input">{{area[areaIndex]}}</view>
                    </picker>
				</view>
				<view class="border"></view>
				<view class="item">
					<text>类型</text>
					<picker @change="typeChange" :value="typeIndex" :range="type">
                        <view class="uni-input">{{type[typeIndex]}}</view>
                    </picker>
				</view>
			</view>
			<view class="list_block">
				<view class="item" v-for="(item, index) in 5" :key="index">
					<view class="title_block">
						<text>王先生</text>
						<text>2020-08-30</text>
					</view>
					<div class="content">
						<view class="text">咨询保险：教育保险，为子女购买教育金险，6岁，有社保，年预算在3000-5000。</view>
						<div class="tel_block">
							<image src="/static/image/index/icon_tel.png" mode="widthFix"></image>
							<text>187****1906</text>
						</div>
						<view class="btn">立即领取</view>
					</div>
				</view>
			</view>
		</view>
    </view>
</template>

<script>
import Json from "@/Json";
export default {
    data() {
        return {
			noticeList: [],
			area: ['中国', '美国', '巴西', '日本'],
			type: ['房产', '保险', '汽修'],
			areaIndex: 0,
			typeIndex: 0,
        };
    },
    onShow() {
		this.noticeList = Json.noticeList
		this.getData()
	},
    methods: {
		areaChange(e) {
            console.log('地区', e.target.value)
            this.areaIndex = e.target.value
		},
		typeChange(e) {
            console.log('类型', e.target.value)
            this.typeIndex = e.target.value
		},
		// 获取首页数据
		getData() {
			this.$http
				.post(`/?r=api/direct/index`, {})
				.then(response => {
					if (response.code === 200) {
						let result = response.data
						console.log(result);
					}
				});
		},
	},
};
</script>

<style lang="scss">
#app {
	background: #F7F9FB;
    .banner {
        width: 100%;
        image {
			display: block;
            width: 100%;
        }
    }
	.content_block {
		margin: 30rpx auto;
		padding: 0 30rpx;
		.top_block {
			position: relative;
			padding: 0 0 20rpx;
			background: url('/static/image/index/block_bg.png') no-repeat center / 100% 100%;
			.top {
				display: flex;
				align-items: center;
				justify-content: space-between;
				.item {
					flex: 1;
					text-align: center;
					padding: 30rpx 0;
					view {
						color: #1A2742;
					}
					text {
						color: #F85448;
						font-weight: bold;
					}
				}
			}
			.notice_block {
				width: 95%;
				margin: 0 auto;
				display: flex;
				align-items: center;
				background: #FEFCEC;
				border-radius: 50rpx;
				padding: 4rpx 12rpx;
				.icon_l {
					width: 24rpx;
					height: 24rpx;
					margin-left: 16rpx;
				}
				.cont {
					margin-left: 16rpx;
					flex: 1;
				}
				.notice_swiper {
					width: 100%;
					height: 50rpx;
					line-height: 24rpx;
					view {
						width: 100%;
						display: inline-block;
						font-size: 24rpx;
						line-height: 50rpx;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
						text {
							color: #f75347;
						}
					}
				}
			}
    	}
		.select_block {
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 26rpx 0;
			.item {
				flex: 1;
				display: flex;
				align-items: center;
				font-size: 32rpx;
				margin: 0 28rpx;
				text {
					color: #1A2742;
					font-weight: bold;
					margin-right: 20rpx;
				}
				uni-picker {
					flex: 1;
					padding: 4rpx 16rpx;
					border-radius: 6rpx;
					border: 1px solid #909AB4;
					display: flex;
					align-items: center;
					justify-content: space-between;

					&::after {
						content: "";
						width: 0;
						height: 0;
						border-right: 10rpx solid transparent;
						border-left: 10rpx solid transparent;
						border-top: 14rpx solid #014DFB;
					}
				}
			}
			.border {
				width: 1rpx;
				height: 36rpx;
				background: #909AB4;
				opacity: 0.4;
			}
		}
		.list_block {

			.item {
				padding: 14rpx;
				margin-bottom: 30rpx;
				border-radius: 10rpx;
				background: #fff;
				.title_block {
					display: flex;
					align-items: center;
					justify-content: space-between;
					padding: 12rpx 30rpx;
					background: url('/static/image/index/title_bg.png') no-repeat center / 100% 100%;
					text:first-child {
						color: #2D344A;
						font-size: 30rpx;
						font-weight: bold;
					}
					text:last-child {
						color: #667086;
						font-size: 30rpx;
					}
				}
				.content {
					position: relative;
					padding: 0 20rpx 10rpx;
					.text {
						color: #30364A;
						font-size: 30rpx;
						margin: 26rpx auto;
					}
					.tel_block {
						display: flex;
						align-items: center;
						image {
							display: block;
							width: 24rpx;
							height: 24rpx;
							margin-right: 10rpx;
						}
						text {
							color: #568AFF;
							font-size: 30rpx;
						}
					}
					.btn {
						position: absolute;
						bottom: 2rpx;
						right: 30rpx;
						color: rgba(255,255,255,0.83);
						font-size: 28rpx;
						padding: 10rpx 20rpx;
						border-radius: 70rpx;
						background: linear-gradient(90deg, #FF5664, #FF665A);
						box-shadow: 1px 3px 4px 0px rgba(255, 86, 100, 0.32);
					}
				}
			}
		}
	}
}
</style>
