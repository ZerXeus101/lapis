import type { Database } from '@/types/database.types'

export const useProfile = () => {
  const supabase = useSupabaseClient<Database>()
  const user = useSupabaseUser()
  const { handleAuthError } = useAuth()
  
  // Shared state
  const profile = useState('profile-data', () => ({
    full_name: '',
    avatar_url: null as string | null,
    loading: true
  }))

  const resolveAvatarUrl = (path: string | null | undefined) => {
    if (!path) return null
    if (path.startsWith('http')) return path
    const { data } = supabase.storage.from('avatars').getPublicUrl(path)
    return data.publicUrl
  }

  const fetchProfile = async (force = false) => {
    if (!user.value?.id) return
    if (!force && profile.value.full_name) return // Already fetched

    try {
      profile.value.loading = true
      // We fetch the basic user info from the public.User table
      const { data, error } = await supabase
        .from('User')
        .select('full_name, avatar_url, profile_pic_url')
        .eq('auth_uid', user.value.id)
        .maybeSingle() // Use maybeSingle to avoid errors if user doesn't exist yet

      if (error) {
        const wasExpired = await handleAuthError(error)
        if (wasExpired) return
        throw error
      }

      if (data) {
        profile.value.full_name = data.full_name || ''
        profile.value.avatar_url = resolveAvatarUrl(data.avatar_url || data.profile_pic_url)
      }
    } catch (e) {
      console.error('Error fetching profile for sync:', e)
    } finally {
      profile.value.loading = false
    }
  }

  // Watch for user changes (e.g. after login)
  watch(user, (newUser) => {
    if (newUser?.id) fetchProfile()
  }, { immediate: true })

  return {
    profile,
    fetchProfile,
    resolveAvatarUrl
  }
}
