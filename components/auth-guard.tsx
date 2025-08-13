'use client'

import { useAuth } from '@/lib/auth'
import { AuthPage } from '@/components/auth-page'
import { Loader2 } from 'lucide-react'
import { ReactNode } from 'react'

interface AuthGuardProps {
  children: ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-airline-blue rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white font-bold text-xl">S</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading...
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return <AuthPage />
  }

  return <>{children}</>
}