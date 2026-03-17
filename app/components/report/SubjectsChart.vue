<script setup lang="ts">
    interface TasksBySubject {
        subject: string,
        completed_tasks: number,
        total_tasks: number
    }
    
    defineProps<{
        tasks_by_subject: TasksBySubject[],
    }>()
</script>

<template>
    <CardContent class="">
        <Card class="w-full flex flex-row justify-between items-center p-0" v-for="tbs in tasks_by_subject">
            <CardHeader class="p-3">
                <CardTitle class="text-sm">{{ tbs.subject }}</CardTitle>
            </CardHeader>
            <CardContent class="p-0 pr-5">
                <div class="flex flex-col items-end">
                    {{ ((tbs.completed_tasks / tbs.total_tasks) * 100).toFixed(1) }}% Complete
                    <CardDescription>{{ tbs.total_tasks }} tasks</CardDescription>
                </div>
            </CardContent>
        </Card>
    </CardContent>
</template>