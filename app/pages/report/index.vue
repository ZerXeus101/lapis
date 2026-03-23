<script setup lang="ts">
import type { Database } from "~/types/database.types"
import { toast } from 'vue-sonner'
import BarsChart from '@/components/report/BarsChart.vue'
import PiesChart from "~/components/report/PiesChart.vue"
import ReportCard from "~/components/report/ReportCard.vue"
import SubjectsChart from "~/components/report/SubjectsChart.vue"
import Skeleton from "~/components/ui/skeleton/Skeleton.vue"
import { ListChecks, CheckCircle2, AlertTriangle, Star, List } from 'lucide-vue-next'

definePageMeta({
  layout: 'dashboard'
})

interface TaskCompletionRate {
  date: Date
  tasks_completed: number
}

interface TasksByCategory {
  category: string
  total_tasks: number
}

interface TasksBySubject {
  subject: string
  completed_tasks: number
  total_tasks: number
}

interface ReportData {
  total_tasks: number
  completed_tasks: number
  overdue_tasks: number
  average_score: number
  task_completion_rate: TaskCompletionRate[]
  tasks_by_category: TasksByCategory[]
  tasks_by_subject: TasksBySubject[]
}

const { user } = useAuth()
const supabase = useSupabaseClient<Database>()

const loading = ref(true)
const reportData = ref<ReportData | null>(null)

const offset_map: Record<string, number> = {
  "week": 7,
  "day30": 30,
  "month3": 90,
  "year": 365,
  "all": 9999,
}

const bar_offset = ref('day30')
const pie_offset = ref('all')

const barChartData = ref<TaskCompletionRate[]>([])
const pieChartData = ref<TasksByCategory[]>([])

const monthlyStats = computed(() => {
  if (!reportData.value) return null
  
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()
  
  const lastMonthDate = new Date(currentYear, currentMonth - 1, 1)
  const lastMonth = lastMonthDate.getMonth()
  const lastMonthYear = lastMonthDate.getFullYear()

  // Filter tasks for current month
  const currentMonthTasks = reportData.value.task_completion_rate.filter(t => {
    const d = new Date(t.date)
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear
  })

  // Filter tasks for last month
  const lastMonthTasks = reportData.value.task_completion_rate.filter(t => {
    const d = new Date(t.date)
    return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear
  })

  const currentMonthCompleted = currentMonthTasks.reduce((sum, t) => sum + t.tasks_completed, 0)
  const lastMonthCompleted = lastMonthTasks.reduce((sum, t) => sum + t.tasks_completed, 0)

  // Since the API doesn't give us total_tasks_per_day, we estimate monthly score
  // based on the ratio of monthly completed vs overall average as a proxy for this month's performance
  // For a more accurate "Score", we'd need total tasks due per month from the backend.
  // For now, we'll display the current month's completed volume as the primary metric
  // and use the trend of completion volume between months.
  
  const diff = currentMonthCompleted - lastMonthCompleted
  const trendPercent = lastMonthCompleted > 0 
    ? Math.round((diff / lastMonthCompleted) * 100) 
    : (currentMonthCompleted > 0 ? 100 : 0)
    
  const trendString = trendPercent >= 0 ? `+${trendPercent}%` : `${trendPercent}%`
  const trendColor = trendPercent >= 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'

  return {
    currentMonthCompleted,
    trendString,
    trendColor,
    totalThisMonth: currentMonthTasks.length, // approximation
  }
})

const fetchReportData = async () => {
  if (!user.value) return
  
  try {
    loading.value = true
    // Fetch "all" (lifetime) data for the summary section
    const { data, error } = await supabase.rpc('get_report_data', { days: 9999 })

    if (error) {
      if (error.message?.includes('JWT expired')) {
        const { logout } = useAuth()
        await logout()
        toast.error('Your session has expired. Please log in again.')
        return
      }
      throw error
    }

    if (data && typeof data === 'object' && 'error' in data) {
      toast.error("User profile not found")
      return
    }

    const rawData = data as any
    const formattedData: ReportData = {
      ...rawData,
      task_completion_rate: (rawData.task_completion_rate || []).map((tcr: any) => ({
        date: new Date(tcr.date),
        tasks_completed: tcr.tasks_completed
      }))
    }

    reportData.value = formattedData
  } catch (error: any) {
    console.error('Error fetching report data:', error.message)
    toast.error('Failed to load report data')
  } finally {
    loading.value = false
  }
}

const fetchBarData = async (days: number) => {
  if (!user.value) return
  try {
    const { data, error } = await supabase.rpc('get_report_data', { days })
    if (!error && data) {
      const rawData = data as any
      barChartData.value = (rawData.task_completion_rate || []).map((tcr: any) => ({
        date: new Date(tcr.date),
        tasks_completed: tcr.tasks_completed
      }))
    }
  } catch (e) {}
}

const fetchPieData = async (days: number) => {
  if (!user.value) return
  try {
    const { data, error } = await supabase.rpc('get_report_data', { days })
    if (!error && data) {
      const rawData = data as any
      pieChartData.value = rawData.tasks_by_category || []
    }
  } catch (e) {}
}

// Watch for changes in chart offsets
watch(bar_offset, (newVal) => {
  fetchBarData(offset_map[newVal]!)
}, { immediate: true })

watch(pie_offset, (newVal) => {
  fetchPieData(offset_map[newVal]!)
}, { immediate: true })

