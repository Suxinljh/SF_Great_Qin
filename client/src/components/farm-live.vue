<template>
  <van-config-provider theme="light">
    <van-layout class="farm-layout">
      <van-header class="farm-header" style="background:#149D56;color:#fff;">
        <span class="farm-title">农场直播</span>
      </van-header>
      <van-content class="farm-content">
        <div class="banner-box">
          <img src="/img/live_1.jpg" class="banner-img" alt="banner" />
        </div>
        <van-tabs v-model:active="activeTab" color="#149D56" line-width="30px" line-height="3px" class="main-tabs" animated swipeable>
          <van-tab title="直播频道" name="channel">
            <div class="grid-list">
              <div v-for="cam in cameras" :key="cam.id" class="grid-item" @click="selectCamera(cam)">
                <img :src="`/img/${cam.url}`" class="grid-img" />
                <div class="grid-title">{{ cam.name }}</div>
              </div>
            </div>
          </van-tab>
          <van-tab title="农场互动" name="chat">
            <div class="comment-list">
              <div v-for="(c, i) in comments" :key="i" class="comment-item">
                <span class="comment-user">{{ c.user }}：</span>{{ c.text }}
              </div>
            </div>
            <div class="comment-input">
              <van-field v-model="input" placeholder="说点什么吧..." border clearable />
              <van-button type="primary" size="small" @click="sendComment">发送</van-button>
            </div>
          </van-tab>
          <van-tab title="农场详情" name="info">
            <div class="weather-card">
              <div class="weather-row">
                <span class="weather-city">当前天气</span>
                <span class="weather-location">海安市</span>
              </div>
              <div class="weather-main">
                <span class="weather-icon">❄️</span>
                <span class="weather-temp">-26</span>
                <span class="weather-unit">℃ 雪</span>
              </div>
              <div class="weather-info">
                <span>湿度: 69%</span>
                <span>风速: 东南风2级</span>
              </div>
            </div>
            <div class="farm-intro">
              <div class="intro-title">农场介绍</div>
              <div class="intro-content">
                破局·共生·跃迁——2025企业出海投融资论坛暨“苏美达天下”八周年<br />
                欢迎观看英雄联盟S13总决赛直播！今天将为大家带来T1 vs WBG的精彩对决。欢迎观看英雄联盟S13总决赛直播！字数上限150字符！
              </div>
              <div class="intro-meta">
                <div>分类：<span class="tag">商业聚会</span></div>
                <div>开播时间：<span>05月31日 09:41</span></div>
                <div>时长：<span>3小时</span></div>
                <div class="tag-list">
                  <span class="tag">#英雄联盟</span>
                  <span class="tag">#S13总决赛</span>
                  <span class="tag">#T1</span>
                </div>
              </div>
            </div>
            <van-button type="primary" block class="contact-btn" @click="contactOwner">联系农场主</van-button>
          </van-tab>
        </van-tabs>
      </van-content>
    </van-layout>
  </van-config-provider>
</template>

<script setup>
import { ref } from 'vue'
import { showToast } from 'vant'

const activeTab = ref('channel')
const cameras = ref([
  { id: 1, name: '东区农田', url: 'live_2.jpg' },
  { id: 2, name: '西区果园', url: 'live_3.jpg' },
  { id: 3, name: '南区蔬菜', url: 'live_4.jpg' },
  { id: 4, name: '北区果林', url: 'live_5.jpg' }
])
const selectCamera = (cam) => {
  showToast(`切换到：${cam.name}`)
}
const comments = ref([
  { user: '清风徐来', text: '哈哈哈哈哈哈' },
  { user: '干饭人干饭魂', text: '加油啊！' },
  { user: '元气满满蓝', text: '这个直播几点结束？' },
  { user: 'StarLight', text: '老师，请问PPT可以发一下学习一下吗？' },
  { user: '星辰大海梦', text: '点赞了直播' },
  { user: '书虫的世界', text: '我觉得你说的对' },
  { user: '剧荒少年在线', text: '分享了直播间' },
])
const input = ref('')
const sendComment = () => {
  if (!input.value.trim()) {
    showToast('请输入内容')
    return
  }
  comments.value.push({ user: '我', text: input.value })
  input.value = ''
}
const contactOwner = () => {
  window.open('weixin://')
}
</script>

