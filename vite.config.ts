import react from '@vitejs/plugin-react'
import fixReactVirtualized from 'esbuild-plugin-react-virtualized'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs',
      "@renderer": path.resolve(__dirname, "./src"),
      "@renderer/types": path.resolve(__dirname, "./src/types"),
    }
  },
  plugins: [
    react(),
    visualizer({
      filename: './out/stats.html', // Path output file
      template: 'treemap',
    }),
  ],
  optimizeDeps: {
    esbuildOptions: {
      plugins: [fixReactVirtualized]
    }
  },
  server: {
    port: 3040,
    proxy: {
      '/mqtt': {
        target: 'http://192.168.192.7:18083', // Backend API yang menerima permintaan
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/mqtt/, '')
      },
      '/threeview': {
        target: 'http://192.168.192.34:8080', // Backend API yang menerima permintaan
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/threeview/, '')
      },
      '/socket': {
        target: 'ws://192.168.192.7:8083', // Alamat broker MQTT
        ws: true,
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/socket/, '/mqtt'), // Hapus prefix '/mqtt',        
      },
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Framework utama
          react: ['react', 'react-dom'],

          // Mantine dan komponennya
          mantine: [
            '@mantine/core',
            '@mantine/hooks',
            '@mantine/modals',
            '@mantine/notifications',
            '@mantine/dates',
            '@mantine/form',
            '@mantine/code-highlight',
            '@mantine/charts',
            '@mantine/spotlight',
            '@mantine/tiptap',
            '@mantine/dropzone',
            '@mantine/carousel',
            '@mantine/nprogress',
          ],

          // Ag-Grid
          // aggrid: [
          //   '@ag-grid-community/core',
          //   '@ag-grid-community/react',
          //   '@ag-grid-community/client-side-row-model',
          //   '@ag-grid-community/styles',
          // ],

          // Utility dan library umum
          utilities: ['lodash', 'dayjs', 'axios'],

          // UI tambahan
          icons: ['@tabler/icons-react'],
          charts: ['recharts', 'react-spring', '@react-spring/web'],
        }
      }
    }
  }
})
