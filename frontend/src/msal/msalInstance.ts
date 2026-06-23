import { PublicClientApplication, EventType, type AuthenticationResult } from '@azure/msal-browser'
import { msalConfig } from './authConfig'

let msalInstance: PublicClientApplication | null = null

export function getMsalInstance(): PublicClientApplication {
  if (!msalInstance) {
    msalInstance = new PublicClientApplication(msalConfig)
  }
  return msalInstance
}

export async function initializeMsal(): Promise<void> {
  const instance = getMsalInstance()

  try {
    if (typeof instance.initialize === 'function') {
      await instance.initialize()
    }

    const result = await instance.handleRedirectPromise()
    if (result?.account) {
      instance.setActiveAccount(result.account)
      return
    }

    if (!instance.getActiveAccount() && instance.getAllAccounts().length > 0) {
      instance.setActiveAccount(instance.getAllAccounts()[0])
    }
  } catch (error) {
    console.error('MSAL initialization failed:', error)
  }
}

export function setupMsalEventListener(instance: PublicClientApplication): void {
  instance.addEventCallback((event) => {
    if (event.eventType === EventType.LOGIN_SUCCESS) {
      const payload = event.payload as AuthenticationResult
      if (payload?.account) {
        instance.setActiveAccount(payload.account)
      }
    }
  })
}
