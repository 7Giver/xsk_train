<template>
  <view id="app">
    <scroll-view
      class="scroll_content"
      :scroll-y="true"
      @scrolltolower="getData"
    >
      <view class="banner" @click.stop="goNext('subject')">
        <image
          class="logo"
          src="/static/image/index/banner.png"
          mode="widthFix"
        ></image>
      </view>
      <view class="content_block">
        <view class="top_block">
          <view class="top">
            <view class="item">
              <view class="title">今日新增</view>
              <text>
                <countTo
                  :endVal="today_new"
                  :duration="2000"
                  separator=""
                ></countTo>
              </text>
            </view>
            <view class="item">
              <view class="title">总需求数</view>
              <text>
                <countTo
                  :endVal="total"
                  :duration="2000"
                  separator=""
                ></countTo>
              </text>
            </view>
          </view>
          <!-- 公告 -->
          <view class="notice_block">
            <image
              class="icon_l"
              src="/static/image/index/icon_notice.png"
              mode=""
            ></image>
            <view class="cont">
              <swiper
                :vertical="true"
                :autoplay="true"
                :circular="true"
                :disable-touch="true"
                class="notice_swiper"
              >
                <swiper-item v-for="(item, index) in noticeList" :key="index">
                  <view
                    >恭喜<text>{{ item.title }}</text
                    >领取了{{ item.type }}类需求</view
                  >
                </swiper-item>
              </swiper>
            </view>
          </view>
        </view>
        <view class="select_block">
          <!-- <view class="item">
						<text>地区</text>
						<picker
							mode="multiSelector"
							@change="classifyChange"
							@columnchange="columnchange"
							:value="classifyIndex"
							:range="classifyArr"
							range-key="province"
						>
							<view>{{name}}</view>
						</picker>
					</view> -->
          <!-- <view class="border"></view> -->
          <view class="item">
            <!-- <text>类型</text> -->
            <text>请选择您的需求类型：</text>
            <picker @change="typeChange" :value="typeIndex" :range="type">
              <view class="uni-input">{{ type[typeIndex] }}</view>
            </picker>
          </view>
        </view>
        <view class="list_block">
          <empty
            isTop="70%"
            v-if="isLoaded == true && dataList.length == 0"
          ></empty>
          <view class="item" v-for="(item, index) in dataList" :key="index">
            <view class="title_block">
              <text>{{ item.name }}</text>
              <text>{{ item.time }}</text>
            </view>
            <div class="content">
              <view class="text">{{ item.content }}</view>
              <div class="tel_block" @click="goCall(item.mobile)">
                <image
                  src="/static/image/index/icon_tel.png"
                  mode="widthFix"
                ></image>
                <text>{{ item.mobile }}</text>
              </div>
              <view
                class="btn"
                @click.stop="getClient(item)"
                v-if="!item.checked && item.status !== 1"
                >立即领取</view
              >
              <view class="btn disabled" v-else>已领取</view>
            </div>
          </view>
        </view>
      </view>
      <uni-load-more
        v-if="isLoaded && dataList.length !== 0"
        :status="loadingType"
      ></uni-load-more>
    </scroll-view>

    <!-- 提示弹窗 -->
    <uni-popup
      :show="showDailog"
      type="center"
      :animation="true"
      :custom="true"
      :mask-click="true"
      @change="change"
    >
      <view class="popup_block">
        <view class="msg_block">
          <view class="message">您还<text>未开通直通车</text></view>
          <view class="message">暂时无法领取需求</view>
        </view>
        <view class="btn" @click="goNext('subject')">查看详情</view>
      </view>
    </uni-popup>
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
import uniLoadMore from "@/components/uni-load-more/uni-load-more.vue";
import empty from "@/components/empty/empty.vue";
import countTo from "vue-count-to";
import Json from "@/Json";
export default {
  components: {
    UniPopup,
    uniLoadMore,
    countTo,
    empty,
  },
  data() {
    return {
      index: 0, // picker展示值下标
      today_new: 0, //今日新增
      total: 0, //总单数
      typeId: 21, //类型id
      typeIndex: 4,
      name: "全国", // 选中的名称
      province: "", //选中省
      city: "", //选中市
      type: ["全部", "装修", "汽修", "房产", "保险", "餐饮", "其他"],
      classifyIndex: [0, 0],
      classifyArr: [[], []], // picker - 数据源
      childArr: [], // 二级分类数据源
      noticeList: [], //公告数据
      dataList: [], //数据列表
      page: 1, // 分页
      loadingType: "more", // 加载状态
      isLoaded: false, // 是否已加载
      showDailog: false, //提示弹窗
      activityDailog: false, //活动弹窗
      activityTimer: null, // 活动定时器
      activity: {
        poster: "/static/image/activity/double11.png",
        btn: "立即参与",
      }, //活动对象
    };
  },
  computed: {
    ...mapState(["userInfo", "wxid"]),
  },
  onShow() {
    this.noticeList = Json.noticeList;
    this.getAreaList();
    this.initActivity();
    this.goShare();
  },
  onLoad() {
    this.getData();
  },
  onHide() {
    this.clearTimer();
  },
  methods: {
    // 获取省市信息
    getAreaList() {
      this.$http.post(`/?r=api/index/district`, {}).then((response) => {
        if (response.code === 200) {
          this.areaList = response.data;
          this.getAllClassify();
        } else {
          this.$api.msg(response.msg);
        }
      });
    },
    // 获取首页数据
    getData() {
      let obj = {
        page: this.page,
        province: this.province,
        city: this.city,
        type: this.typeId,
        wxid: this.wxid,
      };
      if (this.loadingType === "noMore") {
        //防止重复加载
        return false;
      }
      this.loadingType = "loading";
      // console.log(obj);
      // return false
      this.$http.post(`/?r=api/direct/index`, obj).then((response) => {
        if (response.code === 200) {
          let result = response.data;
          let resultData = result.list;
          this.today_new = result.today_new;
          this.total = result.total;
          if (resultData.length > 0) {
            if (this.page == 1) {
              if (resultData.length < 10) {
                this.loadingType = "noMore";
              } else {
                this.page++;
                this.loadingType = "more";
              }
              this.dataList = resultData;
            } else {
              this.page++;
              if (resultData.length < 10) {
                this.loadingType = "noMore";
              } else {
                this.loadingType = "more";
              }
              this.dataList = this.dataList.concat(resultData);
            }
          } else {
            this.loadingType = "noMore";
          }
          this.isLoaded = true;
        } else {
          // this.$api.msg(response.msg)
        }
      });
    },
    // 领取客源
    addClient(item) {
      this.$http
        .post(`/?r=api/direct/gain`, {
          wxid: this.wxid,
          id: item.id,
        })
        .then((response) => {
          // console.log(response)
          if (response.code === 200) {
            this.$set(item, "checked", true);
            this.$api.msg("添加成功");
          } else {
            this.$api.msg(response.msg);
          }
        });
    },
    // 切换类型
    typeChange(e) {
      // console.log('类型', e.target.value)
      this.typeIndex = e.target.value;
      let typeIndex = this.typeIndex;
      switch (typeIndex) {
        case 0:
          this.typeId = "";
          break;
        case 1:
          this.typeId = 1;
          break;
        case 2:
          this.typeId = 3;
          break;
        case 3:
          this.typeId = 14;
          break;
        case 4:
          this.typeId = 21;
          break;
        case 5:
          this.typeId = 2;
          break;
        case 6:
          this.typeId = 99;
          break;
      }
      this.page = 1;
      this.loadingType = "more";
      this.dataList = [];
      this.getData();
    },
    // 获取数据源并分出一级二级
    getAllClassify() {
      this.areaList.forEach((item, index) => {
        this.childArr.push(item.city);
      });
      this.classifyArr[0] = this.areaList;
      this.classifyArr[1] = this.childArr[0];
    },
    // 选择地区
    classifyChange(e) {
      let value = e.target.value;
      this.classifyIndex = value;
      if (this.classifyArr[0].length != 0) {
        this.province = this.classifyArr[0][this.classifyIndex[0]].province;
      }
      if (this.classifyArr[1].length != 0) {
        this.city = this.classifyArr[1][this.classifyIndex[1]];
      }
      this.name = this.city;
      this.page = 1;
      this.loadingType = "more";
      this.dataList = [];
      this.getData();
    },
    // 获取二级
    columnchange(e) {
      if (e.detail.column == 0) {
        this.classifyArr[1] = this.childArr[e.detail.value];
      }
    },
    // 调用微信自定义分享
    goShare() {
      let obj = {
        title: `顾客线索`,
        desc: `您有一个顾客线索待领取`,
        shareUrl: this.$common.WxShareUrl(),
        imgUrl: `${this.$dataURL}/image/fd/fdb7beee606e77e543364c3e990819ee.png`,
      };
      // console.log(obj);
      // #ifdef H5
      if (this.$jwx && this.$jwx.isWechat()) {
        this.$jwx.initJssdk((res) => {
          let shareData = {
            title: obj.title, // 分享标题
            desc: obj.desc, // 分享描述
            shareUrl: obj.shareUrl, // 分享链接
            imgUrl: obj.imgUrl, // 分享图标
          };
          this.$jwx.onMenuShareAppMessage(shareData, function (response) {
            // console.log('response', response)
          });
          //朋友圈分享
          let shareData1 = {
            title: obj.title, // 分享标题
            shareUrl: obj.shareUrl, // 分享链接
            imgUrl: obj.imgUrl, // 分享图标
          };
          this.$jwx.onMenuShareTimeline(shareData1, function (response) {
            // console.log('response', response)
          });
        });
      }
      // #endif
    },
    // 调起电话
    goCall(tel) {
      return false;
      uni.makePhoneCall({
        phoneNumber: tel,
      });
    },
    // 监听信息弹窗状态
    change(e) {
      if (!e.show) {
        this.showDailog = false;
      }
    },
    // 关闭信息弹窗
    cancel() {
      this.showDailog = false;
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
    //立即领取
    getClient(item) {
      if (this.userInfo.is_direct !== 1) {
        this.showDailog = true;
        return false;
      }
      this.addClient(item);
    },
    //跳转页面
    goNext(type) {
      switch (type) {
        case "national":
          uni.navigateTo({
            url: "/pages/activity/activity",
          });
          break;
        case "subject":
          uni.navigateTo({
            url: "/pages/index/subject",
          });
          this.showDailog = false;
          break;
        case "mine":
          uni.switchTab({
            url: "/pages/mine/mine",
          });
          break;
        default:
          break;
      }
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
      // let end = "2020/10/30 18:59:20";

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
  },
};
</script>

<style lang="scss">
#app {
  background: #f7f9fb;
  .banner {
    width: 100%;
    image {
      display: block;
      width: 100%;
    }
  }

  .scroll_content {
    height: 100vh;
    // padding-bottom: 100rpx;
  }
  .content_block {
    width: 100%;
    margin: 20rpx auto 0;
    padding: 0 30rpx;
    .top_block {
      position: relative;
      padding: 0 0 20rpx;
      background: url("/static/image/index/block_bg.png") no-repeat center /
        100% 100%;
      .top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .item {
          flex: 1;
          text-align: center;
          padding: 20rpx 0 30rpx;
          view {
            font-size: 30rpx;
            color: #1a2742;
          }
          text {
            font-size: 42rpx;
            color: #f85448;
            font-weight: bold;
          }
        }
      }
      .notice_block {
        width: 95%;
        margin: 0 auto;
        display: flex;
        align-items: center;
        background: #fefcec;
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
        align-items: baseline;
        font-size: 32rpx;
        margin: 0 28rpx;
        text {
          color: #1a2742;
          font-weight: 600;
          margin-right: 20rpx;
        }
        uni-picker {
          // flex: 1;
          width: 160rpx;
          font-size: 30rpx;
          padding: 5rpx 20rpx;
          border-radius: 6rpx;
          border: 1px solid #909ab4;
          display: flex;
          align-items: center;
          justify-content: space-between;
          &::after {
            content: "";
            width: 0;
            height: 0;
            border-right: 10rpx solid transparent;
            border-left: 10rpx solid transparent;
            border-top: 14rpx solid #014dfb;
          }
        }
      }
      .border {
        width: 1rpx;
        height: 36rpx;
        background: #909ab4;
        opacity: 0.4;
      }
    }
    .list_block {
      height: 100%;
      // position: relative;
      .item {
        padding: 14rpx;
        margin-bottom: 30rpx;
        border-radius: 10rpx;
        background: #fff;
        .title_block {
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #fff;
          padding: 12rpx 30rpx;
          background: url("/static/image/index/title_bg.png") no-repeat center /
            100% 100%;
          text:first-child {
            font-size: 28rpx;
            letter-spacing: 3rpx;
          }
          text:last-child {
            opacity: 0.8;
            font-size: 26rpx;
          }
        }
        .content {
          position: relative;
          padding: 0 20rpx 10rpx;
          .text {
            color: #30364a;
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
              color: #568aff;
              font-size: 30rpx;
            }
          }
          .btn {
            position: absolute;
            bottom: 2rpx;
            right: 30rpx;
            color: rgba(255, 255, 255, 0.83);
            font-size: 28rpx;
            padding: 10rpx 30rpx;
            border-radius: 70rpx;
            background: linear-gradient(90deg, #ff5664, #ff665a);
            box-shadow: 1px 3px 4px 0px rgba(255, 86, 100, 0.32);
          }
          .disabled {
            background: #d8d8d8;
            box-shadow: none;
          }
        }
      }
    }
  }
  .popup_block {
    width: 92%;
    margin: 0 auto;
    padding: 90rpx 0 60rpx;
    text-align: center;
    border-radius: 30rpx;
    background: #fff;
    .msg_block {
      margin: 0 auto 50rpx;
      .message {
        font-size: 32rpx;
        line-height: 50rpx;
        text {
          color: #f75448;
        }
      }
    }
    .btn {
      width: 80%;
      margin: 0 auto;
      color: #fff;
      padding: 0 60rpx;
      font-size: 34rpx;
      line-height: 80rpx;
      letter-spacing: 4rpx;
      border-radius: 100rpx;
      background: linear-gradient(90deg, #ff5664, #ff3e30);
    }
  }

  ::v-deep .uni-popup__wrapper.center {
    height: 80%;
  }
}
</style>
