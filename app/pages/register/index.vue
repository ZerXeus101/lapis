<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const handleRegister = async () => {
  try {
    loading.value = true
    errorMessage.value = ''
    successMessage.value = ''
    
    const { data, error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        emailRedirectTo: `${window.location.origin}/confirm`,
      }
    })

    if (error) throw error
    
    successMessage.value = 'Check your email for the confirmation link!'
  } catch (error: any) {
    errorMessage.value = error.message
  } finally {
    loading.value = false
  }
}

// Redirect if already logged in
watch(user, () => {
  if (user.value) {
    router.push('/')
  }
}, { immediate: true })
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen px-4">
    <Card class="w-full max-w-md">
      <CardHeader>
        <CardTitle class="text-2xl">Create an account</CardTitle>
        <CardDescription>
          Enter your email below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="handleRegister" class="grid gap-4">
          <div class="grid gap-2">
            <Label for="email">Email</Label>
            <Input
              id="email"
              name="email"
              v-model="email"
              type="email"
              placeholder="m@example.com"
              autocomplete="email"
              required
            />
          </div>
          <div class="grid gap-2">
            <Label for="password">Password</Label>
            <Input
              id="password"
              name="password"
              v-model="password"
              type="password"
              autocomplete="new-password"
              required
            />
          </div>
          
          <div v-if="errorMessage" class="text-sm text-destructive">
            {{ errorMessage }}
          </div>

          <div v-if="successMessage" class="text-sm text-primary font-medium">
            {{ successMessage }}
          </div>

          <Button type="submit" class="w-full" :disabled="loading">
            <span v-if="loading">Creating account...</span>
            <span v-else>Register</span>
          </Button>
        </form>
        <div class="mt-4 text-center text-sm">
          Already have an account?
          <NuxtLink to="/login" class="underline">
            Log in
          </NuxtLink>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
