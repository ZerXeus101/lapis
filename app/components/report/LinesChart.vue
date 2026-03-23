<script defer setup lang="ts">
import { CurveType } from '@unovis/ts';
import { VisAxis, VisLine, VisXYContainer } from "@unovis/vue";
import { ChartTooltip } from '../ui/chart';
import { Donut } from '@unovis/ts';

    interface TaskCompletionRate {
        date: Date,
        tasks_completed: number
    }

    const props = defineProps<{
        chartData: TaskCompletionRate[]
    }>()

    const chartConfig = {
        desktop: {
            label: "Desktop",
            color: "blue",
        },
    }
</script>

<template>
    <VisXYContainer
    v-show="chartData.length > 0"
    :data="chartData"
    :margin="{ left: -24 }"
    :y-domain="[0, undefined]"
    >
        <VisLine
            :x="(d: TaskCompletionRate) => d.date"
            :y="(d: TaskCompletionRate) => d.tasks_completed"
            :color="chartConfig.desktop.color"
            :curve-type="CurveType.Linear"
        />
        <VisAxis
            type="x"
            :x="(d: TaskCompletionRate) => d.date"
            :tick-line="false"
            :domain-line="false"
            :grid-line="false"
            :num-ticks="6"
            :tick-format="(d: number) => {
            const date = new Date(d)
            return date.toLocaleDateString('en-US', {
                month: 'short',
            })
            }"
            :tick-values="chartData.map(d => d.date)"
        />
        <VisAxis
            type="y"
            :num-ticks="3"
            :tick-line="false"
            :domain-line="false"
        />
    </VisXYContainer>
</template>