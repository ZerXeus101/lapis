<script setup lang="ts">
import { History } from 'lucide-vue-next'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

defineProps<{
  completionRate: number
  completedCount: number
  remainingCount: number
}>()
</script>

<template>
  <Card class="border-border bg-card rounded-xl shadow-none text-foreground">
    <CardHeader class="p-4 pb-2">
      <CardTitle class="text-lg font-semibold flex items-center gap-2">
        <History class="w-4.5 h-4.5" />
        This Week
      </CardTitle>
    </CardHeader>
    <CardContent class="p-4 pt-2 space-y-4">
      <div class="space-y-2.5">
        <div class="flex justify-between items-center text-sm">
          <span class="text-muted-foreground">Completion Rate</span>
          <span class="text-foreground font-semibold">{{ completionRate }}%</span>
        </div>
        <Progress :model-value="completionRate" class="h-2.5 bg-muted" />
      </div>
      
      <div class="border-t border-border pt-4 space-y-3">
        <div class="flex justify-between items-center text-sm">
          <span class="text-muted-foreground">Completed</span>
          <span class="text-foreground font-semibold">{{ completedCount }} tasks</span>
        </div>
        <div class="flex justify-between items-center text-sm">
          <span class="text-muted-foreground">Remaining</span>
          <span class="text-foreground font-semibold">{{ remainingCount }} tasks</span>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
