<template>
  <div class="farm-app">
    <!-- 顶部标题 -->
    <div class="farm-header">
      <span class="farm-title">农场直播</span>
    </div>    <!-- 固定的直播画面 -->
    <div class="banner-box">
      <template v-if="loading">
        <van-skeleton title :row="3" :loading="loading" class="banner-skeleton" />
      </template>
      <template v-else>
        <img :src="`/img/${currentLive.url}`" class="banner-img" :alt="currentLive.name" />
        <div class="live-info">
          <span class="live-title">{{ currentLive.name }}</span>
          <span class="live-status">LIVE</span>
        </div>
      </template>
    </div>    <!-- Tab 区域 -->
    <van-tabs v-model:active="activeTab" sticky swipeable animated class="main-tabs">
      <!-- 直播频道 -->
      <van-tab title="直播频道">
        <div class="grid-list">
          <div v-for="cam in cameras" :key="cam.id" 
               class="grid-item" 
               :class="{ active: currentLive.id === cam.id }"
               @click="selectCamera(cam)">
            <img :src="`/img/${cam.url}`" class="grid-img" />
            <div class="grid-title">{{ cam.name }}</div>
          </div>
        </div>
      </van-tab>

      <!-- 农场互动 -->
      <van-tab title="农场互动" class="chat-tab">
        <div class="comment-list">
          <div v-for="(c, i) in comments" :key="i" class="comment-item">
            <span class="comment-user">{{ c.user }}：</span>{{ c.text }}
          </div>
        </div>
        <div class="comment-input">
          <van-field v-model="input" 
                    placeholder="说点什么吧..." 
                    border 
                    clearable
                    @keyup.enter="sendComment" />
          <van-button type="primary" size="normal" @click="sendComment">发送</van-button>
        </div>
      </van-tab>      <!-- 农场详情 -->
      <van-tab title="农场详情">
        <div class="farm-detail">
          <div class="farm-detail-content">
            <div class="section-title">农场天气</div>
            <div class="weather-card">
              <div class="weather-row">
                <span class="weather-location">扶风县</span>
              </div>
              <div class="weather-main">
                <span class="weather-temp">31</span>
                <span class="weather-unit">℃ 晴</span>
              </div>
              <div class="weather-info">
                <span>湿度：69%</span>
                <span>风速：东南风2级</span>
              </div>
            </div>

            <div class="section-title">农场介绍</div>
            <div class="farm-intro">
              <div class="intro-content">
                破局·共生·跃迁——2025企业出海投融资论坛暨"苏美达天下"八周年。今天将为大家带来T1 vs WBG的精彩对决。观迎观看英雄联盟S13总决赛直播！今天将为大家带来T1 vs WBG上限150字介绍！宇教上限150字介绍！
              </div>
              <div class="intro-meta">
                <div>分类：<span>商业聚会</span></div>
                <div>开播时间：<span>05月31日 09:41</span></div>
                <div>时长：<span>3小时</span></div>
                <div class="tag-list">
                  <span class="tag">#英雄联盟</span>
                  <span class="tag">#S13总决赛</span>
                  <span class="tag">#T1</span>
                  <span class="tag">#电竞</span>
                </div>
              </div>
            </div>
          </div>
          <div class="farm-detail-footer">
            <van-button type="primary" block class="contact-btn" @click="contactOwner">联系农场主</van-button>
          </div>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { showToast, showLoadingToast, Skeleton } from 'vant'

// 加载状态
const loading = ref(true)

// 当前选中的tab
const activeTab = ref(0)

// 防刷屏控制
const lastCommentTime = ref(0)
const COMMENT_COOLDOWN = 30 * 1000 // 30秒冷却时间

// 当前直播间信息
const currentLive = ref({
  id: 1,
  name: '东区农田',
  url: 'live_1.jpg'
})

// 可切换的直播间列表
const cameras = ref([
  { id: 1, name: '东区农田', url: 'live_2.jpg' },
  { id: 2, name: '西区果园', url: 'live_3.jpg' },
  { id: 3, name: '南区蔬菜', url: 'live_4.jpg' },
  { id: 4, name: '北区果林', url: 'live_5.jpg' }
])

// 切换直播间
const selectCamera = (cam) => {
  currentLive.value = cam
  showToast(`切换到：${cam.name}`)
}

// 评论列表
const comments = ref([
  { user: '清风徐来', text: '哈哈哈哈哈哈' },
  { user: '干饭人干饭魂', text: '加油啊！' },
  { user: '元气满满蓝', text: '这个直播几点结束？' },
  { user: 'StarLight', text: '老师，请问PPT可以发一下学习一下吗？' },
  { user: '星辰大海梦', text: '点赞了直播' },
  { user: '书虫的世界', text: '我觉得你说的对' },
  { user: '剧荒少年在线', text: '分享了直播间' },
  { user: '清风徐来', text: '哈哈哈哈哈哈' },
  { user: '干饭人干饭魂', text: '加油啊！' },
  { user: '元气满满蓝', text: '这个直播几点结束？' },
  { user: 'StarLight', text: '老师，请问PPT可以发一下学习一下吗？' },
  { user: '星辰大海梦', text: '点赞了直播' },
  { user: '书虫的世界', text: '我觉得你说的对' },
  { user: '剧荒少年在线', text: '分享了直播间' },
])

