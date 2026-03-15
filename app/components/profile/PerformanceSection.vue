<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface Category {
  name: string
  completed: number
  total: number
}

defineProps<{
  categories: Category[]
}>()

const getPercentage = (completed: number, total: number) => {
  return (completed / total) * 100
}
</script>

<template>
  <Card class="border-border shadow-sm">
    <CardHeader class="pb-4">
      <CardTitle class="text-xl font-bold tracking-tight">Task Categories Performance</CardTitle>
    </CardHeader>
    <CardContent class="space-y-6">
      <div v-for="cat in categories" :key="cat.name" class="space-y-3">
        <div class="flex items-center justify-between text-sm">
          <span class="font-medium text-foreground">{{ cat.name }}</span>
          <span class="text-muted-foreground font-medium">{{ cat.completed }}/{{ cat.total }} completed</span>
        </div>
        <Progress :model-value="getPercentage(cat.completed, cat.total)" class="h-2 bg-secondary/50" />
      </div>
    </CardContent>
  </Card>
</template>
