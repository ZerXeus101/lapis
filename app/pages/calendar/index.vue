<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  Calendar as CalendarIcon
} from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import TaskDialog from '@/components/dashboard/TaskDialog.vue'
import TaskViewDialog from '@/components/calendar/TaskViewDialog.vue'
import { toast } from 'vue-sonner'
import type { Database } from '@/types/database.types'
import { cn } from '@/lib/utils'

definePageMeta({
  layout: 'dashboard'
})

const supabase = useSupabaseClient<Database>()
const { user } = useAuth()

// State
const currentDate = ref(new Date())
const loading = ref(true)
const tasks = ref<any[]>([])
const isTaskDialogOpen = ref(false)
const isViewDialogOpen = ref(false)
const selectedDateForTask = ref('')
const selectedTask = ref<any>(null)

// Calendar Logic
const daysInMonth = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  return new Date(year, month + 1, 0).getDate()
})

const firstDayOfMonth = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  return new Date(year, month, 1).getDay()
})

const monthName = computed(() => {
  return currentDate.value.toLocaleString('default', { month: 'long' })
})

const year = computed(() => currentDate.value.getFullYear())

const prevMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
  fetchTasks()
}

const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
  fetchTasks()
}

const fetchTasks = async () => {
  if (!user.value) return
  loading.value = true
  try {
    const firstDay = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), 1).toISOString().split('T')[0] || ''
    const lastDay = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 0).toISOString().split('T')[0] || ''

    console.log(`Fetching calendar tasks from ${firstDay} to ${lastDay}`)
    
    const { data, error } = await supabase.rpc('get_calendar_tasks', {
      p_start_date: firstDay,
      p_end_date: lastDay
    })

    if (error) throw error
    
    tasks.value = (data as any) || []
    console.log('Calendar tasks received:', tasks.value.length)
  } catch (error: any) {
    console.error('Error fetching tasks:', error.message)
    toast.error('Failed to load calendar tasks')
  } finally {
    loading.value = false
  }
}

const getTasksForDay = (day: number) => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  // Create date in local timezone format YYYY-MM-DD
  const date = new Date(year, month, day)
  const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  return tasks.value.filter(t => t.due_date === dateStr)
}

const openAddTask = (day?: number) => {
  if (day) {
    const d = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), day)
    // Adjust for timezone offset to get correct local date string
    const offset = d.getTimezoneOffset()
    const localDate = new Date(d.getTime() - (offset * 60 * 1000))
    selectedDateForTask.value = localDate.toISOString().split('T')[0] || ''
  } else {
    selectedDateForTask.value = ''
  }
  isTaskDialogOpen.value = true
}

const viewTask = (task: any) => {
  selectedTask.value = task
  isViewDialogOpen.value = true
}

const handleAddTask = async (newTask: any) => {
  try {
    const { error } = await supabase.rpc('create_task', {
      p_task_name: newTask.title,
      p_category: newTask.category,
      p_due_date: newTask.dueDate,
      p_due_time: newTask.dueTime || '23:59:59',
      p_subject: newTask.subject || 'General',
      p_description: newTask.description || null
    })

    if (error) throw error
    toast.success('Task created successfully')
    fetchTasks()
  } catch (error: any) {
    toast.error('Error: ' + error.message)
  }
}

onMounted(() => {
  fetchTasks()
})

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const getCategoryColor = (category: string, isCompleted: boolean) => {
  if (isCompleted) return 'bg-muted text-muted-foreground border-border line-through opacity-70'
  
  switch (category?.toLowerCase()) {
    case 'assignment': return 'bg-blue-500/10 text-blue-600 border-blue-200'
    case 'exam': return 'bg-destructive/10 text-destructive border-destructive/20'
    case 'project': return 'bg-amber-500/10 text-amber-600 border-amber-200'
    case 'reading': return 'bg-emerald-500/10 text-emerald-600 border-emerald-200'
    default: return 'bg-primary/10 text-primary border-primary/20'
  }
}
</script>

