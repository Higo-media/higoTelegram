import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import Components from 'unplugin-vue-components/vite';
import NutUIResolver from '@nutui/auto-import-resolver'
import AutoImport from 'unplugin-auto-import/vite';

export default defineConfig({
    plugins: [
        vue(),
        AutoImport({
            imports: ['vue', 'vue-router', 'pinia'],
            dts: 'src/auto-imports.d.ts'
        }),
        Components({
            resolvers: [
                NutUIResolver({
                    importStyle: false, // 关闭自动导入样式
                }),
            ],
        })
    ],
    resolve: {
        alias: {
            // 设置 @ 指向 src 目录
            '@': path.resolve(__dirname, './src')
        }
    },
    build: {
        outDir: 'dist', // 确保这里是 dist
    },
    server: {
        port: 5173,
        // 方便开发时通过代理测试 API，后期上线靠 Vercel Rewrite
        proxy: {
            '/api': {
                target: 'http://localhost:3000', // 后端地址
                changeOrigin: true,
                // rewrite: (path) => path.replace(/^\/api/, '')
            }
        }
    }
})
