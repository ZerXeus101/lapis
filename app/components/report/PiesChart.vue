<script setup lang="ts">
import { VisSingleContainer, VisDonut, VisTooltip } from "@unovis/vue"
import { Circle, ChevronDown, ChevronUp } from "lucide-vue-next"

interface TasksByCategory {
  category: string
  total_tasks: number
}

const props = defineProps<{
  pieChartData: TasksByCategory[]
}>()

// Modern primary-themed palette
const colors = ["#2b59ff", "#4d74ff", "#6e8fff", "#91aaff", "#b3c5ff", "#d5dfff", "#eef2ff", "#7dd3fc", "#0ea5e9", "#0369a1"]

const sortedData = computed(() => {
  return [...props.pieChartData].sort((a, b) => b.total_tasks - a.total_tasks)
})

const overall = computed(() => props.pieChartData.reduce((acc, curr) => acc + curr.total_tasks, 0))

const template = (d: TasksByCategory) => {
  const percentage = ((d.total_tasks / overall.value) * 100).toFixed(1)
  return `<div class="p-2 border bg-background/95 backdrop-blur-sm rounded-xl shadow-lg text-xs font-sans ring-1 ring-primary/10">
    <div class="font-bold text-primary flex items-center gap-2 mb-1">
      <div class="h-2 w-2 rounded-full bg-primary"></div>
      ${d.category}
    </div>
    <div class="flex flex-col gap-0.5 text-muted-foreground">
      <span>Count: <span class="font-semibold text-foreground">${d.total_tasks}</span></span>
      <span>Share: <span class="font-semibold text-foreground">${percentage}%</span></span>
    </div>
  </div>`
}

const isExpanded = ref(false)
</script>

<template>
  <div class="w-full flex flex-col items-center h-full">
    <div v-if="pieChartData.length > 0" class="flex flex-col lg:flex-row items-center lg:items-start gap-4 lg:gap-8 w-full">
      
      <!-- Donut Chart Container -->
      <div 
        class="relative w-full lg:w-1/2 flex-shrink-0 flex flex-col items-center justify-center cursor-pointer group/chart"
        @click="isExpanded = !isExpanded"
      >
        <div class="relative w-full flex justify-center">
          <VisSingleContainer
            :data="sortedData"
            :margin="{ top: 10, bottom: 10, left: 10, right: 10 }"
            class="h-[240px] w-full max-w-[240px] transition-transform duration-500 group-hover/chart:scale-[1.05]"
          >
            <VisDonut
              :value="(d: TasksByCategory) => d.total_tasks"
              :color="(d: TasksByCategory, i: number) => colors[i % colors.length]"
              :arc-width="32"
              :corner-radius="12"
              :pad-angle="0.04"
              :show-labels="false"
            />
            <VisTooltip :template="template" />
          </VisSingleContainer>

          <!-- Center content -->
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none">
            <span class="text-3xl font-black text-foreground tabular-nums tracking-tighter">{{ overall }}</span>
            <span class="text-[9px] font-black text-muted-foreground uppercase tracking-widest -mt-1 opacity-70">Total</span>
          </div>
        </div>
        
        <!-- Mobile Hint - Now more visible and not absolutely overlapping bottom -->
        <div class="lg:hidden mt-4 px-6 py-2 rounded-full bg-primary/5 border border-primary/10 flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest hover:bg-primary/10 transition-colors">
          {{ isExpanded ? 'Hide Details' : 'View Breakdown' }}
          <ChevronDown v-if="!isExpanded" class="h-3 w-3" />
          <ChevronUp v-else class="h-3 w-3" />
        </div>
      </div>

      <!-- Scrollable Legend Area -->
      <div 
        class="w-full lg:w-1/2 transition-all duration-500 overflow-hidden"
        :class="[isExpanded ? 'max-h-[1000px] opacity-100 mt-4 lg:mt-0' : 'max-h-0 lg:max-h-[350px] opacity-0 lg:opacity-100']"
      >
        <div class="lg:max-h-[320px] overflow-y-auto pr-2 scroll-smooth custom-scrollbar pb-4 lg:pb-0">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5 py-2">
            <div 
              v-for="(data, index) in sortedData" 
              :key="data.category" 
              class="flex items-center justify-between group/item p-3.5 rounded-2xl hover:bg-primary/5 transition-all duration-300 border border-primary/5 hover:border-primary/20 bg-card lg:bg-transparent shadow-sm lg:shadow-none"
            >
              <div class="flex items-center gap-3 min-w-0">
                <Circle 
                  class="h-3.5 w-3.5 fill-current transition-transform duration-300 group-hover/item:scale-125 flex-shrink-0" 
                  :style="{ color: colors[index % colors.length] }" 
                />
                <span class="text-[13px] font-black text-foreground truncate leading-none">
                  {{ data.category }}
                </span>
              </div>
              <div class="flex items-center gap-3 flex-shrink-0">
                <span class="text-[11px] font-bold text-primary/60 tabular-nums">
                   {{ ((data.total_tasks / (overall || 1)) * 100).toFixed(0) }}%
                </span>
                <span class="text-[10px] bg-primary/10 text-primary px-2.5 py-1.5 rounded-xl font-black tabular-nums min-w-[36px] text-center">
                  {{ data.total_tasks }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="h-64 w-full flex flex-col items-center justify-center text-muted-foreground/40 gap-4">
      <div class="p-5 rounded-full bg-muted/20">
        <Circle class="h-12 w-12 opacity-10" stroke-width="1.5" />
      </div>
      <p class="text-sm font-medium italic">No categorical data found</p>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: hsl(var(--muted));
  border-radius: 20px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--primary) / 0.4);
}

.unovis-donut-container :deep(.unovis-donut-arc) {
  transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.unovis-donut-container :deep(.unovis-donut-arc:hover) {
  opacity: 0.8;
  cursor: pointer;
}
</style>
