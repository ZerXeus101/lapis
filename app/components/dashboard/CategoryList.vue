<script setup lang="ts">
import { type Component } from 'vue'
import { LayoutList } from 'lucide-vue-next'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export interface Category {
  name: string
  count: number
  icon: Component
}

defineProps<{
  categories: Category[]
}>()
</script>

<template>
  <Card class="border-border bg-card rounded-xl shadow-none text-foreground">
    <CardHeader class="p-4 pb-2">
      <CardTitle class="text-lg font-semibold flex items-center gap-2">
        <LayoutList class="w-4.5 h-4.5" />
        Categories
      </CardTitle>
    </CardHeader>
    <CardContent class="p-4 pt-0 space-y-1">
      <Button v-for="cat in categories" :key="cat.name" variant="ghost" class="w-full justify-between hover:bg-accent hover:text-accent-foreground rounded-lg px-2 text-muted-foreground font-normal h-11 transition-colors">
        <div class="flex items-center gap-3">
          <component :is="cat.icon" class="w-4 h-4" />
          <span class="text-sm">{{ cat.name }}</span>
        </div>
        <span class="text-xs font-semibold text-foreground">{{ cat.count }}</span>
      </Button>
    </CardContent>
  </Card>
</template>
