<template>
  <view class="animated " :class="visible ? 'show-dialog rotateInDownLeft' : 'hide-dialog rotateOutDownLeft'">
    <slot></slot>
  </view>
</template>
<script>
export default {
  name: "Dialog",
  props: ["visible"],
};
</script>
<style scoped>
.show-dialog {
  display: block;
  position: fixed;
  top: 15vh;
  width: 80vw;
  left: 10vw;
  border: 1px solid #eee;
  border-radius: 5px;
  padding: 5px;
  background: #fff;
  box-shadow: 2px 2px 5px #999;
}
.hide-dialog {
  display: none;
}
</style>