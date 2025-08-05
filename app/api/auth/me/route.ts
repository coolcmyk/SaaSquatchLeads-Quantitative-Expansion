import { NextRequest, NextResponse } from 'next/server'
import { getAuthService } from '@/lib/services/auth-service'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('session-token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const authService = getAuthService()
    const user = await authService.validateSession(token)
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      user
    })
  } catch (error) {
    console.error('Me endpoint error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
