<script setup lang="ts">
import { ref, reactive } from 'vue'
import { GraduationCap, ArrowRight, Loader2, AlertCircle } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { toast } from 'vue-sonner'
import * as v from 'valibot'
import { loginSchema } from '@/schemas/auth'

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()

// State
const form = reactive({
  email: '',
  password: ''
})

const errors = reactive({
  email: '',
  password: '',
  general: ''
})

const loading = ref(false)

const handleLogin = async () => {
  // Clear previous errors
  errors.email = ''
  errors.password = ''
  errors.general = ''

  // Validate with Valibot
  const result = v.safeParse(loginSchema, form)
  
  if (!result.success) {
    result.issues.forEach(issue => {
      const field = issue.path?.[0]?.key as 'email' | 'password'
      if (field) errors[field] = issue.message
    })
    return
  }

  try {
    loading.value = true
    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    })

    if (error) throw error
    
    toast.success('Welcome back!')
    router.push('/')
  } catch (error: any) {
    errors.general = error.message || 'Invalid email or password'
    toast.error('Login failed')
  } finally {
    loading.value = false
  }
}

// Redirect if already logged in
watch(user, () => {
  if (user.value) router.push('/')
}, { immediate: true })
</script>

<template>
  <div class="min-h-screen bg-background flex flex-col items-center justify-center p-4 font-sans text-foreground">
    <!-- Branding -->
    <div class="mb-8 flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div class="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20 rotate-3 hover:rotate-0 transition-transform duration-300">
        <GraduationCap class="w-10 h-10" />
      </div>
      <div class="text-center">
        <h1 class="text-3xl font-bold tracking-tight">Lapis</h1>
        <p class="text-muted-foreground">Master your tasks, own your future.</p>
      </div>
    </div>

    <!-- Login Card -->
    <Card class="w-full max-w-md border-border bg-card shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
      <CardHeader class="space-y-1 pb-6">
        <CardTitle class="text-2xl font-bold">Login</CardTitle>
        <CardDescription class="text-muted-foreground">
          Enter your credentials to access your dashboard
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <!-- Standard form structure to prevent extension conflicts -->
        <form @submit.prevent="handleLogin" novalidate class="space-y-4">
          <!-- General Error Alert -->
          <div v-if="errors.general" class="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-start gap-2 animate-in fade-in zoom-in-95">
            <AlertCircle class="w-4 h-4 mt-0.5 shrink-0" />
            <p>{{ errors.general }}</p>
          </div>

          <div class="space-y-2 group">
            <Label for="email" class="text-sm font-medium group-focus-within:text-primary transition-colors">
              Email Address
            </Label>
            <div class="relative">
              <input
                id="email"
                name="email"
                v-model="form.email"
                type="email"
                placeholder="name@example.com"
                autocomplete="username email"
                required
                class="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-all placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                :class="{ 'border-destructive focus-visible:ring-destructive': errors.email }"
              />
            </div>
            <p v-if="errors.email" class="text-xs font-medium text-destructive animate-in fade-in slide-in-from-top-1">{{ errors.email }}</p>
          </div>

          <div class="space-y-2 group">
            <div class="flex items-center justify-between">
              <Label for="password" class="text-sm font-medium group-focus-within:text-primary transition-colors">
                Password
              </Label>
              <button type="button" class="text-xs font-medium text-primary hover:underline underline-offset-4">
                Forgot password?
              </button>
            </div>
            <div class="relative">
              <input
                id="password"
                name="password"
                v-model="form.password"
                type="password"
                placeholder="••••••••"
                autocomplete="current-password"
                required
                class="flex h-11 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-all placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                :class="{ 'border-destructive focus-visible:ring-destructive': errors.password }"
              />
            </div>
            <p v-if="errors.password" class="text-xs font-medium text-destructive animate-in fade-in slide-in-from-top-1">{{ errors.password }}</p>
          </div>

          <Button 
            type="submit" 
            class="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg shadow-primary/20 mt-2" 
            :disabled="loading"
          >
            <span v-if="loading" class="flex items-center gap-2">
              <Loader2 class="w-4 h-4 animate-spin" />
              Verifying...
            </span>
            <span v-else class="flex items-center gap-2">
              Sign In
              <ArrowRight class="w-4 h-4" />
            </span>
          </Button>
        </form>

        <div class="mt-8 text-center text-sm">
          <span class="text-muted-foreground">Don't have an account?</span>
          <NuxtLink to="/register" class="text-primary hover:underline underline-offset-4 font-semibold ml-1 transition-colors">
            Create an account
          </NuxtLink>
        </div>
      </CardContent>
    </Card>

    <!-- Footer Decoration -->
    <div class="mt-8 flex items-center gap-4 text-xs text-muted-foreground/60 font-medium tracking-wider uppercase">
      <span>Secure</span>
      <span class="w-1 h-1 bg-muted-foreground/30 rounded-full"></span>
      <span>Encrypted</span>
      <span class="w-1 h-1 bg-muted-foreground/30 rounded-full"></span>
      <span>Private</span>
    </div>
  </div>
</template>

<style scoped>
/* Optional: specific styles if needed */
</style>
