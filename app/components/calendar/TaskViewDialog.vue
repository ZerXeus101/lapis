<script setup lang="ts">
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, BookOpen, FileText, CheckCircle2, Circle } from 'lucide-vue-next'

const props = defineProps<{
  open: boolean
  task: any
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
}>()

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-US', { 
    weekday: 'long',
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  })
}

const getCategoryIcon = (category: string) => {
  switch (category?.toLowerCase()) {
    case 'assignment': return FileText
    case 'exam': return BookOpen
    case 'project': return Calendar
    default: return FileText
  }
}
</script>

<template>
  <Dialog :open="open" @update:open="(val) => emit('update:open', val)">
    <DialogContent class="sm:max-w-[425px] bg-card border-border text-foreground">
      <DialogHeader v-if="task">
        <div class="flex items-center gap-2 mb-2">
          <Badge :variant="task.status === 'completed' ? 'secondary' : 'default'" class="capitalize">
            {{ task.status }}
          </Badge>
          <Badge variant="outline" class="capitalize">
            {{ task.category }}
          </Badge>
        </div>
        <DialogTitle class="text-2xl font-bold tracking-tight">
          {{ task.task_name }}
        </DialogTitle>
        <DialogDescription class="text-muted-foreground">
          {{ task.subject }}
        </DialogDescription>
      </DialogHeader>

      <div v-if="task" class="grid gap-6 py-4">
        <div class="flex items-center gap-3 text-sm">
          <div class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <Calendar class="w-4 h-4" />
          </div>
          <div>
            <p class="font-semibold">Due Date</p>
            <p class="text-muted-foreground">{{ formatDate(task.due_date) }}</p>
          </div>
        </div>

        <div v-if="task.description" class="space-y-2">
          <p class="text-sm font-semibold flex items-center gap-2">
            <FileText class="w-4 h-4 text-muted-foreground" />
            Description
          </p>
          <div class="p-3 rounded-lg bg-muted/50 text-sm text-foreground border border-border">
            {{ task.description }}
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" @click="emit('update:open', false)" class="w-full sm:w-auto">
          Close
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
