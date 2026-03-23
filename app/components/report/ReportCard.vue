<script setup lang="ts">
    defineProps<{
        title: string,
        content: string,
        description: string,
    }>()
</script>

<template>
    <Card class="w-full max-w-lg">
        <CardHeader class="pb-1">
            <CardDescription>
                {{title}}
            </CardDescription>
        </CardHeader>
        <CardContent class="pb-2">
            <CardTitle>
                {{content}}
            </CardTitle>
        </CardContent>
        <CardFooter>
            <CardDescription class="text-sm">
                {{description}}
            </CardDescription>
        </CardFooter>
    </Card>
</template>