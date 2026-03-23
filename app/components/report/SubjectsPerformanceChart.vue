<script setup lang="ts">
import { VisXYContainer, VisStackedBar, VisAxis, VisTooltip } from "@unovis/vue"
import { BarChart2 } from 'lucide-vue-next'

interface TasksBySubject {
  subject: string
  completed_tasks: number
  total_tasks: number
}

const props = defineProps<{
  data: TasksBySubject[]
}>()

const processedData = computed(() => {
  if (!props.data || !Array.isArray(props.data)) return []
  
  return props.data
    .filter(d => {
      const total = Number(d?.total_tasks)
      return d && d.subject && !isNaN(total) && total > 0
    })
    .map(d => {
      const completed = Number(d.completed_tasks) || 0
      const total = Number(d.total_tasks)
      const rawPercentage = (completed / total) * 100
      // Ensure percentage is a finite number
      const percentage = isFinite(rawPercentage) ? rawPercentage : 0
      
      return {
        subject: String(d.subject),
        completed_tasks: completed,
        total_tasks: total,
        percentage: percentage
      }
    })
    .sort((a, b) => b.percentage - a.percentage)
})

const template = (d: any) => {
  return `<div class="p-3 border bg-background/95 backdrop-blur-sm rounded-xl shadow-xl text-xs font-sans ring-1 ring-primary/10">
    <div class="font-black text-primary mb-2 flex items-center gap-2">
      <div class="h-2 w-2 rounded-full bg-primary"></div>
      ${d.subject}
    </div>
    <div class="space-y-1 text-muted-foreground font-medium">
      <div class="flex justify-between gap-4">
        <span>Completion:</span>
        <span class="text-foreground font-bold">${Number(d.percentage).toFixed(1)}%</span>
      </div>
      <div class="flex justify-between gap-4">
        <span>Tasks:</span>
        <span class="text-foreground font-bold">${d.completed_tasks} / ${d.total_tasks}</span>
      </div>
    </div>
  </div>`
}

const chartHeight = computed(() => Math.max(300, processedData.value.length * 45))
</script>

<template>
  <div class="w-full min-h-[300px] animate-in fade-in zoom-in duration-500 overflow-hidden">
    <VisXYContainer
      v-if="processedData.length > 0"
      :data="processedData"
      :x-domain="[0, 100]"
      :padding="{ left: 10, right: 30, top: 10, bottom: 10 }"
      :height="chartHeight"
      class="w-full"
    >
      <VisStackedBar
        :x="(d: any) => d.percentage"
        :y="(d: any) => d.subject"
        orientation="horizontal"
        color="hsl(226, 100%, 58%)"
        :corner-radius="4"
        :bar-padding="0.25"
      />
      
      <VisAxis
        type="x"
        :tick-line="false"
        :domain-line="false"
        :grid-line="true"
        :tick-format="(d: number) => `${d}%`"
        :num-ticks="5"
      />
      
      <VisAxis
        type="y"
        :tick-line="false"
        :domain-line="false"
        :grid-line="false"
        :tick-text-width="100"
      />
      
      <VisTooltip :template="template" />
    </VisXYContainer>
    <div v-else class="h-40 flex flex-col items-center justify-center text-muted-foreground italic gap-2">
      <div class="p-3 rounded-full bg-muted/30">
        <BarChart2 class="h-5 w-5 opacity-20" />
      </div>
      <p class="text-sm">No performance data available</p>
    </div>
  </div>
</template>

<style scoped>
:deep(.unovis-stacked-bar-bar) {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
:deep(.unovis-stacked-bar-bar:hover) {
  filter: saturate(1.3) brightness(1.1);
  opacity: 0.85;
}
:deep(.unovis-axis-tick text) {
  font-size: 10px;
  font-weight: 600;
  fill: hsl(var(--muted-foreground));
}
</style>
