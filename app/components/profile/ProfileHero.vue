<script setup lang="ts">
import { Pencil } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

defineProps<{
  user: {
    name: string
    grade: string
    studentId: string
    avatarUrl?: string | null
    coverPhotoUrl?: string | null
    bio?: string | null
  }
}>()
</script>

<template>
  <div class="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
    <!-- Cover Image / Background -->
    <div 
      class="h-32 relative bg-primary/10 bg-cover bg-center transition-all duration-700"
      :style="user.coverPhotoUrl ? { backgroundImage: `url(${user.coverPhotoUrl})` } : {}"
    >
      <div v-if="!user.coverPhotoUrl" class="absolute inset-0 bg-linear-to-r from-primary/20 to-primary/5"></div>
      <div v-else class="absolute inset-0 bg-black/20"></div>
    </div>
    
    <!-- Profile Info Area -->
    <div class="px-6 pb-6 pt-0 relative">
      <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-12 gap-4">
        <div class="flex flex-col sm:flex-row sm:items-end gap-4 flex-1 min-w-0">
          <!-- Avatar -->
          <Avatar class="w-24 h-24 border-4 border-card shadow-md rounded-2xl overflow-hidden shrink-0 bg-muted">
            <AvatarImage v-if="user.avatarUrl" :src="user.avatarUrl" />
            <AvatarFallback class="bg-muted text-muted-foreground text-2xl font-bold rounded-none">
              {{ user.name.charAt(0).toUpperCase() }}
            </AvatarFallback>
          </Avatar>
          
          <!-- Name, ID and Bio -->
          <div class="pb-1 space-y-1 min-w-0 flex-1">
            <h1 class="text-2xl font-bold text-foreground tracking-tight truncate">{{ user.name }}</h1>
            <p class="text-sm text-muted-foreground font-medium">
               {{ user.grade }} • Student ID: {{ user.studentId }}
            </p>
            <p v-if="user.bio" class="text-sm text-foreground/80 mt-2 line-clamp-2 max-w-2xl italic">
              "{{ user.bio }}"
            </p>
          </div>
        </div>
        
        <!-- Edit Action -->
        <NuxtLink to="/profile/edit" class="w-full sm:w-auto shrink-0">
          <Button class="w-full sm:w-auto font-semibold">
            <Pencil class="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
