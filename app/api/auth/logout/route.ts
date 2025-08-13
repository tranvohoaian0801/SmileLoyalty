import { NextRequest } from 'next/server'
import { redirect } from 'next/navigation'

export async function GET() {
  // Redirect to logout endpoint
  redirect('/api/logout')
}