onMounted(() => {
  if (user.value) {
    fetchReportData() // Initial lifetime fetch
    fetchBarData(offset_map[bar_offset.value]!)
    fetchPieData(offset_map[pie_offset.value]!)
  }
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-background to-muted/30">
    <section class="w-full flex justify-center pb-20">
      <main class="flex flex-col box-border p-6 md:p-10 gap-10 items-start max-w-7xl w-full">
        <!-- Modernized Header -->
        <header class="flex flex-col md:flex-row md:items-end justify-between w-full gap-6">
          <div class="space-y-2">
            <h1 class="text-4xl font-black tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Reports & Analytics</h1>
            <p class="text-muted-foreground text-lg font-medium">Insights into your academic journey and productivity</p>
          </div>
        </header>

        <div v-if="loading && !reportData" class="w-full space-y-8 animate-pulse">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Skeleton v-for="i in 4" :key="i" class="h-32 w-full rounded-2xl" />
          </div>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Skeleton v-for="i in 2" :key="i" class="h-[450px] w-full rounded-2xl" />
          </div>
        </div>

        <div v-else-if="reportData && user && monthlyStats" class="w-full space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <!-- Summary Cards with extra polish -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ReportCard 
              title="Total Tasks" 
              :content="reportData.total_tasks.toString()" 
              description="Lifetime productivity"
              :icon="ListChecks"
              class="border-primary/5 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 rounded-3xl"
            />
            <ReportCard 
              title="Score" 
              :content="`${Math.round(reportData.average_score)}%`" 
              description="Monthly completion rate"
              :icon="CheckCircle2"
              :trend="monthlyStats.trendString"
              :trendColor="monthlyStats.trendColor"
              class="border-primary/5 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 rounded-3xl"
            />
            <ReportCard 
              title="Tasks This Month" 
              :content="monthlyStats.totalThisMonth.toString()" 
              :description="`${reportData.overdue_tasks} overdue tasks`"
              :icon="AlertTriangle"
              class="border-destructive/10 hover:shadow-2xl hover:shadow-destructive/5 transition-all duration-500 rounded-3xl"
            />
            <ReportCard 
              title="Avg Score" 
              :content="`${Math.round(reportData.average_score)}%`" 
              description="Overall performance"
              :icon="Star"
              class="border-primary/5 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 rounded-3xl"
            />
          </div>

          <!-- Main Analytics Area -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Trend Card -->
            <Card class="w-full border-none bg-card/60 backdrop-blur-md shadow-2xl shadow-primary/5 rounded-[2.5rem] overflow-hidden ring-1 ring-primary/5">
              <CardHeader class="flex flex-row items-start justify-between p-8 pb-4">
                <div class="space-y-1.5">
                  <CardTitle class="text-xl font-black tracking-tight text-foreground">Activity Trend</CardTitle>
                  <CardDescription class="font-bold text-[10px] uppercase tracking-wider text-muted-foreground/60">Daily task completion volume</CardDescription>
                </div>
                <Select v-model="bar_offset">
                  <SelectTrigger class="w-[110px] h-8 text-[10px] font-black uppercase tracking-widest bg-primary/5 border-none ring-0 rounded-lg text-primary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">Weekly</SelectItem>
                    <SelectItem value="day30">Monthly</SelectItem>
                    <SelectItem value="month3">Quarterly</SelectItem>
                    <SelectItem value="year">Yearly</SelectItem>
                    <SelectItem value="all">Lifetime</SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent class="p-8 pt-0">
                <div class="mt-4">
                  <BarsChart :chartData="barChartData" :range="bar_offset" />
                </div>
              </CardContent>
            </Card>

            <!-- Distribution Card -->
            <Card class="w-full border-none bg-card/60 backdrop-blur-md shadow-2xl shadow-primary/5 rounded-[2.5rem] overflow-hidden ring-1 ring-primary/5">
              <CardHeader class="flex flex-row items-start justify-between p-8 pb-4">
                <div class="space-y-1.5">
                  <CardTitle class="text-xl font-black tracking-tight text-foreground">Focus Areas</CardTitle>
                  <CardDescription class="font-bold text-[10px] uppercase tracking-wider text-muted-foreground/60">Task distribution by category</CardDescription>
                </div>
                <Select v-model="pie_offset">
                  <SelectTrigger class="w-[110px] h-8 text-[10px] font-black uppercase tracking-widest bg-primary/5 border-none ring-0 rounded-lg text-primary">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">Weekly</SelectItem>
                    <SelectItem value="day30">Monthly</SelectItem>
                    <SelectItem value="month3">Quarterly</SelectItem>
                    <SelectItem value="year">Yearly</SelectItem>
                    <SelectItem value="all">Lifetime</SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent class="p-8 pt-0">
                <div class="mt-4 flex items-center justify-center">
                  <PiesChart :pieChartData="pieChartData" />
                </div>
              </CardContent>
            </Card>

            <!-- Subject Performance -->
            <Card class="w-full lg:col-span-2 border-none bg-card/60 backdrop-blur-md shadow-2xl shadow-primary/5 rounded-[2.5rem] overflow-hidden ring-1 ring-primary/5">
              <CardHeader class="flex flex-row items-center justify-between p-8 pb-6 border-b border-primary/5">
                <div>
                  <CardTitle class="text-xl font-black tracking-tight text-foreground">Subject Mastery</CardTitle>
                  <CardDescription class="font-bold text-[10px] uppercase tracking-wider text-muted-foreground/60">Performance breakdown across academic subjects</CardDescription>
                </div>
              </CardHeader>
              <CardContent class="p-8">
                <SubjectsChart :tasks_by_subject="reportData.tasks_by_subject" />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </section>
  </div>
</template>

<style scoped>
/* Scoped styles */
</style>