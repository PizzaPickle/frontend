import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxRuntime: "classic",
    }),
  ],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react')) {
              return 'react-vendor';
            }
            if (id.includes('lodash')) {
              return 'lodash-vendor';
            }
            return 'vendor';
          }
        }
      }
    }
  },
  define: {
    "process.env": process.env,
  },
  server: {
    proxy: {
      "/backtest": {
        target: "http://43.202.241.180",
        changeOrigin: true,
        secure: false, // HTTPS일 경우에도 사용할 수 있음
        followRedirects: true, // 리디렉션 따르기
        rewrite: (path) => path.replace(/^\/backtest/, "/backtest"),
      },
      "/api/pickle-pb": {
        target: "http://localhost:8081",
        changeOrigin: true,
        secure: false, // HTTPS일 경우에도 사용할 수 있음
        followRedirects: true, // 리디렉션 따르기
      },
      "/api/pickle-common": {
        target: "http://localhost:8081",
        changeOrigin: true,
        secure: false, // HTTPS일 경우에도 사용할 수 있음
        followRedirects: true, // 리디렉션 따르기
      },
      "/api/mydata": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false, // HTTPS일 경우에도 사용할 수 있음
        followRedirects: true, // 리디렉션 따르기
        rewrite: (path) => path.replace(/^\/api\/mydata/, "/api/mydata"),
      },
      "/api/pickle-customer": {
        target: "http://localhost:8081",
        changeOrigin: true,
        secure: false, // HTTPS일 경우에도 사용할 수 있음
        followRedirects: true, // 리디렉션 따르기
        rewrite: (path) =>
          path.replace(/^\/api\/pickle-customer/, "/api/pickle-customer"),
      },
    },
  },
});