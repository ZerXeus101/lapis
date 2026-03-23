<script setup lang="ts">
import { Pencil } from 'lucide-vue-next'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

defineProps<{
  info: {
    fullName: string
    email: string
    gradeLevel: string
    studentId: string
    dateOfBirth: string
    bio?: string | null
  }
}>()
</script>

<template>
  <Card class="border-border shadow-sm">
    <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-4">
      <CardTitle class="text-xl font-bold tracking-tight">Personal Information</CardTitle>
    </CardHeader>
    <CardContent class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <div v-for="(value, label) in {
          'Full Name': info.fullName,
          'Email Address': info.email,
          'Grade Level': info.gradeLevel,
          'Student ID': info.studentId,
          'Date of Birth': info.dateOfBirth
        }" :key="label" class="space-y-1">
          <p class="text-xs font-medium text-muted-foreground uppercase tracking-wider">{{ label }}</p>
          <p class="text-base text-foreground font-medium">{{ value }}</p>
        </div>
      </div>

      <!-- Bio Section -->
      <div v-if="info.bio" class="pt-4 border-t border-border">
        <p class="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Bio</p>
        <p class="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
          {{ info.bio }}
        </p>
      </div>
    </CardContent>
  </Card>
</template>
