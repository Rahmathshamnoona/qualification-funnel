/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_META_PIXEL_ID?: string
  readonly VITE_OPS_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
