import { useState } from 'react'
import { MsalProvider, useMsal, AuthenticatedTemplate, UnauthenticatedTemplate } from '@azure/msal-react'
import { PublicClientApplication } from '@azure/msal-browser'
import Sidebar from './Sidebar'
import { useMsalTokens, useMsalAuth } from './msal'
import './App.css'

const navItems = ['Agents']

const MainContent = () => {
  const { instance } = useMsal()
  const [activeItem, setActiveItem] = useState('Agents')
  const activeAccount = instance.getActiveAccount()
  const activeAccountId = activeAccount?.homeAccountId ?? null
  const { tokenResult, tokenError } = useMsalTokens(instance, activeAccountId)
  const { handleLogin, handleLogout } = useMsalAuth(instance)

  const loggedIn = Boolean(activeAccount)

  return (
    <div className="app-shell">
      <header className="topnav">
        <div className="brand">App Hub</div>
        <button
          type="button"
          className="sign-in"
          onClick={loggedIn ? () => handleLogout(activeAccount) : handleLogin}
        >
          {loggedIn ? 'Sign out' : 'Sign in'}
        </button>
      </header>

      <div className={loggedIn ? 'layout' : 'layout layout--alone'}>
        {loggedIn && (
          <Sidebar
            items={navItems}
            activeItem={activeItem}
            onSelect={setActiveItem}
          />
        )}

        <main className={loggedIn ? 'content' : 'content content--centered'}>
          <div className="page-header">
            <h1>{loggedIn ? activeItem : 'Welcome'}</h1>
            <p>
              {loggedIn
                ? `This is the ${activeItem.toLowerCase()} section.`
                : 'Sign in to see the menu and access the app sections.'}
            </p>
          </div>

          <section className="panel">
            <h2>{loggedIn ? 'Ready to explore' : 'Please sign in'}</h2>
            <p>
              {loggedIn
                ? 'Use the sidebar to access Agents.'
                : 'Click Sign in to authenticate and load the app.'}
            </p>
          </section>

          {loggedIn && activeAccount ? (
            <section className="panel">
              <h2>User details</h2>
              <div className="user-data">
                <p><strong>Name:</strong> {activeAccount.name || activeAccount.username}</p>
                <p><strong>Username:</strong> {activeAccount.username}</p>
                <p><strong>Home Account ID:</strong> {activeAccount.homeAccountId}</p>
                <p><strong>Environment:</strong> {activeAccount.environment}</p>
                <p>
                  <strong>Tenant ID:</strong>{' '}
                  {String((activeAccount.idTokenClaims as Record<string, unknown>)?.tid ?? 'N/A')}
                </p>
                <p>
                  <strong>Object ID:</strong>{' '}
                  {String((activeAccount.idTokenClaims as Record<string, unknown>)?.oid ?? 'N/A')}
                </p>
              </div>
              <pre className="claim-json">
                {JSON.stringify(activeAccount.idTokenClaims, null, 2)}
              </pre>
              {tokenError ? (
                <p className="error-text">Token retrieval error: {tokenError}</p>
              ) : tokenResult ? (
                <p className="success-text">JWT tokens printed to the console.</p>
              ) : (
                <p>Fetching token data...</p>
              )}
            </section>
          ) : null}
        </main>
      </div>
    </div>
  )
}

const App = ({ instance }: { instance: PublicClientApplication }) => {
  return (
    <MsalProvider instance={instance}>
      <AuthenticatedTemplate>
        <MainContent />
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <MainContent />
      </UnauthenticatedTemplate>
    </MsalProvider>
  )
}

export default App
