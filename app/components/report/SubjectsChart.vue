<script setup lang="ts">
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-vue-next'
import { Progress } from '~/components/ui/progress'
import { Button } from '~/components/ui/button'

interface TasksBySubject {
  subject: string
  completed_tasks: number
  total_tasks: number
}

const props = defineProps<{
  tasks_by_subject: TasksBySubject[]
}>()

const isExpanded = ref(false)

const sortedSubjects = computed(() => {
  return [...props.tasks_by_subject].sort((a, b) => {
    const rateA = a.completed_tasks / (a.total_tasks || 1)
    const rateB = b.completed_tasks / (b.total_tasks || 1)
    return rateB - rateA
  })
})

const displaySubjects = computed(() => {
  return isExpanded.value ? sortedSubjects.value : sortedSubjects.value.slice(0, 4)
})

const getPercentage = (completed: number, total: number) => {
  if (!total) return 0
  return Math.round((completed / total) * 100)
}
</script>

<template>
  <div class="space-y-6">
    <div v-if="tasks_by_subject.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div 
        v-for="tbs in displaySubjects" 
        :key="tbs.subject" 
        class="p-5 rounded-3xl bg-primary/5 border border-primary/10 hover:border-primary/20 transition-all duration-300 group"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <div class="p-2.5 rounded-xl bg-background shadow-sm text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
              <BookOpen class="h-4 w-4" />
            </div>
            <div>
              <h4 class="text-sm font-black tracking-tight text-foreground">{{ tbs.subject }}</h4>
              <p class="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-wider">{{ tbs.total_tasks }} Tasks</p>
            </div>
          </div>
          <div class="text-right">
            <span class="text-lg font-black text-primary">{{ getPercentage(tbs.completed_tasks, tbs.total_tasks) }}%</span>
          </div>
        </div>
        
        <div class="space-y-2">
          <div class="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
            <span>Progress</span>
            <span>{{ tbs.completed_tasks }}/{{ tbs.total_tasks }} Done</span>
          </div>
          <Progress 
            :model-value="getPercentage(tbs.completed_tasks, tbs.total_tasks)" 
            class="h-2 bg-background overflow-hidden rounded-full shadow-inner"
          />
        </div>
      </div>
    </div>

    <div v-else class="h-40 flex flex-col items-center justify-center text-muted-foreground gap-3 animate-in fade-in zoom-in duration-500">
      <div class="p-4 rounded-full bg-primary/5">
        <BookOpen class="h-6 w-6 text-primary/40" />
      </div>
      <p class="text-sm font-bold uppercase tracking-widest text-muted-foreground/40">No subjects tracked yet</p>
    </div>

    <div v-if="tasks_by_subject.length > 4" class="flex justify-center pt-2">
      <Button 
        variant="ghost" 
        size="sm"
        class="text-primary hover:text-primary hover:bg-primary/5 font-black text-[10px] tracking-[0.2em] uppercase transition-all duration-300 gap-2 px-6 h-10 rounded-xl border border-primary/10"
        @click="isExpanded = !isExpanded"
      >
        <component :is="isExpanded ? ChevronUp : ChevronDown" class="h-3 w-3" />
        {{ isExpanded ? 'Show Less' : `View All (${tasks_by_subject.length})` }}
      </Button>
    </div>
  </div>
</template>
