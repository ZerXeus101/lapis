export const useAuth = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  const router = useRouter()

  const logout = async () => {
    try {
      // Clear session from Supabase
      await supabase.auth.signOut()
      // Force navigation to login
      router.push('/login')
    } catch (error: any) {
      console.error('Error logging out:', error.message)
    }
  }

  /**
   * Centralized error handler for Auth/JWT issues.
   * If it detects an expired session, it forces a logout.
   */
  const handleAuthError = async (error: any) => {
    if (!error) return false
    
    const message = error.message?.toLowerCase() || ''
    const isExpired = message.includes('jwt expired') || 
                      message.includes('invalid ticket') ||
                      error.status === 401

    if (isExpired) {
      console.warn('Session expired, logging out...')
      await logout()
      return true
    }
    return false
  }

  return {
    user,
    logout,
    handleAuthError
  }
}
