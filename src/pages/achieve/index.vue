<template>
  <view class="content">
    <!-- <view class="title">任务进度</view> -->

    <move-show v-for="item in taskList" :key="item.childId">
      <template v-slot:text>
        <view class="list-wrapper">
          <view class="show-time">{{item.markName}}</view>
          <view class="item-wrapper">
            <view class="progress-wrapper">
              <view>任务时间：{{item.count}}天 ({{item.showTime}})</view>
              <view
                class="progress-line"
                :style="{ width: `${item.rate}%`, 'background-color': item.rate === 100 ? '#a7dbfb' : '#a7dbfb' }"
              ></view>
            </view>
            <view :style="{color: item.rate === 100 ? '#7bdcb5' : '#a7dbfb'}">{{item.rate}}%</view>
          </view>
        </view>
      </template>
      <template v-slot:btn>
        <view class="del-btn" @click="removeItem(item)">删除</view>
      </template>
    </move-show>
    <view class="empty-tip" v-if="taskList.length === 0">暂无数据~</view>
  </view>
</template>

<script>
import tips from "../../components/tips/index.js";
import MoveShow from "../../components/moveShow/index.vue";

export default {
  components: { MoveShow },
  data() {
    return {
      taskList: [],
      startX: 0,
      showDel: false,
      disTance: 0,
    };
  },
  onShareTimeline() {
    return {
      title: "梦想任务，即刻探索",
      path: "/pages/achieve/index",
      imageUrl: "/static/img/avatar.jpg",
    };
  },
  onShareAppMessage() {
    console.log("onShareAppMessage");
    return {
      title: "梦想任务，即刻探索",
      path: "/pages/achieve/index",
      imageUrl: "/static/img/avatar.jpg",
    };
  },
  onLoad() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ["shareAppMessage", "shareTimeline"],
    });
  },
  onShow() {
    this.disTance = 0;
    const str = uni.getStorageSync("marklist");
    const taskList = str ? JSON.parse(str) : [];
    taskList.map((item) => {
      item.rate = parseInt((item.markTime.length / item.count) * 1000) / 10;
      item.showTime = `${item.startTime.replace(
        /-/g,
        "."
      )} - ${item.endTime.replace(/-/g, ".")}`;
    });
    this.taskList = taskList;
  },
  methods: {
    removeItem(row) {
      const that = this;
      wx.showModal({
        content: "确定要删除该任务吗？",
        success(res) {
          if (res.confirm) {
            that.taskList = that.taskList.filter(
              (item) => item.childId !== row.childId
            );
            uni.setStorageSync("marklist", JSON.stringify(that.taskList));
            tips.showTip("刪除成功~");
          } else if (res.cancel) {
            tips.showTip("已取消~", "none");
          }
        },
      });
    },
  },
};
</script>

<style>
.content {
  height: 100vh;
  background: linear-gradient(to bottom, #a7dbfb, white, white, white);
}
.title {
  color: white;
  padding: 8px 5px;
}
.row {
  padding: 5px 10px;
  margin: 5px 0;
  position: relative;
}
.item-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.progress-wrapper {
  position: relative;
  width: 95%;
  /* width: 65vw; */
  padding: 5px 5px;
  border-radius: 5px;
  border-bottom: 1px solid #a7dbfb;
}
.progress-line {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  opacity: 0.5;
  border-radius: 3px;
}
.show-time {
  /* color: #666; */
  margin-bottom: 5px;
  font-size: 18px;
}
.empty-tip {
  height: 50vh;
  line-height: 50vh;
  text-align: center;
  color: #999;
}
.operate-btn {
  background: rgb(220, 0, 0);
  color: white;
  text-align: center;
  width: 35px;
  height: 35px;
  line-height: 35px;
  padding: 2px 5px;
  position: absolute;
  right: -45px;
  top: 0;
  border-radius: 5px;
}
/* .text{
  height: ;
} */
.del-btn {
  padding: 2px 15px;
  background: rgb(255, 67, 67);
  color: white;
  height: calc(100% - 10px);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}
.list-wrapper {
  padding: 8px;
}
</style>
