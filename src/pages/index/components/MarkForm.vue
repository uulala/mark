<template>
  <view class="mark-form">
    <view class="form-item">
      <view class="label">任务名称：</view>
      <input
        class="uni-input"
        :value="formData.markName"
        @input="onKeyInput"
        focus
        placeholder="请输入任务名称"
      />
    </view>
    <view class="form-item">
      <view class="label">开始时间：</view>
      <picker
        mode="date"
        :value="formData.startTime"
        :start="startDate"
        :end="endDate"
        @change="e => bindDateChange(e,true)"
      >
        <view class="uni-input">{{formData.startTime}}</view>
      </picker>
    </view>
    <view class="form-item">
      <view class="label">结束时间：</view>
      <picker
        mode="date"
        :value="formData.endTime"
        :start="startDate"
        :end="endDate"
        @change="e => bindDateChange(e)"
      >
        <view class="uni-input">{{formData.endTime}}</view>
      </picker>
    </view>
    <view class="form-item">
      <view class="label">频率：</view>
      <picker @change="bindPickerChange" :value="formData.frequencyIndex" :range="frequencyArr" style="width: 80%;">
        <view class="uni-input">{{formData.frequency}}</view>
      </picker>
    </view>
    <view class="btn-box">
      <button type="default" size="mini" class="btn" @click="handleCancle">取消</button>
      <button type="primary" size="mini" class="btn" @click="handleSubmit">确定</button>
    </view>
  </view>
</template>
<script>
import tips from "../../../components/tips/index.js";

export default {
  name: "MarkForm",
  props: ["row", "visible"],
  data() {
    const defaultData = {
      markName: "",
      startTime: "",
      endTime: "",
      frequency: 1,
      isMarked: false,
    };

    return {
      formData: { ...defaultData },
      defaultData,
      startDate: this.getDate("start"),
      endDate: this.getDate("end"),
      frequencyArr: [1, 2, 3],
    };
  },
  watch: {
    visible(n, o) {
      console.log(n, o);
      if (n) {
        this.initData();
      }
    },
  },
  mounted() {
    this.initData();
  },
  methods: {
    initData() {
      console.log(this.defaultData);
      this.formData = { ...this.defaultData, ...this.row };
      // 添加
      if (!this.row.id) {
        this.formData.id = new Date().getTime();
      }
      console.log(this.formData.id);
      const currentDate = this.getDate({
        format: true,
      });
      this.formData.startTime = currentDate;
      this.formData.endTime = currentDate;
    },
    onKeyInput(e) {
      this.formData.markName = e.detail.value;
    },
    bindDateChange(e, isStart) {
      const t = e.detail.value;
      if (isStart) {
        this.formData.startTime = t;
      } else {
        this.formData.endTime = t;
      }
    },
    getDate(type) {
      const date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();

      if (type === "start") {
        year = year - 60;
      } else if (type === "end") {
        year = year + 2;
      }
      month = month > 9 ? month : "0" + month;
      day = day > 9 ? day : "0" + day;
      return `${year}-${month}-${day}`;
    },
    bindPickerChange: function (e) {
      console.log("picker发送选择改变，携带值为", e.detail);
      const i = e.detail.value;
      this.formData.frequencyIndex = i;
      this.formData.frequency = this.frequencyArr[i];
    },
    handleSubmit() {
      const { startTime, endTime, markName } = this.formData;
      console.log("startTime, endTime: ", startTime, endTime);
      const t1 = new Date(startTime).getTime();
      const t2 = new Date(endTime).getTime();
      const count = parseInt((t2 - t1) / 1000 / 60 / 60 / 24) + 1;
      if (!markName) {
        return tips.showTip("请输入任务名称~", "error");
      }
      if (t1 > t2) {
        return tips.showTip("开始时间不能晚于结束时间~", "error");
      }
      this.$emit("submit", { ...this.formData, markTime: [], count });
    },
    handleCancle() {
      this.$emit("submit", {});
    },
  },
};
</script>
<style scoped>
.mark-form {
  padding: 5px 10px;
  /* font-size: 18px; */
}
.form-item {
  margin: 15px 5px;
  display: flex;
  align-items: center;
  /* margin: ; */
}
.label {
  color: #333;
  margin-right: 5px;
}
.btn-box {
  text-align: right;
}
.btn {
  margin: 0 5px;
}
button[type="primary"] {
  background: #7bdcb5;
}
</style>