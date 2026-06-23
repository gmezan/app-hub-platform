import { useCallback } from 'react'
import { type IPublicClientApplication, type AccountInfo } from '@azure/msal-browser'
import { loginRequest } from './authConfig'

export function useMsalAuth(instance: IPublicClientApplication | null) {
  const handleLogin = useCallback(() => {
    if (!instance) return

    instance
      .loginRedirect({
        ...loginRequest,
        prompt: 'select_account',
      })
      .catch((error) => console.error('Login failed:', error))
  }, [instance])

  const handleLogout = useCallback(
    (account: AccountInfo | null) => {
      if (!instance) return

      instance
        .logoutRedirect({
          account: account ?? undefined,
        })
        .catch((error) => console.error('Logout failed:', error))
    },
    [instance],
  )

  return { handleLogin, handleLogout }
}
