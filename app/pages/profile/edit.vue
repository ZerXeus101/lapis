<script setup lang="ts">
import { 
  ArrowLeft, 
  Camera, 
  Save, 
  Upload,
  Image as ImageIcon
} from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'vue-sonner'
import type { Database } from '@/types/database.types'

definePageMeta({
  layout: 'dashboard'
})

const router = useRouter()
const supabase = useSupabaseClient<Database>()
const { user: authUser, handleAuthError } = useAuth()
const { profile: sharedProfile, resolveAvatarUrl, fetchProfile } = useProfile()

const loading = ref(true)
const saving = ref(false)

const fileAvatar = ref<HTMLInputElement | null>(null)
const fileCover = ref<HTMLInputElement | null>(null)

// Pending files to be uploaded on Save
const pendingAvatarFile = ref<File | null>(null)
const pendingCoverFile = ref<File | null>(null)

// Local previews
const avatarPreview = ref<string | null>(null)
const coverPreview = ref<string | null>(null)

// Form state
const formData = ref({
  full_name: '',
  student_id: '',
  grade: '',
  birthdate: '',
  bio: '',
  avatar_url: null as string | null,
  cover_photo_url: null as string | null,
  email_address: ''
})

const fetchProfileToEdit = async () => {
  if (!authUser.value) return
  
  try {
    loading.value = true
    const offset = new Date().getTimezoneOffset()
    const { data, error } = await supabase.rpc('get_profile_data', { 
      p_timezone_offset: offset 
    })

    if (error) {
      const wasExpired = await handleAuthError(error)
      if (wasExpired) return
      throw error
    }
    
    const profileData = data as any
    formData.value = {
      full_name: profileData.user.full_name || '',
      student_id: profileData.user.student_id || '',
      grade: profileData.user.grade || '',
      birthdate: profileData.user.birthdate || '',
      bio: profileData.user.bio || '',
      avatar_url: profileData.user.avatar_url,
      cover_photo_url: profileData.user.cover_photo_url || null,
      email_address: profileData.user.email_address || authUser.value.email || ''
    }
  } catch (error: any) {
    console.error('Error fetching profile:', error)
    toast.error('Failed to load profile data')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (authUser.value) fetchProfileToEdit()
})

watch(authUser, (newUser) => {
  if (newUser && loading.value) fetchProfileToEdit()
}, { immediate: true })

const handleFileUpload = (event: Event, type: 'avatar' | 'cover') => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  const previewUrl = URL.createObjectURL(file)
  
  if (type === 'avatar') {
    pendingAvatarFile.value = file
    avatarPreview.value = previewUrl
  } else {
    pendingCoverFile.value = file
    coverPreview.value = previewUrl
  }
}

const uploadToStorage = async (file: File, bucket: 'avatars' | 'cover_photos') => {
  const fileExt = file.name.split('.').pop()
  const fileName = `${authUser.value!.id}-${Date.now()}.${fileExt}`
  const filePath = fileName

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, { upsert: true })

  if (uploadError) throw uploadError
  return filePath
}

const handleSave = async () => {
  saving.value = true
  try {
    let finalAvatarUrl: string | null = formData.value.avatar_url
    let finalCoverUrl: string | null = formData.value.cover_photo_url

    // 1. Only upload if there's a new file selected
    if (pendingAvatarFile.value) {
      finalAvatarUrl = await uploadToStorage(pendingAvatarFile.value, 'avatars')
    }
    
    if (pendingCoverFile.value) {
      finalCoverUrl = await uploadToStorage(pendingCoverFile.value, 'cover_photos')
    }

    // 2. Update the profile using RPC
    const { data, error } = await supabase.rpc('update_profile', {
      p_full_name: formData.value.full_name || undefined,
      p_student_id: formData.value.student_id || undefined,
      p_grade: formData.value.grade || undefined,
      p_birthdate: formData.value.birthdate || undefined,
      p_bio: formData.value.bio || undefined,
      p_avatar_url: finalAvatarUrl ?? undefined,
      p_cover_photo_url: finalCoverUrl ?? undefined
    })

    if (error) throw error
    
    // 3. Cleanup object URLs
    if (avatarPreview.value) URL.revokeObjectURL(avatarPreview.value)
    if (coverPreview.value) URL.revokeObjectURL(coverPreview.value)

    await fetchProfile(true)
    toast.success('Profile updated successfully')
    router.push('/profile')
  } catch (error: any) {
    toast.error(`Failed: ${error.message || 'Could not update profile'}`)
  } finally {
    saving.value = false
  }
}

