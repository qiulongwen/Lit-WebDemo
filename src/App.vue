<script setup lang="ts">
const projectName = 'Lit-WebDemo'
</script>

<template>
  <main class="page">
    <header class="brand">
      <p class="eyebrow">Vue 3 · Vite · TypeScript</p>
      <h1>{{ projectName }}</h1>
      <p class="lede">
        A lightweight demo app ready for local development and containerized
        deployment via GitHub Actions to GHCR.
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
