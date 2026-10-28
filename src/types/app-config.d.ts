export interface AppConfig {
  apiBaseUrl: string
  appEnv: string
}

declare global {
  interface Window {
    __APP_CONFIG__?: AppConfig
  }
}

export {}
