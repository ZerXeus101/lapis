<script setup lang="ts">
    import { VisSingleContainer, VisDonut } from "@unovis/vue";
    import { Circle } from "lucide-vue-next";

    interface TasksByCategory {
        category: string,
        total_tasks: number
    }

    const props = defineProps<{
        pieChartData: TasksByCategory[]
    }>()

    const pieChartConfig = ["blue", "royalblue", "powderblue", "dodgerblue", "darkblue", "deepskyblue", "indigo", "lightskyblue", "navy", "steelblue"]

    const overall = props.pieChartData.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.total_tasks;
    }, 0);
</script>

<template>
        <VisSingleContainer
            :data="pieChartData"
            :margin="{ top: 30, bottom: 30, left: 0, right: 0}"
            >
            <VisDonut
                :value="(d: TasksByCategory) => d.total_tasks"
                :color="(d: TasksByCategory) => pieChartConfig[pieChartData.indexOf(d)]"
                :arc-width="0"
            />
        </VisSingleContainer>
        <div class="flex justify-center gap-10">
            <div v-for="data, index in pieChartData" class="flex gap-1">
                <Circle :fill="pieChartConfig[index]" :color="pieChartConfig[index]"></Circle>
                <span>{{ data.category }}({{ (data.total_tasks / overall) * 100 }}%)</span>
            </div>
        </div>
</template>