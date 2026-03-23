import type { Database } from '@/types/database.types'

export const useProfile = () => {
  const supabase = useSupabaseClient<Database>()
  const user = useSupabaseUser()
  const { handleAuthError } = useAuth()
  
  // Shared state: singleton-like across the app
  const profile = useState('profile-data', () => ({
    full_name: '',
    avatar_url: null as string | null,
    loading: false,
    fetched: false
  }))

  const resolveAvatarUrl = (path: string | null | undefined) => {
    if (!path) return null
    if (path.startsWith('http')) return path
    const { data } = supabase.storage.from('avatars').getPublicUrl(path)
    return data.publicUrl
  }

  const fetchProfile = async (force = false, currentUser = user.value) => {
    const userId = currentUser?.id || (currentUser as any)?.sub
    
    if (!userId || (!force && profile.value.fetched)) {
      return
    }

    try {
      profile.value.loading = true
      
      const { data, error } = await supabase.rpc('get_user_avatar')

      if (error) {
        const { data: directData, error: directError } = await supabase
          .from('User')
          .select('full_name, avatar_url')
          .eq('auth_uid', userId)
          .maybeSingle()

        if (directError) {
          const wasExpired = await handleAuthError(directError)
          if (wasExpired) return
          throw directError
        }

        if (directData) {
          profile.value.full_name = directData.full_name || ''
          profile.value.avatar_url = resolveAvatarUrl(directData.avatar_url)
          profile.value.fetched = true
        }
      } else if (data) {
        const userData = data as any
        profile.value.full_name = userData.full_name || ''
        profile.value.avatar_url = resolveAvatarUrl(userData.avatar_url)
        profile.value.fetched = true
      }
    } catch (e) {
      console.error('Error syncing profile:', e)
    } finally {
      profile.value.loading = false
    }
  }

  // Self-healing: Watch for user changes internally
  if (import.meta.client) {
    watch(user, (newUser) => {
      const userId = newUser?.id || (newUser as any)?.sub
      if (userId && !profile.value.fetched) {
        fetchProfile(false, newUser)
      }
    }, { immediate: true })
  }

  // Clear profile data (useful on logout)
  const clearProfile = () => {
    profile.value = {
      full_name: '',
      avatar_url: null,
      loading: false,
      fetched: false
    }
  }

  return {
    profile,
    fetchProfile,
    resolveAvatarUrl,
    clearProfile
  }
}
