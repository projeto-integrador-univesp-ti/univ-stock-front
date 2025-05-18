/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE__URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
