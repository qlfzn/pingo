"use client"

import { useAuth } from "./context/AuthContext"
import { LandingPage } from "./LandingPage"
import Dashboard from "./Dashboard"

export default function App() {
  const { user } = useAuth()

  // Show landing page for non-signed-in users, dashboard for signed-in users
  return user ? <Dashboard /> : <LandingPage />
}
