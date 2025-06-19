import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// 导入 Vant
import { Tabs, Tab, Field, Button } from 'vant'
import 'vant/lib/index.css'

const app = createApp(App)

// 注册 Vant 组件
app.use(Tabs)
app.use(Tab)
app.use(Field)
app.use(Button)

app.mount('#app')
