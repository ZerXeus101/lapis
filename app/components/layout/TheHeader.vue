<script setup lang="ts">
import { 
  User, 
  Calendar,
  FilePieChart, 
  LogOut,
  ChevronDown,
  Settings
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
  <header class="h-20 bg-card/80 backdrop-blur-md border-b border-border flex items-center justify-between px-6 md:px-12 sticky top-0 z-50">
    <!-- Left side: Logo -->
    <NuxtLink to="/" class="flex items-center gap-3 group transition-all">
      <div class="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20 transition-transform group-hover:scale-105 active:scale-95 overflow-hidden">
        <img src="/lapis_logo.png" alt="Lapis Logo" class="w-full h-full object-cover" />
      </div>
      <span class="text-2xl font-black tracking-tighter bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent uppercase">Lapis</span>
    </NuxtLink>
    
    <!-- Right side: Nav + Profile -->
    <div class="flex items-center gap-4">
      <!-- Desktop Navigation Pills -->
      <nav class="hidden md:flex items-center gap-2 mr-4">
        <NuxtLink 
          v-for="item in navItems" 
          :key="item.label" 
          :to="item.href"
          class="relative px-6 py-3 rounded-full transition-all duration-300 flex items-center gap-3 group overflow-hidden"
          active-class="text-primary"
          v-slot="{ isActive }"
        >
          <!-- Background glow on active/hover -->
          <div :class="[
            'absolute inset-0 transition-opacity duration-300',
            isActive ? 'bg-primary/10 opacity-100' : 'bg-primary/5 opacity-0 group-hover:opacity-100'
          ]"></div>
          
          <component :is="item.icon" :class="['w-5 h-5 transition-colors relative z-10', isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-primary']" />
          <span :class="['relative z-10 uppercase tracking-widest text-[11px] font-black', isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-primary']">{{ item.label }}</span>
          
          <!-- Active indicator dot -->
          <div v-if="isActive" class="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary shadow-sm shadow-primary"></div>
        </NuxtLink>
      </nav>

      <!-- Profile Section -->
      <div class="flex items-center gap-2">
        <!-- Desktop: Dropdown Menu -->
        <div class="hidden md:block">
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <div class="flex items-center gap-4 pl-4 pr-2.5 py-2 rounded-full bg-muted/30 border border-border hover:bg-muted/50 transition-all cursor-pointer group">
                <div class="flex flex-col items-end mr-1">
                  <p class="text-xs font-black uppercase tracking-wider text-foreground leading-tight">{{ profile.full_name || 'Student' }}</p>
                </div>
                <Avatar class="w-10 h-10 border-2 border-background shadow-sm transition-transform group-hover:scale-105">
                  <AvatarImage v-if="profile.avatar_url" :src="profile.avatar_url" />
                  <AvatarFallback class="bg-primary/10 text-primary text-sm font-black">{{ user?.email?.charAt(0).toUpperCase() || 'U' }}</AvatarFallback>
                </Avatar>
                <ChevronDown class="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" class="w-56 p-2 bg-card/95 backdrop-blur-xl border-border shadow-2xl rounded-2xl">
              <DropdownMenuLabel class="px-3 py-3">
                <div class="flex flex-col gap-0.5">
                  <p class="text-xs font-black uppercase tracking-widest text-foreground">{{ profile.full_name || 'User' }}</p>
                  <p class="text-[10px] font-medium text-muted-foreground truncate">{{ user?.email }}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator class="bg-border/50" />
              <DropdownMenuItem @click="emit('logout')" class="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-destructive/5 group text-destructive">
                <LogOut class="w-4 h-4" />
                <span class="text-xs font-black uppercase tracking-widest">Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <!-- Mobile: Sheet (Sidebar) -->
        <div class="md:hidden">
          <Sheet v-model:open="isSheetOpen">
            <SheetTrigger as-child>
              <Avatar class="w-10 h-10 border-2 border-border cursor-pointer transition-transform hover:scale-105 active:scale-95">
                <AvatarImage v-if="profile.avatar_url" :src="profile.avatar_url" />
                <AvatarFallback class="bg-muted text-muted-foreground font-black">{{ user?.email?.charAt(0).toUpperCase() || 'U' }}</AvatarFallback>
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
                    <p class="font-black text-foreground truncate uppercase tracking-tighter">{{ profile.full_name || user?.email }}</p>
                    <p class="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Student Account</p>
                  </div>
                </div>
              </SheetHeader>

              <div class="py-8 flex flex-col gap-2">
                <NuxtLink v-for="item in navItems" :key="item.label" :to="item.href" @click="isSheetOpen = false">
                  <Button variant="ghost" class="w-full justify-start gap-4 h-14 text-sm font-black uppercase tracking-widest text-muted-foreground hover:text-primary hover:bg-primary/5 group rounded-2xl">
                    <component :is="item.icon" class="w-5 h-5 transition-colors" />
                    {{ item.label }}
                  </Button>
                </NuxtLink>
                
                <div class="border-t border-border my-6 pt-6">
                  <Button 
                    variant="ghost" 
                    @click="emit('logout')" 
                    class="w-full justify-start gap-4 h-14 text-sm font-black uppercase tracking-widest text-destructive hover:text-destructive hover:bg-destructive/5 group rounded-2xl"
                  >
                    <LogOut class="w-5 h-5" />
                    Logout
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  </header>
</template>
