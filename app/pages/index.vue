<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { 
  Plus, 
  FileText, 
  Wand2, 
  LayoutList, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  BookOpen,
} from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import type { Database } from '@/types/database.types'
import { toast } from 'vue-sonner'

// Dashboard components
import StatCard from '@/components/dashboard/StatCard.vue'
import TaskCard, { type Task } from '@/components/dashboard/TaskCard.vue'
import QuickAddTask, { type NewTask } from '@/components/dashboard/QuickAddTask.vue'
import CategoryList from '@/components/dashboard/CategoryList.vue'
import WeeklyProgress from '@/components/dashboard/WeeklyProgress.vue'
import TaskDialog from '@/components/dashboard/TaskDialog.vue'

definePageMeta({
  layout: 'dashboard'
})

const { user } = useAuth()
const supabase = useSupabaseClient<Database>()

// Dashboard Data Interface
interface DashboardData {
  stats: { label: string; value: number }[]
  tasks: Task[]
  categories: { name: string; count: number }[]
  weeklyProgress: {
    completionRate: number
    completedCount: number
    remainingCount: number
  }
}

// State
const loading = ref(true)
const dashboardData = ref<DashboardData | null>(null)
const tasks = ref<Task[]>([])
const activeTab = ref('all')
const isTaskDialogOpen = ref(false)
const hideCompleted = ref(false)

// Icon Mapping
const iconMap: Record<string, any> = {
  'Total Tasks': LayoutList,
  'Completed': CheckCircle2,
  'Pending': Clock,
  'Overdue': AlertTriangle,
}

const fetchDashboard = async () => {
  if (!user.value) return
  try {
    const offset = new Date().getTimezoneOffset()
    const { data, error } = await supabase.rpc('get_dashboard_data', { p_timezone_offset: offset })
    
    if (error) {
      // If session is expired, kick to login
      if (error.message?.includes('JWT expired')) {
        const { logout } = useAuth()
        await logout()
        toast.error('Your session has expired. Please log in again.')
        return
      }
      throw error
    }

    const typedData = data as unknown as DashboardData
    dashboardData.value = typedData
    tasks.value = typedData.tasks || []
  } catch (error: any) {
    console.error('Error fetching dashboard data:', error.message)
    toast.error('Failed to load dashboard data')
  } finally {
    loading.value = false
  }
}

const handleAddTask = async (newTask: any) => {
  const addTaskPromise = async () => {
    const { data, error } = await supabase.rpc('create_task', {
      p_task_name: newTask.title,
      p_category: newTask.category,
      p_due_date: newTask.dueDate,
      p_due_time: newTask.dueTime || '00:00:00',
      p_subject: newTask.subject || 'General',
      p_description: newTask.description || null
    })

    if (error) throw error
    return data
  }

  toast.promise(addTaskPromise(), {
    loading: 'Creating task...',
    success: () => {
      fetchDashboard()
      return 'Task created successfully!'
    },
    error: (err: any) => `Error: ${err.message || 'Could not create task'}`
  })
}

const toggleTaskCompletion = async (id: number | string, completed: boolean) => {
  // Store the original state in case we need to revert
  const originalTasks = [...tasks.value]
  
  // Optimistic Update: Update the UI immediately
  tasks.value = tasks.value.map(task => 
    task.id === id ? { ...task, completed } : task
  )

  const togglePromise = async () => {
    const { data, error } = await supabase.rpc('toggle_task_status', {
      p_task_id: Number(id),
      p_completed: completed
    })

    if (error) throw error
    const result = data as any
    if (result.error) throw new Error(result.error)
    
    return result
  }

  toast.promise(togglePromise(), {
    loading: completed ? 'Completing task...' : 'Reopening task...',
    success: () => {
      // Background refresh to ensure stats (StatCard, etc.) are also updated
      fetchDashboard()
      return completed ? 'Task marked as completed' : 'Task reopened'
    },
    error: (err: any) => {
      // Revert if the DB update fails
      tasks.value = originalTasks
      return `Failed: ${err.message || 'Could not update task'}`
    }
  })
}

watch(user, (newUser) => {
  if (newUser) fetchDashboard()
}, { immediate: true })

onMounted(() => { if (user.value) fetchDashboard() })

const stats = computed(() => {
  if (!dashboardData.value?.stats) return []
  return dashboardData.value.stats.map((s) => ({ ...s, icon: iconMap[s.label] || LayoutList }))
})

const categories = computed(() => {
  if (!dashboardData.value?.categories) return []
  // Standard categories always show up, others fall back to FileText
  const catIconMap: Record<string, any> = {
    'Assignments': FileText,
    'Exams': Clock,
    'Projects': AlertTriangle,
    'Reading': BookOpen
  }
  return dashboardData.value.categories.map((c) => ({ ...c, icon: catIconMap[c.name] || FileText }))
})

const weeklyData = computed(() => {
  return dashboardData.value?.weeklyProgress || { completionRate: 0, completedCount: 0, remainingCount: 0 }
})