<template>
  <main class="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full flex flex-col gap-6">
    <!-- Header -->
    <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
          <CalendarIcon class="w-6 h-6" />
        </div>
        <div>
          <h1 class="text-2xl font-bold tracking-tight text-foreground">{{ monthName }} {{ year }}</h1>
          <p class="text-sm text-muted-foreground">Manage your deadlines visually</p>
        </div>
      </div>
      
      <div class="flex items-center gap-2">
        <div class="flex items-center bg-card border border-border rounded-lg p-1">
          <Button variant="ghost" size="icon" @click="prevMonth" class="h-8 w-8">
            <ChevronLeft class="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" @click="currentDate = new Date()" class="px-3 text-xs font-medium">
            Today
          </Button>
          <Button variant="ghost" size="icon" @click="nextMonth" class="h-8 w-8">
            <ChevronRight class="w-4 h-4" />
          </Button>
        </div>
        <Button @click="openAddTask()" class="shadow-lg shadow-primary/20">
          <Plus class="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>
    </header>

    <!-- Calendar Grid -->
    <Card class="border-border shadow-sm flex-1 overflow-hidden">
      <CardContent class="p-0 h-full flex flex-col">
        <!-- Weekdays header -->
        <div class="grid grid-cols-7 border-b border-border bg-muted/30">
          <div v-for="day in weekDays" :key="day" class="p-3 text-center text-xs font-bold text-muted-foreground uppercase tracking-wider">
            {{ day }}
          </div>
        </div>

        <!-- Days grid -->
        <div class="grid grid-cols-7 flex-1 auto-rows-fr min-h-150">
          <!-- Padding for first week -->
          <div v-for="n in firstDayOfMonth" :key="'pad-'+n" class="bg-muted/5 border-r border-b border-border last:border-r-0"></div>
          
          <!-- Actual days -->
          <div 
            v-for="day in daysInMonth" 
            :key="day" 
            @click="openAddTask(day)"
            class="group p-2 border-r border-b border-border last:border-r-0 hover:bg-accent/30 transition-colors cursor-pointer flex flex-col gap-1 min-h-25"
          >
            <span :class="cn(
              'text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-full transition-colors',
              new Date().toDateString() === new Date(year, currentDate.getMonth(), day).toDateString() 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground group-hover:text-foreground'
            )">
              {{ day }}
            </span>

            <div class="flex flex-col gap-1 overflow-hidden">
              <div 
                v-for="task in getTasksForDay(day).slice(0, 4)" 
                :key="task.id"
                @click.stop="viewTask(task)"
                class="px-2 py-0.5 text-[10px] font-medium rounded border truncate flex items-center gap-1 hover:brightness-95 transition-all active:scale-[0.98]"
                :class="getCategoryColor(task.category, task.status === 'completed')"
              >
                <div v-if="task.status === 'completed'" class="shrink-0 w-1.5 h-1.5 rounded-full bg-muted-foreground/50"></div>
                {{ task.task_name }}
              </div>
              <div v-if="getTasksForDay(day).length > 4" class="text-[10px] text-muted-foreground pl-1 font-medium">
                + {{ getTasksForDay(day).length - 4 }} more
              </div>
            </div>
          </div>

          <!-- Padding for last week -->
          <div 
            v-for="n in (42 - (daysInMonth + firstDayOfMonth)) % 7" 
            :key="'pad-end-'+n" 
            class="bg-muted/5 border-r border-b border-border last:border-r-0"
          ></div>
        </div>
      </CardContent>
    </Card>

    <TaskDialog 
      v-model:open="isTaskDialogOpen" 
      :initial-date="selectedDateForTask"
      @add="handleAddTask" 
    />

    <TaskViewDialog
      v-model:open="isViewDialogOpen"
      :task="selectedTask"
    />
  </main>
</template>

<style scoped>
.auto-rows-fr {
  grid-auto-rows: 1fr;
}
</style>
