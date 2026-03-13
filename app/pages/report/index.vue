<script setup lang="ts">
    import { CurveType } from "@unovis/ts"
    import { VisAxis, VisLine, VisXYContainer, VisSingleContainer, VisDonut } from "@unovis/vue"

    const chartData = [
        { date: new Date("2024-01-01"), desktop: 186 },
        { date: new Date("2024-02-01"), desktop: 305 },
        { date: new Date("2024-03-01"), desktop: 237 },
        { date: new Date("2024-04-01"), desktop: 73 },
        { date: new Date("2024-05-01"), desktop: 209 },
        { date: new Date("2024-06-01"), desktop: 214 },
    ]

    type Data = typeof chartData[number]

    const chartConfig = {
        desktop: {
            label: "Desktop",
            color: "blue",
        },
    }

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
    <section class="w-full flex flex-col items-start box-border p-10 gap-3">
        <span class="text-4xl">Reports & Analytics</span>
        <p class="text-gray-500 text-xl">Track your academic progress and task completion</p>
        <Select class="w-full" default-value="day30">
            <SelectTrigger class="w-full max-w-261">
                <SelectValue placeholder="Please select a time range..." />
            </SelectTrigger>
            <SelectContent class="w-full">
                <SelectItem value="day30" class="w-full">Last 30 days</SelectItem>
                <SelectItem value="month2" class="w-full">Last 2 months</SelectItem>
                <SelectItem value="year" class="w-full">Last year</SelectItem>
            </SelectContent>
        </Select>
        <section class="w-full max-w-270 flex flex-row flex-wrap justify-start gap-5">
            <Card class="w-full max-w-lg">
                <CardHeader class="pb-1">
                    <CardDescription>
                        Total Tasks
                    </CardDescription>
                </CardHeader>
                <CardContent class="pb-2">
                    <CardTitle>
                        142
                    </CardTitle>
                </CardContent>
                <CardFooter>
                    <CardDescription class="text-sm">
                        +12% from last month
                    </CardDescription>
                </CardFooter>
            </Card>
            <Card class="w-full max-w-lg">
                <CardHeader class="pb-1">
                    <CardDescription>
                        Completed
                    </CardDescription>
                </CardHeader>
                <CardContent class="pb-2">
                    <CardTitle>
                        98
                    </CardTitle>
                </CardContent>
                <CardFooter>
                    <CardDescription class="text-sm">
                        69% Completion Rate
                    </CardDescription>
                </CardFooter>
            </Card>
            <Card class="w-full max-w-lg">
                <CardHeader class="pb-1">
                    <CardDescription>
                        Overdue
                    </CardDescription>
                </CardHeader>
                <CardContent class="pb-2">
                    <CardTitle>
                        8
                    </CardTitle>
                </CardContent>
                <CardFooter>
                    <CardDescription class="text-sm">
                        Needs attention
                    </CardDescription>
                </CardFooter>
            </Card>
            <Card class="w-full max-w-lg">
                <CardHeader class="pb-1">
                    <CardDescription>
                        Avg Score
                    </CardDescription>
                </CardHeader>
                <CardContent class="pb-2">
                    <CardTitle>
                        87%
                    </CardTitle>
                </CardContent>
                <CardFooter>
                    <CardDescription class="text-sm">
                        +3% improvement
                    </CardDescription>
                </CardFooter>
            </Card>
            <Card class="w-full max-w-261">
                <CardHeader class="pb-1">
                    <CardDescription>
                        Task Completion Trend
                    </CardDescription>
                </CardHeader>
                <CardContent class="pb-2">
                        <VisXYContainer
                        :data="chartData"
                        :margin="{ left: -24 }"
                        :y-domain="[0, undefined]"
                        >
                        <VisLine
                            :x="(d: Data) => d.date"
                            :y="(d: Data) => d.desktop"
                            :color="chartConfig.desktop.color"
                            :curve-type="CurveType.Linear"
                        />
                        <VisAxis
                            type="x"
                            :x="(d: Data) => d.date"
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
                </CardContent>
            </Card>
            <Card class="w-full max-w-261">
                <CardHeader class="pb-1">
                    <CardDescription>
                        Tasks by Category
                    </CardDescription>
                </CardHeader>
                <CardContent class="pb-2">
                    <VisSingleContainer
                        :data="pieChartData"
                        :margin="{ top: 30, bottom: 30 }"
                        >
                        <VisDonut
                            :value="(d: pieData) => d.visitors"
                            :color="(d: pieData) => pieChartConfig[d.browser as keyof typeof pieChartConfig].color"
                            :arc-width="0"
                        />
                    </VisSingleContainer>
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
                <CardContent class="">
                    <Card class="w-full flex flex-row justify-between items-center p-0">
                        <CardHeader class="p-3">
                            <CardTitle class="text-sm">Mathematics</CardTitle>
                        </CardHeader>
                        <CardContent class="p-0 pr-5">
                            <div class="flex flex-col items-end">
                                92%
                                <CardDescription>24 tasks</CardDescription>
                            </div>
                        </CardContent>
                    </Card>
                </CardContent>
            </Card>
        </section>
    </section>
</template>

<style>
    * {
        font-family: sans-serif;
        text-rendering: optimizeLegibility;
    }
</style>