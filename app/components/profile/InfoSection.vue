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
  }
}>()
</script>

<template>
  <Card class="border-border shadow-sm">
    <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-4">
      <CardTitle class="text-xl font-bold tracking-tight">Personal Information</CardTitle>
      <button class="text-muted-foreground hover:text-foreground transition-colors">
        <Pencil class="w-4 h-4" />
      </button>
    </CardHeader>
    <CardContent class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
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
    </CardContent>
  </Card>
</template>
