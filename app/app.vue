<script setup lang="ts">
const siteName = 'Lapis'
const siteDescription = 'A modern Nuxt 4 starter template utilizing Tailwind CSS v4 and shadcn-vue.'
const faviconPath = '/favicon.ico'

useHead({
  title: siteName,
  titleTemplate: (title) => title ? `${title} | ${siteName}` : siteName,
  link: [
    { rel: 'icon', type: 'image/x-icon', href: faviconPath }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

useSeoMeta({
  title: siteName,
  description: siteDescription,
  ogTitle: siteName,
  ogDescription: siteDescription,
  ogType: 'website',
  // ogImage: '/og-image.png', // Add your OG image path here
  // twitterCard: 'summary_large_image',
})
</script>

<template>
  <div class="min-h-screen bg-background font-sans antialiased">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style>
/* Base global styles if needed */
</style>
