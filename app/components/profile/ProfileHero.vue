<script setup lang="ts">
import { Pencil } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

defineProps<{
  user: {
    name: string
    grade: string
    studentId: string
    avatarUrl?: string
  }
}>()
</script>

<template>
  <div class="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
    <!-- Cover Image / Background -->
    <div class="h-32 bg-primary/10 relative">
      <div class="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5"></div>
    </div>
    
    <!-- Profile Info Area -->
    <div class="px-6 pb-6 pt-0 relative">
      <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-12 gap-4">
        <div class="flex flex-col sm:flex-row sm:items-end gap-4">
          <!-- Avatar -->
          <Avatar class="w-24 h-24 border-4 border-card shadow-md rounded-2xl overflow-hidden">
            <AvatarImage v-if="user.avatarUrl" :src="user.avatarUrl" />
            <AvatarFallback class="bg-muted text-muted-foreground text-2xl font-bold rounded-none">
              {{ user.name.charAt(0).toUpperCase() }}
            </AvatarFallback>
          </Avatar>
          
          <!-- Name and ID -->
          <div class="pb-1">
            <h1 class="text-2xl font-bold text-foreground tracking-tight">{{ user.name }}</h1>
            <p class="text-sm text-muted-foreground font-medium">
              Grade {{ user.grade }} • Student ID: {{ user.studentId }}
            </p>
          </div>
        </div>
        
        <!-- Edit Action -->
        <Button class="w-full sm:w-auto font-semibold">
          <Pencil class="w-4 h-4 mr-2" />
          Edit Profile
        </Button>
      </div>
    </div>
  </div>
</template>
