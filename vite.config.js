import { defineConfig, normalizePath } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "node:path";
import { viteStaticCopy } from "vite-plugin-static-copy";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

const resolveFile = (filePath) => normalizePath(path.join(__dirname, filePath));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    viteStaticCopy({
      targets: [
        {
          src: resolveFile("pages"),
          dest: resolveFile("dist"),
        },
        {
          src: resolveFile("manifest.json"),
          dest: resolveFile("dist"),
        },
        {
          src: resolveFile("static"),
          dest: resolveFile("dist"),
        },
      ],
    }),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  build: {
    sourcemap: true,
  },
  server: {
    open: true,
    proxy: {
      '/baidu': {
        target: 'https://api.fanyi.baidu.com/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/baidu/, ''),
      },
      '/youdao': {
        target: 'http://openapi.youdao.com/api',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/youdao/, ''),
      }
    }
  }
});
