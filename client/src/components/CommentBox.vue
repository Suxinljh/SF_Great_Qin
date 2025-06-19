<script setup>
import { ref, onMounted } from 'vue'
import { showToast } from 'vant'

const ws = ref(null)
const comments = ref([])
const input = ref('')
const user = ref('游客' + Math.floor(Math.random() * 10000))
const lastSendTime = ref(0)

const connectWS = () => {
  ws.value = new WebSocket('ws://localhost:3001')
  ws.value.onmessage = (event) => {
    const data = JSON.parse(event.data)
    if (data.type === 'comment') {
      comments.value.push({ user: data.user, text: data.text, time: data.time })
    }
  }
}

const sendComment = () => {
  const now = Date.now()
  if (now - lastSendTime.value < 30000) {
    showToast('请勿频繁发言')
    return
  }
  if (!input.value.trim()) {
    showToast('请输入内容')
    return
  }
  ws.value.send(JSON.stringify({ type: 'comment', user: user.value, text: input.value }))
  lastSendTime.value = now
  input.value = ''
}

onMounted(() => {
  connectWS()
})
</script>

<template>
  <div>
    <div style="max-height:200px;overflow:auto;background:#f8f8f8;padding:8px 0;">
      <div v-for="(c, i) in comments" :key="i" style="margin:4px 12px;">
        <b style="color:#42b983">{{ c.user }}：</b>{{ c.text }}
        <span style="color:#aaa;font-size:12px;float:right">{{ new Date(c.time).toLocaleTimeString() }}</span>
      </div>
    </div>
    <van-field v-model="input" placeholder="说点什么..." maxlength="100" show-word-limit />
    <van-button type="primary" block @click="sendComment">发送</van-button>
  </div>
</template>
