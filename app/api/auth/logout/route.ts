import { NextRequest, NextResponse } from 'next/server'
import { getAuthService } from '@/lib/services/auth-service'

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('session-token')?.value

    if (token) {
      const authService = getAuthService()
      await authService.invalidateSession(token)
    }

    const response = NextResponse.json({ success: true })
    
    // Clear the session cookie
    response.cookies.delete('session-token')

    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