const resolvedAvatar = computed(() => {
  if (avatarPreview.value) return avatarPreview.value
  return resolveAvatarUrl(formData.value.avatar_url)
})

const resolveCoverPhotoUrl = (path: string | null | undefined) => {
  if (!path) return null
  if (path.startsWith('http')) return path
  const { data } = supabase.storage.from('cover_photos').getPublicUrl(path)
  return data.publicUrl
}

const resolvedCover = computed(() => {
  if (coverPreview.value) return coverPreview.value
  return resolveCoverPhotoUrl(formData.value.cover_photo_url)
})
</script>

<template>
  <main class="flex-1 p-4 md:p-6 max-w-3xl mx-auto w-full space-y-6 pb-24 md:pb-12 animate-in fade-in duration-300">
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>

    <template v-else>
      <input type="file" ref="fileAvatar" class="hidden" accept="image/*" @change="handleFileUpload($event, 'avatar')" />
      <input type="file" ref="fileCover" class="hidden" accept="image/*" @change="handleFileUpload($event, 'cover')" />

      <div class="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" @click="router.back()" class="rounded-full shrink-0">
          <ArrowLeft class="w-5 h-5" />
        </Button>
        <div>
          <h1 class="text-2xl font-bold tracking-tight text-foreground">Edit Profile</h1>
          <p class="text-sm text-muted-foreground mt-1">Update your personal information</p>
        </div>
      </div>

      <div class="bg-card border border-border rounded-xl shadow-sm overflow-hidden p-6 md:p-8 space-y-10">
        <section class="space-y-8">
          <h3 class="text-lg font-semibold text-foreground flex items-center gap-2">
            <ImageIcon class="w-5 h-5" /> Visuals
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="flex flex-col gap-4">
              <div class="relative self-start">
                <Avatar class="w-24 h-24 border-4 border-card shadow-sm rounded-full overflow-hidden bg-muted">
                  <AvatarImage v-if="resolvedAvatar" :src="resolvedAvatar" />
                  <AvatarFallback class="bg-muted text-2xl font-bold">{{ formData.full_name?.charAt(0) }}</AvatarFallback>
                </Avatar>
                <button @click="fileAvatar?.click()" class="absolute bottom-0 right-0 p-2 bg-black text-white rounded-full shadow-md">
                  <Camera class="w-4 h-4" />
                </button>
              </div>
              <Label class="text-sm font-medium">Profile Picture</Label>
            </div>

            <div class="flex flex-col gap-4">
              <div 
                class="w-full h-24 rounded-lg bg-muted border border-dashed border-border flex items-center justify-center overflow-hidden bg-cover bg-center cursor-pointer relative group"
                :style="resolvedCover ? { backgroundImage: `url(${resolvedCover})` } : {}"
                @click="fileCover?.click()"
              >
                <div v-if="resolvedCover" class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera class="w-6 h-6 text-white" />
                </div>
                <div v-else class="flex flex-col items-center gap-1 text-muted-foreground">
                  <Upload class="w-5 h-5" />
                  <span class="text-xs">Upload Cover</span>
                </div>
              </div>
              <Label class="text-sm font-medium">Cover Photo</Label>
            </div>
          </div>
        </section>

        <Separator />

        <section class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2"><Label>Full Name</Label><Input v-model="formData.full_name" /></div>
            <div class="space-y-2"><Label>Student ID</Label><Input v-model="formData.student_id" /></div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <Label>Grade Level</Label>
              <Input v-model="formData.grade" placeholder="e.g. Grade 11, Sophomore, etc." />
            </div>
            <div class="space-y-2"><Label>Birthdate</Label><Input type="date" v-model="formData.birthdate" /></div>
          </div>
          <div class="space-y-2"><Label>Email</Label><Input v-model="formData.email_address" readonly class="bg-muted" /></div>
          <div class="space-y-2"><Label>Bio</Label><Textarea v-model="formData.bio" class="min-h-30" /></div>
        </section>

        <div class="flex justify-end gap-3 pt-6">
          <Button variant="outline" @click="router.back()">Cancel</Button>
          <Button @click="handleSave" :disabled="saving" class="bg-black text-white">
            <Save v-if="!saving" class="w-4 h-4 mr-2" />
            <span v-else class="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            Save Changes
          </Button>
        </div>
      </div>
    </template>
  </main>
</template>
