export const useAuth = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  const router = useRouter()

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      // Navigate to login after logout
      router.push('/login')
    } catch (error: any) {
      console.error('Error logging out:', error.message)
    }
  }

  return {
    user,
    logout
  }
}
