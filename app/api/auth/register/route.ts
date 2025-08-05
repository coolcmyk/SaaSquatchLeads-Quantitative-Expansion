import { NextRequest, NextResponse } from 'next/server'
import { getAuthService } from '@/lib/services/auth-service'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      )
    }

    const authService = getAuthService()
    const user = await authService.createUser(email, password, name)
    const session = await authService.createSession(user.id)
    
    const response = NextResponse.json({
      success: true,
      user,
      token: session.token
    })

    // Set HTTP-only cookie for session
    response.cookies.set('session-token', session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    })

    return response
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
