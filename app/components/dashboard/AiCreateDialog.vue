<script setup lang="ts">
import { ref } from 'vue'
import { Sparkles, X, Loader2, Check, AlertCircle, Plus } from 'lucide-vue-next'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'vue-sonner'

const open = defineModel<boolean>('open')
const emit = defineEmits<{
  (e: 'created'): void
}>()

const prompt = ref('')
const generating = ref(false)
const generatedTasks = ref<any[]>([])
const creating = ref(false)

const handleGenerate = async () => {
  if (!prompt.value.trim()) return

  generating.value = true
  generatedTasks.value = []
  
  try {
    const { data, error } = await useFetch('/api/ai/generate-tasks', {
      method: 'POST',
      body: { prompt: prompt.value }
    })

    if (error.value) throw error.value
    
    if (data.value?.tasks) {
      generatedTasks.value = data.value.tasks
      toast.success(`AI generated ${generatedTasks.value.length} tasks!`)
    }
  } catch (error: any) {
    console.error('AI Generate Error:', error)
    toast.error(error.statusMessage || 'Failed to generate tasks')
  } finally {
    generating.value = false
  }
}

const handleCreateTasks = async () => {
  if (generatedTasks.value.length === 0) return
  
  creating.value = true
  const supabase = useSupabaseClient()
  
  try {
    // Create tasks one by one using the RPC
    const createPromises = generatedTasks.value.map(task => 
      supabase.rpc('create_task', {
        p_task_name: task.task_name,
        p_category: task.category,
        p_due_date: task.due_date,
        p_due_time: task.due_time || '20:00:00',
        p_subject: task.subject || 'General',
        p_description: task.description || null
      })
    )

    const results = await Promise.all(createPromises)
    const errors = results.filter(r => r.error)
    
    if (errors.length > 0) {
      console.error('Errors creating some tasks:', errors)
      toast.error(`Created ${results.length - errors.length} tasks, but ${errors.length} failed.`)
    } else {
      toast.success(`Successfully created ${results.length} tasks!`)
      open.value = false
      prompt.value = ''
      generatedTasks.value = []
      emit('created')
    }
  } catch (error: any) {
    console.error('Bulk Create Error:', error)
    toast.error('Failed to create tasks')
  } finally {
    creating.value = false
  }
}

const removeTask = (index: number) => {
  generatedTasks.value.splice(index, 1)
}
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent class="sm:max-w-125 bg-card border-border">
      <DialogHeader>
        <DialogTitle class="flex items-center gap-2 text-2xl font-bold">
          <Sparkles class="w-6 h-6 text-primary animate-pulse" />
          AI Create Tasks
        </DialogTitle>
        <DialogDescription class="text-muted-foreground">
          Tell the AI what you need to do, and it will break it down into tasks.
        </DialogDescription>
      </DialogHeader>

      <div class="space-y-4 py-4">
        <div v-if="generatedTasks.length === 0" class="space-y-4">
          <Textarea
            v-model="prompt"
            placeholder="e.g. I have a math exam on Friday and I need to study algebra and geometry this week."
            class="min-h-30 bg-background border-input resize-none focus-visible:ring-primary"
            :disabled="generating"
          />
          <Button 
            @click="handleGenerate" 
            class="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11"
            :disabled="generating || !prompt.trim()"
          >
            <Loader2 v-if="generating" class="w-4 h-4 mr-2 animate-spin" />
            <Sparkles v-else class="w-4 h-4 mr-2" />
            {{ generating ? 'Generating Tasks...' : 'Generate Tasks' }}
          </Button>
        </div>

        <div v-else class="space-y-4">
          <div class="max-h-75 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            <div 
              v-for="(task, index) in generatedTasks" 
              :key="index"
              class="p-3 bg-muted/50 border border-border rounded-lg relative group transition-all hover:border-primary/50"
            >
              <button 
                @click="removeTask(index)"
                class="absolute top-2 right-2 p-1 rounded-full hover:bg-destructive hover:text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X class="w-3.5 h-3.5" />
              </button>
              <div class="flex flex-col gap-1">
                <span class="font-bold text-sm text-foreground">{{ task.task_name }}</span>
                <div class="flex items-center gap-3 text-[11px] text-muted-foreground">
                  <span class="flex items-center gap-1">
                    <Check class="w-3 h-3 text-primary" />
                    {{ task.category }}
                  </span>
                  <span class="flex items-center gap-1">
                    <AlertCircle class="w-3 h-3 text-amber-500" />
                    {{ task.due_date }}
                  </span>
                  <span class="font-medium text-primary">{{ task.subject }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="flex gap-3">
            <Button 
              variant="outline" 
              @click="generatedTasks = []" 
              class="flex-1 border-input hover:bg-accent"
              :disabled="creating"
            >
              Back to Edit Prompt
            </Button>
            <Button 
              @click="handleCreateTasks" 
              class="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
              :disabled="creating"
            >
              <Loader2 v-if="creating" class="w-4 h-4 mr-2 animate-spin" />
              <Plus v-else class="w-4 h-4 mr-2" />
              Create {{ generatedTasks.length }} Tasks
            </Button>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: hsl(var(--muted));
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--muted-foreground));
}
</style>
