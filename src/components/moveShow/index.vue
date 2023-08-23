<template>
  <view class="show-btn">
    <view
      class="text"
      :style="{left: `-${disTance}px` }"
      @touchstart="touchstart"
      @touchmove="touchmove"
      @touchend="touchend"
    >
      <slot name="text"></slot>
    </view>
    <view class="btn">
      <slot name="btn"></slot>
    </view>
  </view>
</template>
<script>
export default {
  name: "moveShow",
  props: {
    "btnWidth": {
      type: Number,
      default: 80
    }
  },
  data() {
    return {
      startX: 0,
      disTance: 0,
      isLeft: false,
    };
  },
  methods: {
    touchstart(e) {
      this.startX = e.touches[0].clientX
    },
    touchmove(e) {
      this.isLeft = this.startX - e.touches[0].clientX > 0
    },
    touchend(e) {
      this.disTance = this.isLeft ? this.btnWidth : 0
    },
  },
};
</script>
<style scoped>
.show-btn {
  position: relative;
  width: 100vw;
  min-height: 20px;
}
.text {
  position: relative;
  z-index: 1;
  background: white;
  transition: left 500ms;
  -webkit-transition: left 500ms; /* Safari */
}
.btn {
  position: absolute;
  right: 1px;
  top: 1px;
  height: 100%;
}
</style>