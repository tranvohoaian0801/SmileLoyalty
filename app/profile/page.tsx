'use client'

import { Profile } from '@/components/profile'
import { AuthGuard } from '@/components/auth-guard'

export default function ProfilePage() {
  return (
    <AuthGuard>
      <Profile />
    </AuthGuard>
  )
}