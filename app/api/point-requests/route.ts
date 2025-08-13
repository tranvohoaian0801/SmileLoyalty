import { NextRequest } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('connect.sid')
  
  if (!sessionCookie) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const response = await fetch(`${process.env.API_BASE_URL || 'http://localhost:5000'}/api/point-requests`, {
      headers: {
        'Cookie': `connect.sid=${sessionCookie.value}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.json()
      return Response.json(error, { status: response.status })
    }

    const data = await response.json()
    return Response.json(data)
  } catch (error) {
    console.error('Error fetching point requests:', error)
    return Response.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('connect.sid')
  
  if (!sessionCookie) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    
    const response = await fetch(`${process.env.API_BASE_URL || 'http://localhost:5000'}/api/point-requests`, {
      method: 'POST',
      headers: {
        'Cookie': `connect.sid=${sessionCookie.value}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const error = await response.json()
      return Response.json(error, { status: response.status })
    }

    const data = await response.json()
    return Response.json(data, { status: 201 })
  } catch (error) {
    console.error('Error creating point request:', error)
    return Response.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}