<style scoped>
.farm-layout {
  min-height: 100vh;
  background: #f2f3f5;
}
.farm-header {
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 2px;
  background: #149D56;
  border-radius: 0 0 8px 8px;
}
.farm-title {
  color: #fff;
}
.farm-content {
  padding: 0;
  background: #f2f3f5;
}
.banner-box {
  width: 100%;
  aspect-ratio: 16/9;
  background: #fff;
  overflow: hidden;
  border-radius: 0 0 8px 8px;
}
.banner-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.main-tabs {
  background: #f2f3f5;
}
.van-tabs__nav {
  background: #fff;
}
.van-tabs__line {
  background: #149D56;
  border-radius: 8px;
}
.grid-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  padding: 16px 10px 0 10px;
}
.grid-item {
  background: #fff;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  cursor: pointer;
  padding: 0 0 8px 0;
}
.grid-img {
  width: 100%;
  aspect-ratio: 16/9;
  object-fit: cover;
  border-radius: 8px 8px 0 0;
  margin-bottom: 4px;
}
.grid-title {
  font-size: 15px;
  color: #333;
  margin-left: 8px;
  margin-top: 2px;
}
.comment-list {
  max-height: 320px;
  overflow: auto;
  background: #fff;
  border-radius: 8px;
  margin: 16px 10px 8px 10px;
  padding: 8px 0;
}
.comment-item {
  margin: 4px 12px;
  font-size: 15px;
  line-height: 1.8;
  color: #222;
  display: flex;
  align-items: center;
}
.comment-user {
  color: #149D56;
  margin-right: 4px;
  font-weight: 500;
}
.comment-input {
  margin: 8px 10px 0 10px;
  display: flex;
  gap: 8px;
  align-items: center;
  background: #fff;
  border-radius: 8px;
  padding: 4px 8px;
}
.comment-input .van-field {
  flex: 1;
  background: transparent;
}
.comment-input .van-button {
  min-width: 60px;
  background: #149D56;
  border-radius: 8px;
  border: none;
}
.weather-card {
  background: linear-gradient(135deg, #e0f7fa 60%, #fff 100%);
  border-radius: 8px;
  margin: 16px 10px 12px 10px;
  padding: 16px 16px 12px 16px;
}
.weather-row {
  display: flex;
  justify-content: space-between;
  font-size: 15px;
  color: #149D56;
  margin-bottom: 6px;
}
.weather-main {
  display: flex;
  align-items: baseline;
  font-size: 28px;
  color: #149D56;
  margin-bottom: 6px;
}
.weather-icon {
  font-size: 32px;
  margin-right: 8px;
}
.weather-temp {
  font-size: 32px;
  font-weight: bold;
  margin-right: 4px;
}
.weather-unit {
  font-size: 16px;
  color: #888;
}
.weather-info {
  font-size: 13px;
  color: #888;
  display: flex;
  gap: 16px;
}
.farm-intro {
  background: #fff;
  border-radius: 8px;
  margin: 12px 10px 8px 10px;
  padding: 14px 12px 10px 12px;
}
.intro-title {
  color: #149D56;
  font-weight: 600;
  margin-bottom: 6px;
}
.intro-content {
  color: #222;
  font-size: 15px;
  margin-bottom: 10px;
  line-height: 1.7;
}
.intro-meta {
  font-size: 13px;
  color: #888;
  margin-top: 6px;
}
.tag-list {
  margin-top: 4px;
}
.tag {
  display: inline-block;
  background: #e0f7fa;
  color: #149D56;
  border-radius: 8px;
  padding: 2px 8px;
  margin-right: 6px;
  font-size: 12px;
}
.contact-btn {
  margin: 18px 10px 0 10px;
  font-size: 16px;
  border-radius: 8px;
  background: #149D56;
  border: none;
}
</style>
