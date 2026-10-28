<script setup lang="ts">
import { getAppConfig } from './utils/appConfig'

const projectName = 'Lit-WebDemo'
const config = getAppConfig()
</script>

<template>
  <main class="page">
    <header class="brand">
      <p class="eyebrow">Vue 3 · Vite · TypeScript · {{ config.appEnv }}</p>
      <h1>{{ projectName }}</h1>
      <p class="lede">
        A lightweight demo app ready for local development and containerized
        deployment via GitHub Actions to GHCR.
      </p>
      <p v-if="config.apiBaseUrl" class="lede config-hint">
        API base: <code>{{ config.apiBaseUrl }}</code>
      </p>
    </header>

    <section class="actions" aria-label="Quick links">
      <a class="cta" href="https://vuejs.org/" target="_blank" rel="noreferrer">
        Vue docs
      </a>
      <a
        class="cta secondary"
        href="https://vite.dev/"
        target="_blank"
        rel="noreferrer"
      >
        Vite docs
      </a>
    </section>
  </main>
</template>
