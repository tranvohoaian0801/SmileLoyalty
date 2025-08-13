export async function apiRequest(method: string, url: string, data?: any) {
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: data ? JSON.stringify(data) : undefined,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Request failed' }))
    throw new Error(`${response.status}: ${errorData.message || 'Request failed'}`)
  }

  return response
}

export function isUnauthorizedError(error: Error): boolean {
  return /^401: .*Unauthorized/.test(error.message)
}