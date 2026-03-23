<script setup lang="ts">
import { VisAxis, VisStackedBar, VisXYContainer, VisTooltip } from "@unovis/vue"

interface TaskCompletionRate {
  date: Date
  tasks_completed: number
}

const props = defineProps<{
  chartData: TaskCompletionRate[]
  range: string
}>()

const processedData = computed(() => {
  if (props.chartData.length === 0) return []
  
  const data = [...props.chartData].sort((a, b) => a.date.getTime() - b.date.getTime())
  
  if (props.range === 'all') return data

  const now = new Date()
  now.setHours(23, 59, 59, 999)
  
  let startDate = new Date()
  if (props.range === 'week') startDate.setDate(now.getDate() - 7)
  else if (props.range === 'day30') startDate.setDate(now.getDate() - 30)
  else if (props.range === 'month3') startDate.setMonth(now.getMonth() - 3)
  else if (props.range === 'year') startDate.setFullYear(now.getFullYear() - 1)
  
  startDate.setHours(0, 0, 0, 0)

  const dateMap = new Map<string, number>()
  data.forEach(d => {
    dateMap.set(d.date.toDateString(), d.tasks_completed)
  })

  const filledData: TaskCompletionRate[] = []
  const currentDate = new Date(startDate)
  
  while (currentDate <= now) {
    filledData.push({
      date: new Date(currentDate),
      tasks_completed: dateMap.get(currentDate.toDateString()) || 0
    })
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return filledData
})

const template = (d: TaskCompletionRate) => {
  return `<div class="p-2 border bg-background rounded shadow-sm text-xs font-sans">
    <div class="font-semibold text-primary">${d.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
    <div class="mt-1">Tasks Completed: <span class="font-bold">${d.tasks_completed}</span></div>
  </div>`
}
</script>

<template>
  <VisXYContainer
    v-show="processedData.length > 0"
    :data="processedData"
    :padding="{ left: 0, right: 0, top: 10, bottom: 0 }"
  >
    <VisStackedBar
      :x="(d: TaskCompletionRate) => d.date"
      :y="(d: TaskCompletionRate) => d.tasks_completed"
      color="hsl(226, 100%, 58%)"
      :corner-radius="4"
      :bar-padding="0.2"
    />
    <VisAxis
      type="x"
      :tick-line="false"
      :domain-line="false"
      :grid-line="false"
      :num-ticks="range === 'week' ? 7 : 6"
      :tick-format="(d: number) => {
        const date = new Date(d)
        if (range === 'year' || range === 'month3') {
           return date.toLocaleDateString('en-US', { month: 'short' })
        }
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        })
      }"
    />
    <VisAxis
      type="y"
      :num-ticks="3"
      :tick-line="false"
      :domain-line="false"
      :grid-line="true"
    />
    <VisTooltip :template="template" />
  </VisXYContainer>
  <div v-if="processedData.length === 0" class="h-full flex items-center justify-center text-muted-foreground text-sm italic">
    No task data for this period
  </div>
</template>

<style scoped>
:deep(.unovis-stacked-bar-bar) {
  transition: opacity 0.2s ease, filter 0.2s ease;
}
:deep(.unovis-stacked-bar-bar:hover) {
  opacity: 0.9;
  filter: brightness(1.1);
}
</style>
