<script setup lang="ts">
import { computed } from 'vue'
import { Calendar, Clock, BookOpen, AlertCircle, CheckCircle2, History, Pencil, Check } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { cn, formatDateTime } from '@/lib/utils'

export interface Task {
  id: number | string
  title: string
  category: string
  description?: string
  dueDate: string
  dueTime?: string
  subject: string
  completed: boolean
  overdue: boolean
}

const props = defineProps<{
  task: Task
}>()

const emit = defineEmits<{
  (e: 'update:completed', id: number | string, value: boolean): void
  (e: 'edit', task: Task): void
}>()

const onCheckedChange = (checked: boolean) => {
  emit('update:completed', props.task.id, checked)
}

const onEditClick = (e: Event) => {
  e.stopPropagation()
  emit('edit', props.task)
}

// Due Today logic (Fallback to frontend check for today)
const isDueToday = computed(() => {
  if (props.task.completed || props.task.overdue) return false
  const today = new Date().toLocaleDateString('en-CA') // YYYY-MM-DD local
  return props.task.dueDate === today
})

// Visual priority logic
const cardStyles = computed(() => {
  if (props.task.completed) return 'opacity-40 grayscale-[0.6] border-border shadow-none'
  if (props.task.overdue) return 'border-destructive/40 bg-destructive/[0.03] shadow-[0_0_15px_rgba(239,68,68,0.08)] ring-1 ring-destructive/10'
  if (isDueToday.value) return 'border-amber-500/40 bg-amber-500/[0.03] shadow-[0_0_15px_rgba(245,158,11,0.08)] ring-1 ring-amber-500/10'
  return 'border-border hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 active:scale-[0.99] bg-card'
})

const dateTextStyles = computed(() => {
  if (props.task.completed) return 'text-muted-foreground'
  if (props.task.overdue) return 'text-destructive font-bold'
  if (isDueToday.value) return 'text-amber-600 dark:text-amber-400 font-bold'
  return 'text-muted-foreground'
})
</script>

<template>
  <div :class="cn(
    'relative border rounded-xl p-4 flex gap-4 transition-all duration-500 overflow-hidden group',
    cardStyles
  )">
    <!-- Urgency indicator strip for overdue/today tasks -->
    <div v-if="!task.completed" :class="cn(
      'absolute left-0 top-0 bottom-0 w-1 transition-all duration-500',
      task.overdue ? 'bg-destructive' : (isDueToday ? 'bg-amber-500' : 'bg-transparent')
    )"></div>

    <Checkbox 
      :model-value="task.completed" 
      class="w-10 h-10 border-2 border-input rounded-md data-[state=checked]:bg-primary data-[state=checked]:border-primary mt-0.5 shrink-0 transition-all cursor-pointer z-10"
      @update:model-value="onCheckedChange"
      @click.stop
    >
      <Check class="w-6 h-6" />
    </Checkbox>
    
    <div class="flex-1 min-w-0 space-y-3 z-10">
      <div class="space-y-1">
        <div class="flex items-start justify-between gap-2">
          <div class="flex items-center gap-2 min-w-0">
            <h3 :class="cn(
              'font-bold text-base tracking-tight truncate transition-all duration-300',
              task.completed ? 'line-through text-muted-foreground' : 'text-foreground',
              !task.completed && task.overdue ? 'text-destructive' : ''
            )">
              {{ task.title }}
            </h3>
            <button 
              v-if="!task.completed"
              @click="onEditClick"
              class="p-1 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-all md:opacity-0 group-hover:opacity-100 focus:opacity-100 shrink-0"
              title="Edit task"
            >
              <Pencil class="w-3.5 h-3.5" />
            </button>
          </div>
          
          <!-- Urgent Icons -->
          <div v-if="!task.completed" class="shrink-0 flex gap-1">
            <AlertCircle v-if="task.overdue" class="w-4 h-4 text-destructive animate-pulse" />
            <History v-else-if="isDueToday" class="w-4 h-4 text-amber-500" />
          </div>
          <CheckCircle2 v-else class="w-4 h-4 text-primary shrink-0 opacity-60" />
        </div>

        <div class="flex items-center gap-2 mt-1">
          <Badge 
            :variant="task.completed ? 'secondary' : (task.overdue ? 'destructive' : 'secondary')" 
            :class="cn(
              'rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider h-5 border-none',
              isDueToday && !task.completed ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' : ''
            )"
          >
            {{ task.category }}
          </Badge>
          
          <Badge v-if="!task.completed && task.overdue" variant="destructive" class="rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.15em] h-5 animate-pulse shadow-sm shadow-destructive/20 border-none">
            OVERDUE
          </Badge>

          <Badge v-if="isDueToday" class="rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.15em] h-5 bg-amber-500 text-white dark:text-amber-950 border-none shadow-sm shadow-amber-500/20">
            TODAY
          </Badge>
        </div>
      </div>
      
      <p v-if="task.description" :class="cn(
        'text-sm font-normal leading-relaxed transition-all line-clamp-2',
        task.completed ? 'line-through text-muted-foreground/70' : 'text-muted-foreground/90'
      )">
        {{ task.description }}
      </p>

      <div :class="cn(
        'flex flex-wrap items-center gap-x-4 gap-y-2 pt-2 border-t transition-colors duration-500',
        task.completed ? 'border-border/30' : (task.overdue ? 'border-destructive/20' : (isDueToday ? 'border-amber-500/20' : 'border-border/50'))
      )">
        <div :class="cn(
          'flex items-center gap-1.5 text-[11px] transition-colors duration-300 uppercase tracking-wide',
          dateTextStyles
        )">
          <Clock v-if="(task.overdue || isDueToday) && !task.completed" class="w-3.5 h-3.5" />
          <Calendar v-else class="w-3.5 h-3.5" />
          <span>
            {{ task.completed ? 'Finished: ' : (task.overdue ? 'Lapsed: ' : (isDueToday ? 'Due Today: ' : 'Due: ')) }}
            {{ formatDateTime(task.dueDate, task.dueTime) }}
          </span>
        </div>
        <div class="flex items-center gap-1.5 text-[11px] text-muted-foreground/70 font-bold uppercase tracking-wide">
          <BookOpen class="w-3.5 h-3.5" />
          <span>{{ task.subject }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;  
  overflow: hidden;
}
</style>
