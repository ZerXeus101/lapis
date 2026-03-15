<script setup lang="ts">
import { 
  LayoutList, 
  CheckCircle2, 
  Clock, 
  AlertTriangle 
} from 'lucide-vue-next'
import ProfileHero from '@/components/profile/ProfileHero.vue'
import InfoSection from '@/components/profile/InfoSection.vue'
import PerformanceSection from '@/components/profile/PerformanceSection.vue'
import QuickActions from '@/components/profile/QuickActions.vue'
import DeadlinesSection from '@/components/profile/DeadlinesSection.vue'
import PreferencesSection from '@/components/profile/PreferencesSection.vue'
import StatCard from '@/components/dashboard/StatCard.vue'
import TaskDialog from '@/components/dashboard/TaskDialog.vue'
import { toast } from 'vue-sonner'
import type { Database } from '@/types/database.types'

definePageMeta({
  layout: 'dashboard'
})

const { user: authUser } = useAuth()
const supabase = useSupabaseClient<Database>()
const loading = ref(true)
const isTaskDialogOpen = ref(false)

interface ProfileData {
  user: {
    id: number
    full_name: string
    student_id: string
    birthdate: string | null
    bio: string | null
    profile_pic_url: string | null
    email_address: string
    preferences: {
      email: boolean
      push: boolean
    }
  }
  stats: {
    total_tasks: number
    completed: number
    in_progress: number
    overdue: number
  }
  performance: {
    name: string
    completed: number
    total: number
  }[]
  deadlines: {
    title: string
    due: string
    category: string
  }[]
}

const profileData = ref<ProfileData | null>(null)

const fetchProfileData = async () => {
  try {
    loading.value = true
    const offset = new Date().getTimezoneOffset()
    
    const { data, error } = await supabase.rpc('get_profile_data', { 
      p_timezone_offset: offset 
    })

    if (error) throw error
    
    profileData.value = data as unknown as ProfileData
  } catch (error: any) {
    console.error('Error fetching profile data:', error.message)
    toast.error('Failed to load profile information')
  } finally {
    loading.value = false
  }
}

const updatePreferences = async (newPrefs: { email: boolean; push: boolean }) => {
  if (!profileData.value) return

  // Optimistic update
  const oldPrefs = { ...profileData.value.user.preferences }
  profileData.value.user.preferences = newPrefs

  try {
    const { error } = await supabase.rpc('update_user_preferences', {
      p_email: newPrefs.email,
      p_push: newPrefs.push
    })

    if (error) throw error
    toast.success('Preferences updated')
  } catch (error: any) {
    // Revert on error
    profileData.value.user.preferences = oldPrefs
    console.error('Error updating preferences:', error.message)
    toast.error('Failed to update preferences')
  }
}

const handleAddTask = async (newTask: any) => {
  const addTaskPromise = async () => {
    const { data, error } = await supabase.rpc('create_task', {
      p_task_name: newTask.title,
      p_category: newTask.category,
      p_due_date: newTask.dueDate,
      p_due_time: newTask.dueTime || '23:59:59',
      p_subject: newTask.subject || 'General',
      p_description: newTask.description || null
    })

    if (error) throw error
    return data
  }

  toast.promise(addTaskPromise(), {
    loading: 'Creating task...',
    success: () => {
      fetchProfileData() // Refresh profile stats and deadlines
      return 'Task created successfully!'
    },
    error: (err: any) => `Error: ${err.message || 'Could not create task'}`
  })
}

// Map database fields to component props
const heroUser = computed(() => {
  if (!profileData.value?.user) return null
  return {
    name: profileData.value.user.full_name || 'Student',
    grade: '11',
    studentId: profileData.value.user.student_id || 'N/A',
    avatarUrl: profileData.value.user.profile_pic_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profileData.value.user.full_name}`
  }
})

const infoData = computed(() => {
  if (!profileData.value?.user) return null
  return {
    fullName: profileData.value.user.full_name || 'N/A',
    email: profileData.value.user.email_address || 'N/A',
    gradeLevel: 'Grade 11',
    studentId: profileData.value.user.student_id || 'N/A',
    dateOfBirth: profileData.value.user.birthdate ? new Date(profileData.value.user.birthdate).toLocaleDateString() : 'N/A'
  }
})

const stats = computed(() => {
  if (!profileData.value?.stats) return []
  const s = profileData.value.stats
  return [
    { label: 'Total Tasks', value: s.total_tasks, icon: LayoutList },
    { label: 'Completed', value: s.completed, icon: CheckCircle2 },
    { label: 'In Progress', value: s.in_progress, icon: Clock },
    { label: 'Overdue', value: s.overdue, icon: AlertTriangle }
  ]
})

onMounted(() => {
  if (authUser.value) {
    fetchProfileData()
  }
})

watch(authUser, (newUser) => {
  if (newUser) fetchProfileData()
})
</script>

<template>
  <main v-if="!loading && profileData" class="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full space-y-6 pb-24 md:pb-12 animate-in fade-in duration-500">
    <!-- Profile Hero Section -->
    <ProfileHero v-if="heroUser" :user="heroUser" />
    
    <!-- Stats Grid -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard v-for="stat in stats" :key="stat.label" v-bind="stat" />
    </div>
    
    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Left Column: Personal Info and Performance -->
      <div class="lg:col-span-8 space-y-6">
        <InfoSection v-if="infoData" :info="infoData" />
        <PerformanceSection :categories="profileData.performance" />
      </div>
      
      <!-- Right Column: Quick Actions, Deadlines, Preferences -->
      <aside class="lg:col-span-4 space-y-6">
        <QuickActions @add-task="isTaskDialogOpen = true" />
        <DeadlinesSection :deadlines="profileData.deadlines" />
        <PreferencesSection :preferences="profileData.user.preferences" @update="updatePreferences" />
      </aside>
    </div>

    <!-- Modals -->
    <TaskDialog v-model:open="isTaskDialogOpen" @add="handleAddTask" />
    
    <!-- Footer -->
    <footer class="pt-12 border-t border-border mt-12 pb-6">
      <div class="flex flex-col items-center justify-center space-y-4">
        <p class="text-sm text-muted-foreground text-center">
          &copy; 2025 School Helper. All rights reserved.
        </p>
        <nav class="flex items-center gap-6">
          <NuxtLink to="#" class="text-xs text-muted-foreground hover:text-foreground transition-colors font-medium underline-offset-4 hover:underline">
            Privacy Policy
          </NuxtLink>
          <NuxtLink to="#" class="text-xs text-muted-foreground hover:text-foreground transition-colors font-medium underline-offset-4 hover:underline">
            Terms of Service
          </NuxtLink>
          <NuxtLink to="#" class="text-xs text-muted-foreground hover:text-foreground transition-colors font-medium underline-offset-4 hover:underline">
            Help
          </NuxtLink>
        </nav>
      </div>
    </footer>
  </main>

  <div v-else class="flex-1 flex items-center justify-center min-h-[calc(100vh-64px)]">
    <div class="flex flex-col items-center gap-4">
      <div class="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p class="text-muted-foreground font-medium">Loading your profile...</p>
    </div>
  </div>
</template>