<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

const props = defineProps<{
  preferences: {
    email: boolean
    push: boolean
  }
}>()

const emit = defineEmits<{
  (e: 'update', payload: { email: boolean; push: boolean }): void
}>()

// Direct toggle function that the div calls
const toggle = (key: 'email' | 'push') => {
  console.log(`PreferencesSection: Toggling ${key}`);
  
  const newPrefs = {
    email: key === 'email' ? !props.preferences.email : props.preferences.email,
    push: key === 'push' ? !props.preferences.push : props.preferences.push
  };
  
  emit('update', newPrefs);
}
</script>

<template>
  <Card class="border-border shadow-sm">
    <CardHeader class="pb-4">
      <CardTitle class="text-xl font-bold tracking-tight">Preferences</CardTitle>
    </CardHeader>
    <CardContent class="space-y-6">
      <!-- Email Notifications Row -->
      <div 
        class="flex items-center justify-between group cursor-pointer select-none p-2 -m-2 rounded-lg hover:bg-accent/50 transition-colors"
        @click="toggle('email')"
      >
        <Label class="text-base font-medium text-foreground cursor-pointer flex-1">
          Email Notifications
        </Label>
        <Switch 
          :checked="preferences.email" 
          @click.stop="toggle('email')"
        />
      </div>

      <!-- Push Notifications Row -->
      <div 
        class="flex items-center justify-between group cursor-pointer select-none p-2 -m-2 rounded-lg hover:bg-accent/50 transition-colors"
        @click="toggle('push')"
      >
        <Label class="text-base font-medium text-foreground cursor-pointer flex-1">
          Push Notifications
        </Label>
        <Switch 
          :checked="preferences.push" 
          @click.stop="toggle('push')"
        />
      </div>
    </CardContent>
  </Card>
</template>
