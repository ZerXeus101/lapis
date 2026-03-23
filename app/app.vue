<script setup lang="ts">
import { Toaster, toast } from '@/components/ui/sonner'
import 'vue-sonner/style.css' // Required for vue-sonner to function correctly

const colorMode = useColorMode()
const { user } = useAuth()
const { fetchProfile } = useProfile()
const { $pwa } = useNuxtApp()

const siteName = 'Lapis'
const siteDescription = 'A modern Nuxt 4 note taking app utilizing Tailwind CSS v4 and shadcn-vue.'
const faviconPath = '/lapis_logo.png'

// PWA: Show update prompt when a new version is available
onMounted(() => {
  if ($pwa?.needRefresh) {
    watch(() => $pwa.needRefresh, (needRefresh) => {
      if (needRefresh) {
        toast.info('New content available, click to update', {
          duration: Infinity,
          action: {
            label: 'Update',
            onClick: () => $pwa.updateServiceWorker()
          }
        })
      }
    }, { immediate: true })
  }
})

// Global profile sync: ensuring the avatar is always fetched when a user is logged in
watch(user, (newUser) => {
  if (newUser) {
    fetchProfile(false, newUser)
  }
}, { immediate: true })

useHead({
  title: siteName,
  titleTemplate: (title) => title ? `${title} | ${siteName}` : siteName,
  link: [
    { rel: 'icon', type: 'image/png', href: faviconPath },
    { rel: 'apple-touch-icon', href: faviconPath }
  ],
  meta: [
    { name: 'theme-color', content: '#ffffff' }
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
