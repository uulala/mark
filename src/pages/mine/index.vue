<template>
  <view class="content">
    <view class="user-box">
      <image class="avatar-btn" src="/static/img/avatar.jpg"></image>  
    <view>{{userName}}</view>
    </view>
    <view class="operate-box">
      <view class="operate-btn" @click="clearAll">清除所有数据</view>
    </view>
  </view>
</template>

<script>
import tips from '../../components/tips/index.js'
export default {
  data() {
    return {
      userName: "微信用户",
    };
  },
  onLoad() {},
  methods: {
    clearAll(){
      wx.showModal({
        content: '确定要清除所有数据吗？',
        success (res) {
          if (res.confirm) {
            uni.removeStorageSync('marklist')
            uni.removeStorageSync('markdraft')
            tips.showTip('清除完成~', 'none')
          } else if (res.cancel) {
           tips.showTip('已取消~', 'none')
          }
        }
      })
    }
  },
};
</script>

<style>
.content{
  /* background: #eee; */
  padding: 10px;
  background: linear-gradient(to bottom, #a7dbfb, white, white,  white);
}
.user-box{
  padding: 10px 5px;
  display: flex;
  align-items: center;
  background: white;
  border-radius: 5px;
  box-shadow: 2px 1px 10px -2px #999;
  height: 100px;
  box-sizing: border-box;
  
  /* color: white; */
}

.operate-box{
  margin-top: 20px;
  background: white;
  border-radius: 5px;
  box-shadow: 1px 2px 10px -1px #999;
  height: calc(100vh  - 160px);
  padding: 10px 5px;
  box-sizing: border-box;
}
.avatar-btn{
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
}
.operate-btn{
  text-align: center;
  height: 35px;
  line-height: 35px;
  border-bottom: 1px solid #eee;
}
</style>
