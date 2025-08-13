'use client'

import { Requests } from '@/components/requests'
import { AuthGuard } from '@/components/auth-guard'

export default function RequestsPage() {
  return (
    <AuthGuard>
      <Requests />
    </AuthGuard>
  )
}