import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { getMsalInstance, initializeMsal, setupMsalEventListener } from './msal'

const msalInstance = getMsalInstance()
setupMsalEventListener(msalInstance)

const renderApp = () => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App instance={msalInstance} />
    </StrictMode>,
  )
}

initializeMsal().finally(() => {
  renderApp()
})
