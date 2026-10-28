import type { AppConfig } from '../types/app-config'

const defaults: AppConfig = {
  apiBaseUrl: '',
  appEnv: 'local',
}

/**
 * Reads runtime config from `window.__APP_CONFIG__` (loaded via `/config.js`).
 * Safe to call after the classic script in `index.html` has run.
 */
export function getAppConfig(): AppConfig {
  const runtime = window.__APP_CONFIG__
  if (!runtime || typeof runtime !== 'object') {
    return { ...defaults }
  }

  return {
    apiBaseUrl:
      typeof runtime.apiBaseUrl === 'string'
        ? runtime.apiBaseUrl
        : defaults.apiBaseUrl,
    appEnv:
      typeof runtime.appEnv === 'string' ? runtime.appEnv : defaults.appEnv,
  }
}
