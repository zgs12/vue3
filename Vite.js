//安装vite
//npm install vite

// vite.config.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue'; // 如果你使用 Vue 3
// import other plugins as needed

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()], // 使用 Vue 插件
  // 基础公共路径。如果打包后的文件部署在一个子路径下，你需要设置它。
  base: '/',
  // 构建配置
  build: {
    // 输出目录，默认为 dist
    outDir: 'dist',
    // 是否压缩打包后的资源
    minify: 'esbuild',
    // 是否分离 CSS 到单独的文件
    cssCodeSplit: true,
    // Rollup 打包配置，这里可以覆盖 Rollup 的默认配置
    rollupOptions: {
      // ...
    },
  },
  // 开发服务器配置
  server: {
    // 服务器的根目录
    root: './',
    // 是否自动打开浏览器
    open: true,
    // 代理设置
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // 代理目标地址
        changeOrigin: true, // 是否改变源
        rewrite: (path) => path.replace(/^\/api/, ''), // 重写路径
      },
    },
    // 跨域设置
    cors: true,
    // HTTPS 配置
    https: false,
    // 其他 HMR 配置
    hmr: {
      // ...
    },
  },
  // 解析配置
  resolve: {
    // 别名配置
    alias: {
      '@': '/src', // 例如，将 '@' 解析为 src 目录
    },
    // 是否启用 .mjs、.js 和 .jsx 文件的扩展名解析
    dedupe: ['vue'], // 去除重复打包的模块
  },
  // CSS 配置
  css: {
    preprocessorOptions: {
      scss: {
        // 例如，为 SCSS 添加全局变量或混入
        additionalData: `@import "@/styles/variables.scss";`,
      },
    },
  },
  // 其他配置
  // ...
});