<template>
  <div class="comment-input-fixed">
    <van-field v-model="input" 
              placeholder="说点什么吧..." 
              border 
              clearable
              @keyup.enter="sendComment" />
    <van-button type="primary" size="normal" @click="sendComment">发送</van-button>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'
const props = defineProps({
  cooldown: Number,
  value: String
})
const emits = defineEmits(['update:value', 'send'])
const input = ref(props.value || '')

const sendComment = () => {
  emits('send', input.value)
  input.value = ''
  emits('update:value', '')
}
</script>

<style scoped>
.comment-input-fixed {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  background: #fff;
  display: flex;
  gap: 8px;
  padding: 8px 12px;
  z-index: 100;
}
</style>
