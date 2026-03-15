<script setup lang="ts">
const user = useSupabaseUser()

// Get redirect path from query or default to home
const route = useRoute()
const redirectPath = (route.query.redirectTo as string) || '/'

watch(user, () => {
  if (user.value) {
      return navigateTo(redirectPath)
  }
}, { immediate: true })
</script>

<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="text-center">
      <p class="text-lg">Signing in...</p>
    </div>
  </div>
</template>
