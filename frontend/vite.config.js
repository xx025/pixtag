import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // 允许局域网访问
    watch: {
      usePolling: true, // 关键点：改为轮询监听文件变化
      interval: 100,    // 轮询频率，单位毫秒，可调整
    },
  },
})
