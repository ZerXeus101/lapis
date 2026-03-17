<script setup lang="ts">
    import type { Database, Json } from "~/types/database.types"
    import { toast } from 'vue-sonner'
    import LinesChart from '@/components/report/LinesChart.vue'
import PiesChart from "~/components/report/PiesChart.vue"
import ReportCard from "~/components/report/ReportCard.vue"
import SubjectsChart from "~/components/report/SubjectsChart.vue"
import Skeleton from "~/components/ui/skeleton/Skeleton.vue"

    definePageMeta({
        layout: 'dashboard'
    })

    interface TaskCompletionRate {
        date: Date,
        tasks_completed: number
    }

    interface TasksByCategory {
        category: string,
        total_tasks: number
    }

    interface TasksBySubject {
        subject: string,
        completed_tasks: number,
        total_tasks: number
    }

    interface ReportData {
        total_tasks: number,
        completed_tasks: number,
        overdue_tasks: number,
        average_score: number,
        task_completion_rate: TaskCompletionRate[],
        tasks_by_category: TasksByCategory[],
        tasks_by_subject: TasksBySubject[]
    }

    const { user } = useAuth()
    const supabase = useSupabaseClient<Database>()

    const loading = ref(true)

    const reportData = ref({} as ReportData);
    const TCR_Data = ref([] as TaskCompletionRate[]);
    const chartData = ref([] as TaskCompletionRate[]);

    const fetchReportData = async (days: number) => {
        if (!user.value) return
        try {
            loading.value = true;
            const { data, error } = await supabase.rpc('get_report_data', { days: days })
            
            if (error) {
                if (error.message?.includes('JWT expired')) {
                    const { logout } = useAuth()
                    await logout()
                    toast.error('Your session has expired. Please log in again.')
                    return
                }
                throw error
            }

            if(data && "error" in (data as Json[])) {
                toast.error("User profile not found");

                throw error
            }

            reportData.value = data as unknown as ReportData;
            TCR_Data.value = [];
            for(let tcr of reportData.value.task_completion_rate) {
                TCR_Data.value.push({ date: new Date(tcr.date), tasks_completed: tcr.tasks_completed})
            }
            chartData.value = TCR_Data.value;
            console.log(chartData);
        } catch (error: any) {
            console.error('Error fetching report data:', error.message)
            toast.error('Failed to load report data')
        } finally {
            loading.value = false
        }
    }

    onMounted(() => { if (user.value) fetchReportData(30) })

    const offset_map: Record<string, number> = {
        "day30": 30,
        "month2": 60,
        "year": 365,
        "all": 9999,
    }

    const day_offset = ref('day30');

    const pieChartData = [
        { browser: "chrome", visitors: 275, fill: "blue" },
        { browser: "safari", visitors: 200, fill: "lightblue" },
        { browser: "firefox", visitors: 187, fill: "powderblue" },
        { browser: "edge", visitors: 173, fill: "darkblue" },
        { browser: "other", visitors: 90, fill: "royalblue" },
    ]
    type pieData = typeof pieChartData[number]

    const pieChartConfig = {
        visitors: {
            label: "Visitors",
            color: undefined,
        },
        chrome: {
            label: "Chrome",
            color: "blue",
        },
        safari: {
            label: "Safari",
            color: "lightblue",
        },
        firefox: {
            label: "Firefox",
            color: "powderblue",
        },
        edge: {
            label: "Edge",
            color: "darkblue",
        },
        other: {
            label: "Other",
            color: "royalblue",
        },
    }
</script>

<template>
    <section class="w-full flex justify-center">
        <main class="flex flex-col box-border p-10 gap-3 items-start">
            <span class="text-4xl">Reports & Analytics</span>
            <p class="text-gray-500 text-xl">Track your academic progress and task completion</p>
            <Select class="w-full" default-value="day30" v-model="day_offset">
                <SelectTrigger class="w-full max-w-200">
                    <SelectValue placeholder="Please select a time range..."/>
                </SelectTrigger>
                <SelectContent class="w-full" @click="fetchReportData(offset_map[day_offset]!)">
                    <SelectItem value="day30" class="w-full">Last 30 days</SelectItem>
                    <SelectItem value="month2" class="w-full">Last 2 months</SelectItem>
                    <SelectItem value="year" class="w-full">Last year</SelectItem>
                    <SelectItem value="all" class="w-full">Anytime</SelectItem>
                </SelectContent>
            </Select>
            <Skeleton class="lg:min-w-5xl md:min-w-md min-w-sm h-400" v-if="loading"></Skeleton>
            <section class="w-full max-w-270 flex flex-row flex-wrap justify-start gap-5" v-else-if="!loading && user">
                <ReportCard v-if="!loading" title="Total Tasks" :content="`${(reportData as ReportData).total_tasks}`" :description="`${((reportData as ReportData).total_tasks) - ((reportData as ReportData).completed_tasks)} incomplete tasks`"></ReportCard>
                <ReportCard title="Completed" :content="`${(reportData as ReportData).completed_tasks}`" :description="`${(reportData as ReportData).average_score}% Completion Rate`"></ReportCard>
                <ReportCard title="Overdue" :content="`${(reportData as ReportData).overdue_tasks}`" description="Needing attention!"></ReportCard>
                <ReportCard title="Avg Score" :content="`${(reportData as ReportData).average_score}%`" description="Great job!"></ReportCard>
                <Card class="w-full max-w-261">
                    <CardHeader class="pb-1">
                        <CardDescription>
                            Task Completion Trend
                        </CardDescription>
                    </CardHeader>
                    <CardContent class="pb-2">
                        <LinesChart :chartData="chartData"></LinesChart>
                    </CardContent>
                </Card>
                <Card class="w-full max-w-261">
                    <CardHeader class="pb-1">
                        <CardDescription>
                            Tasks by Category
                        </CardDescription>
                    </CardHeader>
                    <CardContent class="pb-2">
                        <PiesChart :pieChartData="reportData.tasks_by_category"></PiesChart>
                    </CardContent>
                </Card>
                <Card class="w-full max-w-261">
                    <CardHeader class="pb-1">
                        <CardDescription>
                            <b class="text-black">Subject Performance</b>
                            <br>
                            <span class="cursor-pointer">View All</span>
                        </CardDescription>
                    </CardHeader>
                    <SubjectsChart :tasks_by_subject="reportData.tasks_by_subject"></SubjectsChart>
                </Card>
            </section>
        </main>
    </section>
</template>

<style>
    * {
        font-family: sans-serif;
        text-rendering: optimizeLegibility;
    }
</style>