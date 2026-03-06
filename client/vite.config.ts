import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite';
import NutUIResolver from '@nutui/auto-import-resolver'
import AutoImport from 'unplugin-auto-import/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
      vue(),
      AutoImport({
          imports: ['vue', 'vue-router', 'pinia'],
          dts: 'src/auto-imports.d.ts'
      }),
      Components({
          resolvers: [NutUIResolver()],
          dts: 'src/components.d.ts'
      })
  ],
    server: {
        port: 5173,
        // 方便开发时通过代理测试 API，后期上线靠 Vercel Rewrite
        proxy: {
            '/api': {
                target: 'http://localhost:3000', // 这里是你未来的后端地址
                changeOrigin: true,
            }
        }
    }
})
