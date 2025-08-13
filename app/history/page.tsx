'use client'

import { History } from '@/components/history'
import { AuthGuard } from '@/components/auth-guard'

export default function HistoryPage() {
  return (
    <AuthGuard>
      <History />
    </AuthGuard>
  )
}