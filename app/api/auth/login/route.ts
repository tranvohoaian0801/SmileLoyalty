import { NextRequest } from 'next/server'
import { redirect } from 'next/navigation'

export async function GET(request: NextRequest) {
  const hostname = request.headers.get('host') || 'localhost'
  
  // Redirect to Replit Auth
  const authUrl = `/api/login?hostname=${hostname}`
  redirect(authUrl)
}