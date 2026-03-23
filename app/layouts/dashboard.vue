<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { toast } from 'vue-sonner'
import TheHeader from '@/components/layout/TheHeader.vue'

const { user, logout: authLogout } = useAuth()
const { fetchProfile, clearProfile } = useProfile()
const router = useRouter()
const supabase = useSupabaseClient()
const isLogoutDialogOpen = ref(false)
const isLoggingOut = ref(false)

// Proactive Redirect: If user becomes null while on a dashboard page, force a kick
watch(user, (newUser) => {
  if (!newUser && !isLoggingOut.value) {
    // Only kick if we aren't already on the login page or registering
    if (!['/login', '/register'].includes(router.currentRoute.value.path)) {
      console.warn('User lost session. Kicking to login...')
      clearProfile()
      router.push('/login')
      toast.error('Session expired. Please log in again.')
    }
  }
}, { immediate: true })

const handleLogout = async () => {
  try {
    isLoggingOut.value = true
    await authLogout()
    clearProfile() // Clear local profile state immediately
    toast.success('Successfully logged out')
  } catch (error) {
    console.error('Logout error:', error)
    toast.error('Failed to log out')
  } finally {
    isLogoutDialogOpen.value = false
    isLoggingOut.value = false
  }
}

// Global Auth Listener: Catch both explicit SIGNOUT and failed REFRESH
onMounted(() => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    // Session being null usually means token refresh failed or user was deleted
    if (session === null && !isLoggingOut.value) {
      if (!['/login', '/register'].includes(router.currentRoute.value.path)) {
        router.push('/login')
        toast.error('Your session has expired. Please log in again.')
      }
    }
  })

  // Cleanup on unmount
  onUnmounted(() => {
    subscription.unsubscribe()
  })
})
</script>

<template>
  <div class="min-h-screen bg-background flex flex-col font-sans transition-colors duration-300 text-foreground">
    <!-- Reusable Header -->
    <TheHeader @logout="isLogoutDialogOpen = true" />

    <!-- Page Content -->
    <slot />

    <!-- Global Dialogs -->
    <AlertDialog :open="isLogoutDialogOpen" @update:open="isLogoutDialogOpen = $event">
      <AlertDialogContent class="bg-card border-border">
        <AlertDialogHeader>
          <AlertDialogTitle class="text-foreground text-xl">Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription class="text-muted-foreground">
            This will end your current session and you will need to log in again to access your tasks.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel class="bg-muted text-foreground border-border hover:bg-muted/80">Cancel</AlertDialogCancel>
          <AlertDialogAction @click="handleLogout" class="bg-destructive text-destructive-foreground hover:bg-destructive/90 font-medium">
            Yes, log me out
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>
