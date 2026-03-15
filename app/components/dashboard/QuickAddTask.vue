<script setup lang="ts">
import { ref, computed } from 'vue'
import { Plus, Calendar as CalendarIcon } from 'lucide-vue-next'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export interface NewTask {
  title: string
  category: string
  dueDate: string
  subject: string
}

const emit = defineEmits<{
  (e: 'add', task: NewTask): void
}>()

const newTask = ref<NewTask>({
  title: '',
  category: 'Assignment',
  dueDate: '',
  subject: ''
})

// Validation
const isValid = computed(() => {
  return (
    newTask.value.title.trim().length > 0 &&
    newTask.value.category.trim().length > 0 &&
    newTask.value.dueDate !== '' &&
    newTask.value.subject.trim().length > 0
  )
})

const handleAdd = () => {
  if (!isValid.value) return
  emit('add', { ...newTask.value })
  // Reset
  newTask.value = { title: '', category: 'Assignment', dueDate: '', subject: '' }
}
</script>

<template>
  <Card class="border-border bg-card rounded-xl shadow-none">
    <CardHeader class="p-4 pb-2 text-foreground">
      <CardTitle class="text-lg font-semibold flex items-center gap-2 text-foreground">
        <div class="w-7 h-7 bg-primary/10 rounded flex items-center justify-center">
          <Plus class="w-4 h-4 text-primary" />
        </div>
        Quick Add
      </CardTitle>
    </CardHeader>
    <CardContent class="p-4 pt-2 space-y-4">
      <div class="space-y-1.5 group">
        <Label for="task-title" class="text-xs font-bold uppercase tracking-wider text-muted-foreground group-focus-within:text-primary transition-colors">
          Task Title <span class="text-destructive">*</span>
        </Label>
        <Input id="task-title" v-model="newTask.title" placeholder="Enter task name" class="bg-background border-input rounded-lg h-11 focus-visible:ring-1 focus-visible:ring-primary text-foreground" />
      </div>
      
      <div class="space-y-1.5 group">
        <Label for="category" class="text-xs font-bold uppercase tracking-wider text-muted-foreground group-focus-within:text-primary transition-colors">
          Category <span class="text-destructive">*</span>
        </Label>
        <Select v-model="newTask.category">
          <SelectTrigger class="bg-background border-input rounded-lg h-11 focus:ring-1 focus:ring-primary text-foreground">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent class="bg-card border-border">
            <SelectItem value="Assignment">Assignment</SelectItem>
            <SelectItem value="Exam">Exam</SelectItem>
            <SelectItem value="Project">Project</SelectItem>
            <SelectItem value="Reading">Reading</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div class="grid grid-cols-1 gap-4">
        <div class="space-y-1.5 group">
          <Label for="due-date" class="text-xs font-bold uppercase tracking-wider text-muted-foreground group-focus-within:text-primary transition-colors">
            Due Date <span class="text-destructive">*</span>
          </Label>
          <div class="relative">
            <Input id="due-date" type="date" v-model="newTask.dueDate" class="bg-background border-input rounded-lg h-11 pr-10 focus-visible:ring-1 focus-visible:ring-primary text-foreground appearance-none" />
            <CalendarIcon class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none group-focus-within:text-primary transition-colors" />
          </div>
        </div>

        <div class="space-y-1.5 group">
          <Label for="subject" class="text-xs font-bold uppercase tracking-wider text-muted-foreground group-focus-within:text-primary transition-colors">
            Subject <span class="text-destructive">*</span>
          </Label>
          <Input id="subject" v-model="newTask.subject" placeholder="e.g. Mathematics" class="bg-background border-input rounded-lg h-11 focus-visible:ring-1 focus-visible:ring-primary text-foreground" />
        </div>
      </div>

      <Button 
        @click="handleAdd" 
        :disabled="!isValid"
        class="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 rounded-lg text-base font-bold shadow-md shadow-primary/10 transition-all active:scale-95 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed mt-2"
      >
        Save Task
      </Button>
    </CardContent>
  </Card>
</template>

<style scoped>
/* Remove default browser icons for a cleaner look */
input[type="date"]::-webkit-calendar-picker-indicator {
    background: transparent;
    bottom: 0;
    color: transparent;
    cursor: pointer;
    height: auto;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    width: auto;
}
</style>
