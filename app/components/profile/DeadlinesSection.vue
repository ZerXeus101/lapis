<script setup lang="ts">
import { AlertCircle, Clock, BookOpen, FileText } from 'lucide-vue-next'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

interface Deadline {
  title: string
  due: string
  category: string
}

const props = defineProps<{
  deadlines: Deadline[]
}>()

const getIcon = (category: string) => {
  switch (category?.toLowerCase()) {
    case 'assignments': return FileText
    case 'exams': return AlertCircle
    case 'projects': return Clock
    case 'reading': return BookOpen
    default: return FileText
  }
}

const getIconColor = (category: string) => {
  switch (category?.toLowerCase()) {
    case 'exams': return 'text-destructive'
    case 'projects': return 'text-amber-500'
    default: return 'text-primary'
  }
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  })
}
</script>

<template>
  <Card class="border-border shadow-sm overflow-hidden">
    <CardHeader class="pb-4">
      <CardTitle class="text-xl font-bold tracking-tight">Upcoming Deadlines</CardTitle>
    </CardHeader>
    <CardContent class="p-0">
      <div v-if="deadlines.length > 0">
        <div v-for="deadline in deadlines" :key="deadline.title" 
             class="flex items-center p-4 hover:bg-muted/50 transition-colors border-t border-border first:border-0 group">
          <div :class="['p-2 rounded-lg bg-muted group-hover:bg-card transition-colors mr-4', getIconColor(deadline.category)]">
            <component :is="getIcon(deadline.category)" class="w-5 h-5" />
          </div>
          <div class="flex-1">
            <h4 class="text-base font-semibold text-foreground tracking-tight">{{ deadline.title }}</h4>
            <p class="text-sm text-muted-foreground">Due: {{ formatDate(deadline.due) }}</p>
          </div>
        </div>
      </div>
      <div v-else class="p-8 text-center text-muted-foreground">
        <p class="text-sm">No upcoming deadlines</p>
      </div>
    </CardContent>
  </Card>
</template>
