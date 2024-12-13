/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_API_URL: string
  // readonly VITE_EMQX_URL: string
  readonly VITE_EMQX_URL: string
  readonly VITE_EMQX_API_KEY: string
  readonly VITE_EMQX_API_SECRET: string
  readonly VITE_WS_URL: string
  readonly VITE_THREEVIEW_URL: string
  // tambahkan variabel lain yang Anda butuhkan
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
