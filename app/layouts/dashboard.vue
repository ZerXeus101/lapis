<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { 
  GraduationCap, 
  Bell, 
  User, 
  Calendar,
  Settings, 
  FilePieChart, 
  LogOut,
} from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from '@/components/ui/sheet'
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
import { VisuallyHidden } from 'radix-vue'

const { user, logout: authLogout } = useAuth()
const supabase = useSupabaseClient()
const isLogoutDialogOpen = ref(false)
const isSheetOpen = ref(false)
const isLoggingOut = ref(false)

const handleLogout = async () => {
  try {
    isLoggingOut.value = true
    await authLogout()
    toast.success('Successfully logged out')
  } catch (error) {
    console.error('Logout error:', error)
    toast.error('Failed to log out')
  } finally {
    isLogoutDialogOpen.value = false
    isLoggingOut.value = false
  }
}

// Global Auth Listener
onMounted(() => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    // This only catches UNINTENDED sign outs (like JWT expiration)
    if (event === 'SIGNED_OUT' && !isLoggingOut.value) {
      toast.error('Your session has expired. Please log in again.')
    }
  })

  // Cleanup on unmount
  onUnmounted(() => {
    subscription.unsubscribe()
  })
})

const navItems = [
  { label: 'Profile', icon: User, href: '/profile' },
  { label: 'Calendar', icon: Calendar, href: '/calendar' },
  { label: 'Reports', icon: FilePieChart, href: '/reports' },
  { label: 'Settings', icon: Settings, href: '/settings' },
]
</script>

<template>
  <div class="min-h-screen bg-background flex flex-col font-sans transition-colors duration-300 text-foreground">
    <!-- Shared Header -->
    <header class="h-16 bg-card border-b border-border flex items-center justify-between px-4 sticky top-0 z-50">
      <div class="flex items-center gap-3">
        <NuxtLink to="/" class="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-primary-foreground transition-transform hover:scale-105 active:scale-95">
          <GraduationCap class="w-6 h-6" />
        </NuxtLink>
      </div>
      
      <div class="flex items-center gap-4">
        <Button variant="ghost" size="icon" class="relative hidden sm:flex text-muted-foreground hover:text-foreground">
          <Bell class="w-5 h-5" />
        </Button>

        <Sheet v-model:open="isSheetOpen">
          <SheetTrigger as-child>
            <Avatar class="w-10 h-10 border-2 border-border cursor-pointer transition-transform hover:scale-105 active:scale-95">
              <AvatarImage v-if="user?.user_metadata?.avatar_url" :src="user.user_metadata.avatar_url" />
              <AvatarFallback class="bg-muted text-muted-foreground">{{ user?.email?.charAt(0).toUpperCase() || 'U' }}</AvatarFallback>
            </Avatar>
          </SheetTrigger>
          <SheetContent side="right" class="bg-card border-border w-[300px] sm:w-[400px]">
            <SheetHeader class="text-left border-b border-border pb-6">
              <VisuallyHidden>
                <SheetTitle>User Navigation Sidebar</SheetTitle>
                <SheetDescription>Access your profile, reports, and settings from here.</SheetDescription>
              </VisuallyHidden>
              <div class="flex items-center gap-4">
                <Avatar class="w-12 h-12 border-2 border-primary">
                  <AvatarImage v-if="user?.user_metadata?.avatar_url" :src="user.user_metadata.avatar_url" />
                  <AvatarFallback class="bg-muted text-muted-foreground">{{ user?.email?.charAt(0).toUpperCase() || 'U' }}</AvatarFallback>
                </Avatar>
                <div class="flex flex-col min-w-0">
                  <p class="font-bold text-foreground truncate">{{ user?.email }}</p>
                  <p class="text-xs text-muted-foreground">Student Account</p>
                </div>
              </div>
            </SheetHeader>

            <div class="py-8 flex flex-col gap-2">
              <NuxtLink v-for="item in navItems" :key="item.label" :to="item.href" @click="isSheetOpen = false">
                <Button variant="ghost" class="w-full justify-start gap-3 h-12 text-base font-normal text-muted-foreground hover:text-foreground hover:bg-accent group">
                  <component :is="item.icon" class="w-5 h-5 group-hover:text-primary transition-colors" />
                  {{ item.label }}
                </Button>
              </NuxtLink>
              
              <div class="border-t border-border my-4 pt-4">
                <Button 
                  variant="ghost" 
                  @click="isLogoutDialogOpen = true" 
                  class="w-full justify-start gap-3 h-12 text-base font-normal text-destructive hover:text-destructive hover:bg-destructive/10 group"
                >
                  <LogOut class="w-5 h-5" />
                  Logout
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>

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
