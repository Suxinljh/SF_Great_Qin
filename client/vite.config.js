import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173, // 可改为你想要的端口
    host: '0.0.0.0',
    proxy: {
      '/api/weather': {
        target: 'https://api.caiyunapp.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/weather/, '/v2.6/2R5DUJiDlMJ1rmsZ/107.9,34.4/realtime')
      }
    }
  }
})