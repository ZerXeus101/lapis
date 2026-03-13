<template>
  <div class="p-8 flex flex-col gap-8">
    <div class="flex gap-4 items-center">
      <Button>Default Button</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Badge>Default Badge</Badge>
      <Badge variant="secondary">Secondary Badge</Badge>
    </div>

    <div class="max-w-md space-y-4">
       <Input placeholder="Type something..." />
    </div>

    <Card class="max-w-md">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>This is a description for the card component.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Main content area of the card. Styling should be consistent with Tailwind v4 and shadcn variables.</p>
      </CardContent>
      <CardFooter class="flex justify-end gap-2">
        <Button variant="ghost">Cancel</Button>
        <Button>Submit</Button>
      </CardFooter>
    </Card>
  </div>
</template>

<script lang="ts" setup>
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
</script>
