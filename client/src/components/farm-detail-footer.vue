<template>
  <div class="farm-detail-footer-fixed">
    <van-button type="primary" block class="contact-btn" @click="$emit('contact')">联系农场主</van-button>
  </div>
</template>

<script setup>
</script>

<style scoped>
.farm-detail-footer-fixed {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  padding: 8px 12px;
  z-index: 100;
}
.contact-btn {
  width: 100%;
}
</style>
