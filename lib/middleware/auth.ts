import { getAuthService } from '@/lib/services/auth-service'
import { NextRequest } from 'next/server'

export async function getAuthenticatedUser(request: NextRequest | Request) {
  try {
    // Handle both NextRequest and regular Request objects
    let sessionToken: string | undefined

    if (request instanceof NextRequest) {
      sessionToken = request.cookies.get('session-token')?.value
    } else {
      // For regular Request objects, parse cookies manually
      const cookieHeader = request.headers.get('cookie')
      if (cookieHeader) {
        const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
          const [key, value] = cookie.trim().split('=')
          acc[key] = value
          return acc
        }, {} as Record<string, string>)
        sessionToken = cookies['session-token']
      }
    }

    if (!sessionToken) return null

    const authService = getAuthService()
    return await authService.validateSession(sessionToken)
  } catch (error) {
    console.error('Auth validation error:', error)
    return null
  }
}

export function requireAuth(handler: (request: Request, user: any) => Promise<Response>) {
  return async (request: Request) => {
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    return handler(request, user)
  }
}

export function requireAdmin(handler: (request: Request, user: any) => Promise<Response>) {
  return async (request: Request) => {
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    if (user.role !== 'admin') {
      return new Response(JSON.stringify({ error: 'Admin access required' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    return handler(request, user)
  }
}
