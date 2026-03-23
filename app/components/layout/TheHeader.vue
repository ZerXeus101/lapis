<script setup lang="ts">
import { 
  GraduationCap, 
  Bell, 
  User, 
  Calendar,
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
import { VisuallyHidden } from 'radix-vue'

const { user } = useAuth()
const { profile } = useProfile()
const isSheetOpen = ref(false)

const navItems = [
  { label: 'Profile', icon: User, href: '/profile' },
  { label: 'Calendar', icon: Calendar, href: '/calendar' },
  { label: 'Reports', icon: FilePieChart, href: '/report' },
]

const emit = defineEmits<{
  (e: 'logout'): void
}>()
</script>

<template>
  <header class="h-16 bg-card border-b border-border flex items-center justify-between px-4 sticky top-0 z-50">
    <div class="flex items-center gap-3">
      <NuxtLink to="/" class="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-primary-foreground transition-transform hover:scale-105 active:scale-95 overflow-hidden">
        <img src="/lapis_logo.png" alt="Lapis Logo" class="w-full h-full object-cover" />
      </NuxtLink>
    </div>
    
    <div class="flex items-center gap-4">
      <Button variant="ghost" size="icon" class="relative hidden sm:flex text-muted-foreground hover:text-foreground">
        <Bell class="w-5 h-5" />
      </Button>

      <Sheet v-model:open="isSheetOpen">
        <SheetTrigger as-child>
          <Avatar class="w-10 h-10 border-2 border-border cursor-pointer transition-transform hover:scale-105 active:scale-95">
            <AvatarImage v-if="profile.avatar_url" :src="profile.avatar_url" />
            <AvatarFallback class="bg-muted text-muted-foreground">{{ user?.email?.charAt(0).toUpperCase() || 'U' }}</AvatarFallback>
          </Avatar>
        </SheetTrigger>
        <SheetContent side="right" class="bg-card border-border w-75 sm:w-100">
          <SheetHeader class="text-left border-b border-border pb-6">
            <VisuallyHidden>
              <SheetTitle>User Navigation Sidebar</SheetTitle>
              <SheetDescription>Access your profile, reports, and settings from here.</SheetDescription>
            </VisuallyHidden>
            <div class="flex items-center gap-4">
              <Avatar class="w-12 h-12 border-2 border-primary">
                <AvatarImage v-if="profile.avatar_url" :src="profile.avatar_url" />
                <AvatarFallback class="bg-muted text-muted-foreground">{{ user?.email?.charAt(0).toUpperCase() || 'U' }}</AvatarFallback>
              </Avatar>
              <div class="flex flex-col min-w-0">
                <p class="font-bold text-foreground truncate">{{ profile.full_name || user?.email }}</p>
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
                @click="emit('logout')" 
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
</template>
