import react from '@vitejs/plugin-react'
import fixReactVirtualized from 'esbuild-plugin-react-virtualized'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/


export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  return {
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
      port: parseInt(env.VITE_PORT, 10) || 3040,
      strictPort: true,
      proxy: {
        '/api': {
          target: env.VITE_API_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        },
        '/mqtt': {
          target: env.VITE_EMQX_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/mqtt/, '')
        },
        '/threeview': {
          target: env.VITE_THREEVIEW_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/threeview/, '')
        },
        '/socket': {
          target: env.VITE_WEBSOCKET_URL,
          ws: true,
          changeOrigin: true,
          // rewrite: (path) => path.replace(/^\/socket/, '/mqtt'),      
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
            // Utility dan library umum
            utilities: ['lodash', 'dayjs', 'axios'],

            // UI tambahan
            icons: ['@tabler/icons-react'],
            charts: ['recharts', 'react-spring', '@react-spring/web'],
          }
        }
      }
    }
  }
})

