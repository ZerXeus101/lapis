<script setup lang="ts">
import { LucideIcon } from 'lucide-vue-next'
import { Card, CardHeader, CardContent, CardDescription } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const props = defineProps<{
  title: string
  content: string
  description: string
  icon?: any
  trend?: string
  trendColor?: string
  class?: string
}>()
</script>

<template>
  <Card :class="cn('w-full group overflow-hidden border-none bg-card/60 backdrop-blur-md shadow-xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-1', props.class)">
    <div class="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-500 rotate-12 group-hover:rotate-0">
      <component :is="icon" v-if="icon" class="h-24 w-24" />
    </div>
    
    <CardHeader class="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10">
      <CardDescription class="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
        {{ title }}
      </CardDescription>
      <div class="p-2 rounded-xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
        <component :is="icon" v-if="icon" class="h-4 w-4" />
      </div>
    </CardHeader>
    
    <CardContent class="relative z-10">
      <div class="text-3xl font-black tracking-tighter text-foreground mb-1">
        {{ content }}
      </div>
      <p class="text-[11px] font-bold text-muted-foreground flex items-center gap-1.5">
        <span v-if="trend" :class="cn('px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase', trendColor || 'bg-primary/10 text-primary')">
          {{ trend }}
        </span>
        {{ description }}
      </p>
    </CardContent>
    
    <!-- Bottom accent line -->
    <div class="absolute bottom-0 left-0 h-1 w-0 bg-primary group-hover:w-full transition-all duration-700"></div>
  </Card>
</template>
