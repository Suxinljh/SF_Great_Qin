<template>
  <div class="farm-app">
    <!-- 顶部标题 -->
    <header class="farm-header">
      <span class="farm-title">农场直播</span>
    </header>    <!-- 固定的直播画面 -->
    <section class="banner-box">
      <template v-if="loading">
        <van-skeleton title :row="3" :loading="loading" class="banner-skeleton" />
      </template>
      <template v-else>
        <img :src="`/img/${currentLive.url}`" class="banner-img" :alt="currentLive.name" loading="lazy" />
        <div class="live-info">
          <span class="live-title">{{ currentLive.name }}</span>
          <span class="live-status">LIVE</span>
        </div>
      </template>
    </section>    <!-- Tab 区域 -->
    <section class="main-tabs-container">
      <div class="custom-tabbar">
        <div class="custom-tabbar-inner">
          <div v-for="(tab, idx) in tabTitles" :key="idx" class="custom-tabbar-item" :class="{active: activeTab === idx}" @click="activeTab = idx">
            {{ tab }}
          </div>
        </div>
      </div>
      <div class="main-tabs">
        <div v-show="activeTab === 0" class="main-scroll-area">
          <div class="grid-list">
            <div v-for="cam in cameras" :key="cam.id" 
                 class="grid-item" 
                 :class="{ active: currentLive.id === cam.id }"
                 @click="selectCamera(cam)">
              <img :src="`/img/${cam.url}`" class="grid-img" loading="lazy" />
              <div class="grid-title">{{ cam.name }}</div>
            </div>
          </div>
        </div>
        <div v-show="activeTab === 1" class="main-scroll-area">
          <div class="comment-list">
            <div v-for="(c, i) in comments" :key="i" class="comment-item">
              <span class="comment-user">{{ c.user }}：</span>{{ c.text }}
            </div>
          </div>
        </div>
        <div v-show="activeTab === 2" class="farm-detail">
          <div class="farm-detail-content">
            <div class="section-title">农场天气</div>
            <div class="weather-card">
              <div class="weather-row">
                <span class="weather-location">扶风县</span>
                <span class="weather-date">{{ new Date().toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' }) }}</span>
              </div>
              <div class="weather-main">
                <span class="weather-temp">{{ weather.temp }}</span>
                <span class="weather-unit">℃</span>
              </div>
              <div class="weather-info">
                <span>湿度：{{ weather.humidity }}%</span>
                <span>风：{{ weather.wind }}</span>
              </div>
            </div>

            <div class="section-title">农场介绍</div>
            <div class="farm-intro">
              <div class="intro-content">
                扶风县有机生态农场成立于2018年，占地面积500亩。我们坚持"自然农法、环保循环"的理念，采用传统与科技结合的种植方式。目前主要种植当季有机蔬菜，养殖土鸡500只，生态鱼塘3个。我们采用太阳能供电系统，雨水收集灌溉技术，形成了完整的生态循环体系。欢迎各界朋友参观交流！
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
        </div>
      </div>
      <!-- 底部输入和按钮区域 -->
      <comment-input
        v-if="activeTab === 1"
        v-model:value="input"
        :cooldown="checkCommentCooldown()"
        @send="sendComment"
      />
      <farm-detail-footer
        v-if="activeTab === 2"
        @contact="contactOwner"
      />
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { showToast, showLoadingToast } from 'vant'
import { liveData } from '../data/live-data.js'
import CommentInput from './comment-input.vue'
import FarmDetailFooter from './farm-detail-footer.vue'

// 加载状态
const loading = ref(true)

// 当前选中的tab
const activeTab = ref(0)

// 防刷屏控制
const lastCommentTime = ref(0)
const COMMENT_COOLDOWN = 30 * 1000 // 30秒冷却时间

// 当前直播间信息
const currentLive = ref(liveData.default)
// 可切换的直播间列表
const cameras = ref(liveData.cameras)

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

// 天气数据
const weather = ref({
  temp: '--',
  text: '--',
  humidity: '--',
  wind: '--'
})

// 获取天气（彩云天气API）
const fetchWeather = async () => {
  try {
    const res = await fetch('/api/weather')
    const data = await res.json()
    if (data && data.result && data.result.realtime) {
      const rt = data.result.realtime
      weather.value.temp = rt.temperature || '--'
      weather.value.text = rt.skycon || '--'
      weather.value.humidity = rt.humidity ? Math.round(rt.humidity * 100) : '--'
      weather.value.wind = rt.wind ? `${rt.wind.speed}m/s` : '--'
    }
  } catch (e) {
    weather.value = { temp: '--', text: '获取失败', humidity: '--', wind: '--' }
  }
}

// 检查评论冷却时间
const checkCommentCooldown = () => {
  const now = Date.now()
  return Math.max(0, Math.ceil((COMMENT_COOLDOWN - (now - lastCommentTime.value)) / 1000))
}

// 发送评论
const input = ref('')
const sendComment = () => {
  if (!input.value.trim()) {
    showToast('请输入内容')
    return
  }
  const now = Date.now()
  // 检查发言间隔
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
  await new Promise(resolve => setTimeout(resolve, 1000))
  loadToast.close()
  loading.value = false
  await fetchWeather()
})

// Tab 标题
const tabTitles = ['直播频道', '农场互动', '农场详情']
</script>

<style>
:root {
  --van-primary-color: var(--primary-color);
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

<style>
:root {
  --primary-color: #149D56;
  --bg-color: #fff;
  --text-color: #333;
  --border-color: #f5f5f5;
  --spacing-sm: 8px;
  --spacing-md: 12px;
  --spacing-lg: 16px;
}
</style>

<style scoped>
.farm-app {
  min-height: 100vh;
  background: var(--bg-color);
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
  border-bottom: 1px solid var(--border-color);
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
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
}

.grid-item.active {
  border: 1px solid var(--primary-color);
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

/* 农场详情样式 */
.section-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  padding: 16px 12px 4px;
  text-align: left;
}

.weather-card {
  background: linear-gradient(135deg, #ebf5ff 0%, #ebfff7 100%);
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

.weather-date {
  margin-left: auto;
  font-size: 13px;
  color: #888;
  font-weight: 400;
}

.weather-main {
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 8px 0;
}

.weather-temp {
  font-size: 24px;
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

.custom-tabbar {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;
  padding: 12px 12px 0 12px;
  border-bottom: 1px solid #f5f5f5;
}

.custom-tabbar-inner {
  display: flex;
  gap: 32px;
}

.custom-tabbar-item {
  display: inline-block;
  min-width: 48px;
  padding: 0 8px;
  text-align: center;
  font-size: 16px;
  cursor: pointer;
  color: #888;
  transition: color 0.2s;
  position: relative;
}

.custom-tabbar-item.active {
  color: #149D56;
  font-weight: bold;
}

.custom-tabbar-item.active::after {
  content: '';
  display: block;
  margin: 0 auto;
  margin-top: 4px;
  width: 32px;
  height: 2px;
  background: #149D56;
  border-radius: 1px;
}

:deep(.van-cell) {
  border: .5px solid #e0e0e0;
  border-radius: 8px;
  box-sizing: border-box;
}
:deep(.van-button) {
  border-radius: 8px;
  font-weight: 500;
  font-size: 16px;
  height: 44px;

}
</style>
