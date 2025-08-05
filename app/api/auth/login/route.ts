import { NextRequest, NextResponse } from 'next/server'
import { getAuthService } from '@/lib/services/auth-service'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const authService = getAuthService()
    const user = await authService.authenticate(email, password)
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const session = await authService.createSession(user.id)
    
    console.log('Login successful, creating session:', session.token.substring(0, 10) + '...')
    
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
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      path: '/'
    })

    console.log('Cookie set with token:', session.token.substring(0, 10) + '...')

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
