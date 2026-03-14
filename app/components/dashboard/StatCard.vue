<script setup lang="ts">
import { type Component } from 'vue'
import { Card, CardContent } from '@/components/ui/card'

defineProps<{
  label: string
  value: number | string
  icon: Component
}>()
</script>

<template>
  <Card class="border-border bg-card rounded-xl shadow-none">
    <CardContent class="p-4 flex flex-col gap-1">
      <div class="flex items-center justify-between">
        <span class="text-xs text-muted-foreground font-medium">{{ label }}</span>
        <component :is="icon" class="w-4 h-4 text-muted-foreground" />
      </div>
      <span class="text-2xl font-bold text-foreground tracking-tight">{{ value }}</span>
    </CardContent>
  </Card>
</template>
