/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_UDAAN_API_BASE_URL?: string;
  readonly VITE_UDAAN_BROWSER_URL?: string;
  readonly VITE_UDAAN_USE_MOCK_DATA?: string;
  readonly VITE_CESIUM_ION_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
