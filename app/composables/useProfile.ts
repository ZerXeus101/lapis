import type { Database } from '@/types/database.types'

export const useProfile = () => {
  const supabase = useSupabaseClient<Database>()
  const user = useSupabaseUser()
  const { handleAuthError } = useAuth()

  /**
   * We use a shared state via useState so that components can manually update it
   * (e.g., the profile page updating the avatar after an upload).
   */
  const profile = useState('profile-data', () => ({
    full_name: '',
    avatar_url: null as string | null
  }))

  const resolveAvatarUrl = (path: string | null | undefined) => {
    if (!path) return null
    if (path.startsWith('http')) return path
    const { data } = supabase.storage.from('avatars').getPublicUrl(path)
    return data.publicUrl
  }

  /**
   * useAsyncData handles the automatic fetching and SSR/hydration logic.
   * It populates the shared 'profile' state.
   */
  const { refresh: fetchProfile, status } = useAsyncData(
    'profile-async-fetch',
    async () => {
      if (!user.value?.id) return null

      try {
        const { data, error } = await supabase
          .from('User')
          .select('full_name, avatar_url, profile_pic_url')
          .eq('auth_uid', user.value.id)
          .maybeSingle()

        if (error) {
          await handleAuthError(error)
          return null
        }

        if (data) {
          profile.value.full_name = data.full_name || ''
          profile.value.avatar_url = resolveAvatarUrl(data.avatar_url || data.profile_pic_url)
        }
        
        return data
      } catch (e) {
        console.error('Error in useProfile async data:', e)
        return null
      }
    },
    {
      watch: [user],
      immediate: true
    }
  )

  const loading = computed(() => status.value === 'pending')

  return {
    profile,
    fetchProfile,
    loading,
    resolveAvatarUrl
  }
}
