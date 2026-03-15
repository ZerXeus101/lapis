<script setup lang="ts">
import { ref, computed } from 'vue'
import { Plus, Calendar as CalendarIcon, Clock } from 'lucide-vue-next'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'add', task: any): void
}>()

const newTask = ref({
  title: '',
  category: 'Assignment',
  dueDate: '',
  dueTime: '',
  subject: '',
  description: ''
})

// Validation Logic
const isValid = computed(() => {
  return (
    newTask.value.title.trim().length > 0 &&
    newTask.value.category.trim().length > 0 &&
    newTask.value.subject.trim().length > 0 &&
    newTask.value.dueDate !== ''
  )
})

const handleAdd = () => {
  if (!isValid.value) return
  
  emit('add', { ...newTask.value, dueTime: newTask.value.dueTime || '23:59:59' })
  
  // Reset form
  newTask.value = {
    title: '',
    category: 'Assignment',
    dueDate: '',
    dueTime: '',
    subject: '',
    description: ''
  }
  emit('update:open', false)
}
</script>

<template>
  <Dialog :open="open" @update:open="(val) => emit('update:open', val)">
    <DialogContent class="sm:max-w-[425px] bg-card border-border text-foreground">
      <DialogHeader>
        <DialogTitle class="text-xl font-bold flex items-center gap-2">
          <div class="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <Plus class="w-5 h-5 text-primary" />
          </div>
          Create New Task
        </DialogTitle>
        <DialogDescription class="text-muted-foreground text-sm">
          Required: Title, Category, Subject, and Due Date.
        </DialogDescription>
      </DialogHeader>
      
      <div class="grid gap-4 py-4">
        <!-- Task Title -->
        <div class="grid gap-2">
          <Label for="modal-title" class="text-sm font-semibold">
            Task Title <span class="text-destructive">*</span>
          </Label>
          <Input id="modal-title" v-model="newTask.title" placeholder="e.g., Study for Midterms" class="bg-background border-input focus-visible:ring-primary h-11" />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <!-- Category -->
          <div class="grid gap-2">
            <Label for="modal-category" class="text-sm font-semibold">
              Category <span class="text-destructive">*</span>
            </Label>
            <Select v-model="newTask.category">
              <SelectTrigger id="modal-category" class="bg-background border-input h-11">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent class="bg-card border-border">
                <SelectItem value="Assignment">Assignment</SelectItem>
                <SelectItem value="Exam">Exam</SelectItem>
                <SelectItem value="Project">Project</SelectItem>
                <SelectItem value="Reading">Reading</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <!-- Subject -->
          <div class="grid gap-2">
            <Label for="modal-subject" class="text-sm font-semibold">
              Subject <span class="text-destructive">*</span>
            </Label>
            <Input id="modal-subject" v-model="newTask.subject" placeholder="e.g., CS101" class="bg-background border-input focus-visible:ring-primary h-11" />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <!-- Due Date -->
          <div class="grid gap-2">
            <Label for="modal-date" class="text-sm font-semibold">
              Due Date <span class="text-destructive">*</span>
            </Label>
            <div class="relative group">
              <Input id="modal-date" type="date" v-model="newTask.dueDate" class="bg-background border-input focus-visible:ring-primary pr-10 h-11 appearance-none" />
              <CalendarIcon class="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none group-focus-within:text-primary transition-colors" />
            </div>
          </div>
          <!-- Due Time -->
          <div class="grid gap-2">
            <Label for="modal-time" class="text-sm font-medium text-muted-foreground">Due Time (Optional)</Label>
            <div class="relative group">
              <Input id="modal-time" type="time" v-model="newTask.dueTime" class="bg-background border-input focus-visible:ring-primary pr-10 h-11 appearance-none" />
              <Clock class="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none group-focus-within:text-primary transition-colors" />
            </div>
          </div>
        </div>

        <!-- Description -->
        <div class="grid gap-2">
          <Label for="modal-desc" class="text-sm font-medium text-muted-foreground">Description (Optional)</Label>
          <Textarea id="modal-desc" v-model="newTask.description" placeholder="Add some notes..." class="bg-background border-input focus-visible:ring-primary min-h-[100px] resize-none" />
        </div>
      </div>

      <DialogFooter class="gap-2 sm:gap-0">
        <Button variant="ghost" @click="emit('update:open', false)" class="text-muted-foreground hover:text-foreground">Cancel</Button>
        <Button 
          @click="handleAdd" 
          :disabled="!isValid"
          class="bg-primary hover:bg-primary/90 text-primary-foreground px-6 shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
        >
          Save Task
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<style scoped>
input[type="date"]::-webkit-calendar-picker-indicator,
input[type="time"]::-webkit-calendar-picker-indicator {
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