const filteredTasks = computed(() => {
  let result = tasks.value

  // Filter by category (Tab)
  if (activeTab.value !== 'all') {
    result = result.filter(task => {
      const taskCat = task.category?.toLowerCase() || ''
      const tabCat = activeTab.value.slice(0, -1).toLowerCase() 
      return taskCat === tabCat
    })
  }

  // Filter by completion status
  if (hideCompleted.value) {
    result = result.filter(task => !task.completed)
  }

  return result
})
</script>

<template>
  <main v-if="!loading && user" class="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-6 pb-24 md:pb-6">
    <!-- Left Column -->
    <div class="md:col-span-8 space-y-6">
      <section class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard v-for="stat in stats" :key="stat.label" v-bind="stat" />
      </section>

      <section class="bg-card border border-border rounded-xl p-4 grid grid-cols-1 gap-3 shadow-sm">
        <Button @click="isTaskDialogOpen = true" class="bg-primary hover:bg-primary/90 text-primary-foreground h-12 rounded-lg text-base font-medium transition-colors shadow-md shadow-primary/20">
          <Plus class="w-4 h-4 mr-2" />
          Add New Task
        </Button>
        <div class="grid grid-cols-2 gap-3">
          <Button variant="outline" class="border-input hover:bg-accent hover:text-accent-foreground h-12 rounded-lg text-base font-normal">
            <FileText class="w-4 h-4 mr-2" />
            View Report
          </Button>
          <Button variant="outline" class="border-input hover:bg-accent hover:text-accent-foreground h-12 rounded-lg text-base font-normal">
            <Wand2 class="w-4 h-4 mr-2" />
            Summarize
          </Button>
        </div>
      </section>

      <section class="space-y-4">
        <div class="flex items-center justify-between">
          <Tabs v-model="activeTab" class="w-full">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border mb-4">
              <TabsList class="justify-start bg-transparent h-auto p-0 rounded-none overflow-x-auto no-scrollbar">
                <TabsTrigger value="all" class="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-foreground rounded-none px-4 py-2 text-sm font-medium text-muted-foreground border-b-2 border-transparent transition-all">
                  All ({{ tasks.length }})
                </TabsTrigger>
                <TabsTrigger v-for="cat in categories" :key="cat.name" :value="cat.name.toLowerCase() + 's'" class="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-foreground rounded-none px-4 py-2 text-sm font-medium text-muted-foreground border-b-2 border-transparent transition-all">
                  {{ cat.name }} ({{ cat.count }})
                </TabsTrigger>
              </TabsList>

              <div 
                class="flex items-center space-x-3 px-2 pb-2 sm:pb-0 cursor-pointer group"
                @click="hideCompleted = !hideCompleted"
              >
                <div class="relative inline-flex h-6 w-11 items-center shrink-0">
                  <input 
                    type="checkbox" 
                    class="sr-only" 
                    :checked="hideCompleted"
                  />
                  <div 
                    class="w-11 h-6 rounded-full transition-colors duration-200"
                    :class="hideCompleted ? 'bg-primary' : 'bg-muted'"
                  ></div>
                  <div 
                    class="absolute left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200"
                    :class="hideCompleted ? 'translate-x-5' : 'translate-x-0'"
                  ></div>
                </div>
                <span class="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors">Hide Completed</span>
              </div>
            </div>

            <TabsContent value="all" class="mt-0 space-y-4">
              <TaskCard v-for="task in filteredTasks" :key="task.id" :task="task" @update:completed="toggleTaskCompletion" />
              <div v-if="filteredTasks.length === 0" class="py-12 text-center text-muted-foreground bg-card/50 rounded-xl border border-dashed border-border">
                <p class="text-lg font-medium text-foreground mb-1">No tasks found</p>
                <p class="text-sm">Either you're all caught up or your filters are too strict!</p>
              </div>
            </TabsContent>
            
            <TabsContent v-for="cat in categories" :key="cat.name" :value="cat.name.toLowerCase() + 's'" class="mt-0 space-y-4">
              <TaskCard v-for="task in filteredTasks" :key="task.id" :task="task" @update:completed="toggleTaskCompletion" />
              <div v-if="filteredTasks.length === 0" class="py-12 text-center text-muted-foreground bg-card/50 rounded-xl border border-dashed border-border">
                <p class="text-lg font-medium text-foreground mb-1">No tasks here</p>
                <p class="text-sm">Try disabling "Hide Completed" or add a new task.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>

    <!-- Right Column (Sidebar) -->
    <aside class="md:col-span-4 space-y-6">
      <QuickAddTask @add="handleAddTask" />
      <CategoryList :categories="categories" />
      <WeeklyProgress v-bind="weeklyData" />
    </aside>

    <!-- FAB for mobile -->
    <div class="md:hidden fixed bottom-6 right-6 z-50">
      <Button @click="isTaskDialogOpen = true" class="w-14 h-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-2xl flex items-center justify-center p-0 transition-transform active:scale-95 shadow-primary/40">
        <Plus class="w-6 h-6" />
      </Button>
    </div>

    <!-- Modals -->
    <TaskDialog v-model:open="isTaskDialogOpen" @add="handleAddTask" />
  </main>
  
  <div v-else class="flex-1 flex items-center justify-center min-h-[calc(100vh-64px)]">
    <div class="flex flex-col items-center gap-4">
      <div class="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p class="text-muted-foreground font-medium">Loading your dashboard...</p>
    </div>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
