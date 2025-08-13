'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useQuery } from '@tanstack/react-query'
import { User } from '@shared/schema'

type AuthContextType = {
  user: User | null
  isLoading: boolean
  error: Error | null
  login: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: user, error, isLoading } = useQuery({
    queryKey: ['/api/auth/user'],
    queryFn: async () => {
      const response = await fetch('/api/auth/user')
      if (!response.ok) {
        if (response.status === 401) {
          return null
        }
        throw new Error('Failed to fetch user')
      }
      return response.json()
    },
    retry: false,
  })

  const login = () => {
    window.location.href = '/api/login'
  }

  const logout = () => {
    window.location.href = '/api/logout'
  }

  const value: AuthContextType = {
    user: user ?? null,
    isLoading,
    error,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}