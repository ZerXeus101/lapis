<script setup lang="ts">
import { 
  Plus, 
  FileText, 
  Calendar, 
  Settings,
  ChevronRight 
} from 'lucide-vue-next'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const emit = defineEmits<{
  (e: 'add-task'): void
}>()

const actions = [
  { label: 'Add New Task', icon: Plus, action: () => emit('add-task') },
  { label: 'View Reports', icon: FileText, href: '#' },
  { label: 'Calendar View', icon: Calendar, href: '/calendar' },
  { label: 'Settings', icon: Settings, href: '#' },
]
</script>

<template>
  <Card class="border-border shadow-sm">
    <CardHeader class="pb-4">
      <CardTitle class="text-xl font-bold tracking-tight">Quick Actions</CardTitle>
    </CardHeader>
    <CardContent class="grid grid-cols-1 gap-3">
      <template v-for="action in actions" :key="action.label">
        <!-- Action with function (like Add Task) -->
        <Button 
          v-if="action.action"
          variant="outline" 
          class="w-full justify-start h-12 px-4 group hover:bg-accent/50 border-input"
          @click="action.action()"
        >
          <div class="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 mr-3 transition-colors">
            <component :is="action.icon" class="w-4 h-4 text-primary" />
          </div>
          <span class="font-medium flex-1 text-left">{{ action.label }}</span>
          <ChevronRight class="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
        </Button>

        <!-- Action with link (like Calendar) -->
        <NuxtLink v-else :to="action.href" class="block w-full">
          <Button 
            variant="outline" 
            class="w-full justify-start h-12 px-4 group hover:bg-accent/50 border-input"
          >
            <div class="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 mr-3 transition-colors">
              <component :is="action.icon" class="w-4 h-4 text-primary" />
            </div>
            <span class="font-medium flex-1 text-left">{{ action.label }}</span>
            <ChevronRight class="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          </Button>
        </NuxtLink>
      </template>
    </CardContent>
  </Card>
</template>