// 发送评论
const input = ref('')
const sendComment = () => {
  if (!input.value.trim()) {
    showToast('请输入内容')
    return
  }

  // 检查发言间隔
  const now = Date.now()
  const timeLeft = COMMENT_COOLDOWN - (now - lastCommentTime.value)
  if (timeLeft > 0) {
    showToast(`发言太快了，请等待 ${Math.ceil(timeLeft / 1000)} 秒`)
    return
  }

  // 更新最后发言时间
  lastCommentTime.value = now
  
  // 发送评论
  comments.value.push({ user: '我', text: input.value })
  input.value = ''
  showToast('发送成功')
}

// 联系农场主
const contactOwner = () => {
  window.open('weixin://')
}

// 模拟加载数据
onMounted(async () => {
  const loadToast = showLoadingToast({
    message: '加载中...',
    forbidClick: true,
  })
  
  // 模拟网络请求延迟
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // 关闭加载提示
  loadToast.close()
  loading.value = false
})
</script>

<style>
:root {
  --van-primary-color: #149D56;
}

/* 全局设置 MiSans 字体 */
body {
  font-family: 'MiSans', -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

/* Vant 组件字体覆盖 */
:deep(.van-button),
:deep(.van-field__control),
:deep(.van-tab),
:deep(.van-toast) {
  font-family: 'MiSans', -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', sans-serif !important;
}
</style>

<style scoped>
.farm-app {
  min-height: 100vh;
  background: #fff;
  font-family: 'MiSans', -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

.farm-header {
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 2px;
  background: #fff;
  color: #149D56;
  z-index: 3;
}

.banner-box {
  position: sticky;
  top: 48px;
  width: 100%;
  aspect-ratio: 16/9;
  background: #000;
  z-index: 3;
}

.banner-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.live-info {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 8px 12px;
  background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Tab栏样式 */
.main-tabs {
  height: calc(100vh - 48px - 56vw);
  display: flex;
  flex-direction: column;
}

:deep(.van-tabs__wrap) {
  position: sticky;
  top: calc(48px + 56vw);
  z-index: 2;
  background: #fff;
  border-bottom: 1px solid #f5f5f5;
}

:deep(.van-tabs__content) {
  flex: 1;
  overflow: hidden;
  background: #fff;
  position: relative;
}

:deep(.van-tab__pane) {
  height: 100%;
  overflow-y: auto;
  padding-bottom: env(safe-area-inset-bottom);
}

:deep(.van-tab__pane-wrapper) {
  height: 100%;
}

/* 直播列表样式 */
.grid-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  padding: 12px;
  background: #fff;
}

.grid-item {
  width: 100%;
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
}

.grid-item.active {
  border: 1px solid #149D56;
}

.grid-img {
  width: 100%;
  aspect-ratio: 16/9;
  object-fit: cover;
}

.grid-title {
  font-size: 14px;
  color: #333;
  padding: 8px;
  text-align: left;
}

/* 农场互动样式 */
.chat-tab {
  position: relative;
  min-height: 100%;
  padding-bottom: 60px;
}

.comment-list {
  padding: 12px;
}

.comment-item {
  margin: 4px 0;
  font-size: 14px;
  line-height: 1.6;
  color: #333;
  text-align: left;
}

.comment-user {
  color: #149D56;
  margin-right: 4px;
  font-weight: 500;
}

.comment-input {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  gap: 8px;
  padding: 8px 12px;
  background: #fff;
  border-top: 1px solid #f5f5f5;
  width: 100%;
  box-sizing: border-box;
  align-items: center;
}

.comment-input .van-field {
    flex: 1;
    border: solid 1px #e0e0e0;
    border-radius: 8px;
}

.comment-input .van-button {
  flex-shrink: 0;
  height: 36px;
}

/* 农场详情样式 */
.section-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  padding: 16px 12px 4px;
  text-align: left;
}

.weather-card {
  background: rgb(235, 245, 255);
  border-radius: 8px;
  padding: 16px;
  margin: 0 12px 16px;
  box-sizing: border-box;
}

.weather-row {
  display: flex;
  justify-content: flex-start;
  font-size: 14px;
  margin-bottom: 8px;
}

.weather-location {
  color: #333;
  font-weight: 500;
}

.weather-main {
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 8px 0;
}

.weather-temp {
  font-size: 36px;
  font-weight: 600;
  color: #333;
}

.weather-unit {
  font-size: 14px;
  color: #666;
}

.weather-info {
  display: flex;
  gap: 16px;
  color: #666;
  font-size: 12px;
}

/* 农场详情页面布局 */
.farm-detail {
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

.farm-detail-content {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 80px;
}

.farm-detail-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 8px 12px;
  background: #fff;
  border-top: 1px solid #f5f5f5;
  z-index: 2;
}

.farm-intro {
  margin: 0 12px;
  background: #fff;
}

.intro-content {
  color: #333;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 16px;
  text-align: left;
}

.intro-meta {
  font-size: 12px;
  color: #666;
  text-align: left;
  
  > div {
    margin-bottom: 8px;
  }
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.tag {
  display: inline-block;
  padding: 4px 8px;
  background: #f5f5f5;
  border-radius: 4px;
  color: #666;
  font-size: 12px;
}

.contact-btn {
  width: 100%;
  height: 44px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
}

/* 骨架屏样式 */
.banner-skeleton {
  width: 100%;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
}

.banner-skeleton :deep(.van-skeleton__row) {
    height: 24px !important;
    margin: 12px 0 !important;
}

.banner-skeleton :deep(.van-skeleton__title) {
    width: 50% !important;
    height: 32px !important;
}

:deep(.van-skeleton) {
  padding: 16px;
  border-radius: 8px;
  background: #f5f5f5;
}
</style>
