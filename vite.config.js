import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    sourcemap: false, // 生产环境关闭sourcemap
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // 移除console.log
      }
    },
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name]-[hash].js`,
        chunkFileNames: `assets/[name]-[hash].js`,
        assetFileNames: `assets/[name]-[hash].[ext]`,
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['recharts'],
          cloudbase: ['@cloudbase/js-sdk', '@cloudbase/extension-sms'],
          icons: ['lucide-react']
        }
      }
    }
  }
})
