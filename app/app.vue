<script setup lang="ts">
import { Toaster } from '@/components/ui/sonner'
import 'vue-sonner/style.css' // Required for vue-sonner to function correctly

const colorMode = useColorMode()

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
})
</script>

<template>
  <div class="min-h-screen bg-background font-sans antialiased text-foreground transition-colors duration-300">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <!-- Binding the theme to Nuxt's color mode (light, dark, or system) -->
    <Toaster 
      position="top-right" 
      :expand="true" 
      rich-colors 
      :theme="colorMode.value === 'dark' ? 'dark' : (colorMode.value === 'light' ? 'light' : 'system')"
    />
  </div>
</template>

<style>
/* Base global styles if needed */
</style>
