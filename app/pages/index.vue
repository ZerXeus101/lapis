<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const { user, logout } = useAuth()
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-4">
    <Card class="w-full max-w-md text-center">
      <CardHeader>
        <CardTitle>Welcome Home!</CardTitle>
        <CardDescription>
          You are now logged in.
        </CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div v-if="user" class="text-sm">
          <p class="font-medium text-muted-foreground">Logged in as:</p>
          <p class="text-primary font-bold">{{ user.email }}</p>
        </div>
        
        <div class="flex flex-col gap-2 pt-4">
          <Button variant="outline" @click="logout" class="w-full">
            Log out
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
