import React from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google'

const GoogleProvider = ({ children }) => {
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID
  // If clientId is missing, the Google buttons may not work.
  // We still render children so the app doesn't break.
  if (!clientId) return <>{children}</>

  return <GoogleOAuthProvider clientId={clientId}>{children}</GoogleOAuthProvider>
}

export default GoogleProvider

