<template>
  <view id="mark-list-content" class="mark-list-wrapper">
    <view class="wrapper2">
      <view class="title">今日任务</view>
      <view v-for="(item) in todayTask" :key="item.childId" class="row">
        <span class="mark-name">
          <span class="sort"></span>
          {{item.markName}}</span>
        <image class="check-icon" :src="item.isMarked ? '/static/icon/right2.png' :'/static/icon/unchecked3.png'" @click="handleChecked(item)"></image>
      </view>
      <view class="empty-tip" v-if="todayTask.length === 0">暂无数据~</view>
    </view>
    <image class="add-btn" src="/static/icon/add0.png" @click="handleAdd(item)"></image>
    <la-dialog :visible="addVisible">
      <mark-form :visible="addVisible" :row="{}" @submit ="submitAdd"></mark-form>
    </la-dialog>
  </view>
</template>

<script>
import tips from '../../components/tips/index.js'
import LaDialog from '../../components/dialog/index.vue'
import MarkForm from './components/MarkForm.vue'

export default {
  components: {
    LaDialog,
    MarkForm
  },
  data() {
    const d = new Date()
    return {
      todoList: [],
      filePath: '',
      taskList: [],
      addVisible: false,
      todayDate: `${d.getFullYear()}-${d.getMonth() + 1 }-${d.getDate()}`
    }
  },
  computed: {
    todayTask() {
      // 今日任务
      return this.taskList.filter(item => {
        const todayt = new Date(`${this.todayDate} 00:00:00`).getTime()
        const startt = new Date(`${item.startTime} 00:00:00`).getTime()
        const endt = new Date(`${item.endTime} 00:00:00`).getTime()
        return startt < todayt + 1 && endt + 1 > todayt
      })
    },
  },
  onShareTimeline(){
    return {
      title: '梦想任务，即刻探索',
      path: "/pages/index/index",
      imageUrl: "/static/img/avatar.jpg"
    }
  },
  onShareAppMessage(){
    console.log('onShareAppMessage')
    return {
      title: '梦想任务，即刻探索',
      path: "/pages/index/index",
      imageUrl: "/static/img/avatar.jpg"
    }
  },
  onLoad(){
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },
  onShow() {
    //     id: 2,
    //     markName: '看书20分钟',
    //     startTime: new Date('2022-08-01').getTime(),
    //     endTime: new Date('2022-08-31').getTime(),
    //     frequency: 1, // 频率
    //     markTime: [], // 打卡记录
    //     rate: 0,  // 完成度
    //     isMarked: false, // 今日完成情况
    const str = uni.getStorageSync('marklist')
    const  taskList = str ? JSON.parse(str) : []
    this.taskList = taskList
  },
  methods: {
    handleAdd(){
      this.addVisible = true
    },
    submitAdd(item){
      if(item.markName){
       if(item.frequency === 1){
        this.taskList.push(item)
       } else {
        for(let i =1;i<item.frequency+1; i++){
          this.taskList.push({...item,markTime: [], markName:`${item.markName}-${i}` ,childId: `${item.id}-${i}`}) 
        }
       }
       tips.showTip('任务创建成功~')
      } else {
        tips.showTip('已取消~', 'none')
      }
      this.addVisible = false
      this.handleStorage()
    },
    handleChecked(item){
      let allChecked = true
      const { todayDate } = this
      this.taskList.map(it => {
        if(item.childId === it.childId){
          it.isMarked = !it.isMarked
          if(it.isMarked){
            it.markTime.push(todayDate)
          } else {
            it.markTime = it.markTime.filter(i => i !== todayDate)
          }
        }
        console.log(it.isMarked )
        if(!it.isMarked) {
          allChecked = false
        }
      })
      this.handleStorage()
      if(allChecked) {
         tips.showTip('完成任务啦~')
      }
    },
    handleStorage(){
      uni.setStorageSync('marklist', JSON.stringify(this.taskList))
    }
  },
}
</script>

<style>
.mark-list-wrapper{
    position: relative;
    background: url('../../static/svg/bg.svg') no-repeat 100% bottom;
    /* height: calc(100vh - 94px); */
    height: 100vh;
    background-size: contain;
    overflow: scroll;
    padding-bottom: 40px;
    box-sizing: border-box;
}
.title{
  color: white;
  background:#7bdcb5;
  background: linear-gradient(to bottom right, #8ed1fc,  #7bdcb5);
  padding: 8px 5px;
}
.wrapper2{
  min-height: 90vh;
}
.row{
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 5px 10px;
  padding: 8px 10px;
  /* padding: 3px 0; */
  border-bottom: 1px dashed #8ed1fc;
}
.mark-name{
  display: flex;
  align-items: center;
}
.sort{
  display: inline-block;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #8ed1fc;
  margin-right: 8px;
}
.check-icon{
  width: 25px;
  height: 25px;
  cursor: pointer;
}
.add-btn{
  width: 50px;
  height: 50px;
  cursor: pointer;
  position: fixed;
  left: calc(50vw - 25px);
  bottom: 0;
  /* bottom: 10vh; */
}
.empty-tip{
    height: 50vh;
    line-height: 50vh;
    text-align: center;
    color: #999;
}
</style>
