import { useEffect, useState } from 'react'
import { type IPublicClientApplication, type AuthenticationResult } from '@azure/msal-browser'
import { loginRequest } from './authConfig'

interface UseMsalTokensReturn {
  tokenResult: AuthenticationResult | null
  tokenError: string | null
  isLoading: boolean
}

export function useMsalTokens(
  instance: IPublicClientApplication | null,
  activeAccountId: string | null,
): UseMsalTokensReturn {
  const [tokenResult, setTokenResult] = useState<AuthenticationResult | null>(null)
  const [tokenError, setTokenError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!activeAccountId || !instance) {
      setTokenResult(null)
      setTokenError(null)
      setIsLoading(false)
      return
    }

    setIsLoading(true)

    const activeAccount = instance.getActiveAccount()
    if (!activeAccount) {
      setIsLoading(false)
      return
    }

    instance
      .acquireTokenSilent({ ...loginRequest, account: activeAccount })
      .then((response) => {
        console.groupCollapsed('MSAL token data')
        console.log('Access Token:', response.accessToken)
        console.log('ID Token:', response.idToken)
        console.groupEnd()
        setTokenResult(response)
        setTokenError(null)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error('acquireTokenSilent failed', error)
        const message = error instanceof Error ? error.message : String(error)
        setTokenError(message)
        setIsLoading(false)

        instance
          .acquireTokenRedirect({
            ...loginRequest,
            account: activeAccount ?? undefined,
          })
          .catch((redirectError) => {
            console.error('acquireTokenRedirect failed', redirectError)
          })
      })
  }, [activeAccountId, instance])

  return { tokenResult, tokenError, isLoading }
}
