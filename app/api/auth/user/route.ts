import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('connect.sid')
  
  if (!sessionCookie) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Forward the request to the Express API with cookies
    const response = await fetch('http://localhost:5000/api/user', {
      headers: {
        'Cookie': `connect.sid=${sessionCookie.value}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const data = await response.json()
    return Response.json(data)
  } catch (error) {
    console.error('Error fetching user:', error)
    return Response.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}