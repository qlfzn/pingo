"use client"

import { createContext, useContext, useState } from "react"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null) // null = not signed in
  const [isLoading, setIsLoading] = useState(false)

  const signIn = async (email, password) => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setUser({ id: "1", email, name: "Demo User" })
      setIsLoading(false)
    }, 1000)
  }

  const signUp = async (email, password, name) => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setUser({ id: "1", email, name })
      setIsLoading(false)
    }, 1000)
  }

  const signOut = () => {
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
