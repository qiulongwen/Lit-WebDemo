/**
 * Runtime config for Lit-WebDemo.
 * In Kubernetes, replace this file via ConfigMap mount at:
 *   /usr/share/nginx/html/config.js
 * Values here are placeholders for local/dev; do not bake secrets into the image.
 */
window.__APP_CONFIG__ = {
  apiBaseUrl: '',
  appEnv: 'local',
}
