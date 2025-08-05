import { NextRequest, NextResponse } from 'next/server'
import { getAuthService } from '@/lib/services/auth-service'
import { getAuthenticatedUser } from '@/lib/middleware/auth'

export async function GET(request: NextRequest) {
  try {
    // Check authentication and admin role
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }
    
    if (user.role !== 'admin') {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const authService = getAuthService()
    const users = authService.getAllUsers()
    
    return NextResponse.json({
      success: true,
      data: users,
      metadata: {
        total: users.length
      }
    })
  } catch (error) {
    console.error('Users API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication and admin role
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }
    
    if (user.role !== 'admin') {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const { email, password, name, role } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      )
    }

    const authService = getAuthService()
    const newUser = await authService.createUser(email, password, name, role || 'user')
    
    return NextResponse.json({
      success: true,
      data: newUser
    })
  } catch (error) {
    console.error('Create user error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
