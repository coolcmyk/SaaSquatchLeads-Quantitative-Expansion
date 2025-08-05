import * as bcrypt from 'bcryptjs'

export interface User {
  id: string
  email: string
  password: string
  name: string
  role: 'admin' | 'user'
  createdAt: string
  lastLogin?: string
}

export interface Session {
  id: string
  userId: string
  token: string
  expiresAt: string
  createdAt: string
}

export class AuthService {
  private users: Map<string, User> = new Map()
  private sessions: Map<string, Session> = new Map()
  private initialized = false

  constructor() {
    if (!this.initialized) {
      this.initializeDefaultUsers()
      this.initialized = true
    }
  }

  private initializeDefaultUsers() {
    // Create default users synchronously with pre-hashed passwords
    const defaultUsers: User[] = [
      {
        id: this.generateId(),
        email: 'admin@saasquatch.com',
        password: '$2a$10$2tUdZpFwDlFs/3nIeJCAOenSOU2HIz8kBImJ..xaZYm4df6BEQfgy', // admin123
        name: 'Admin User',
        role: 'admin',
        createdAt: new Date().toISOString()
      },
      {
        id: this.generateId(),
        email: 'user@saasquatch.com', 
        password: '$2a$10$X0RAl3mCGiSlLIzE8e4OReIZKcRhpfGP7FYQbj9udRCggHld90DQK', // user123
        name: 'Demo User',
        role: 'user',
        createdAt: new Date().toISOString()
      }
    ]

    for (const user of defaultUsers) {
      this.users.set(user.email, user)
    }
  }

  async authenticate(email: string, password: string): Promise<User | null> {
    const user = this.users.get(email.toLowerCase())
    if (!user) return null

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) return null

    // Update last login
    user.lastLogin = new Date().toISOString()
    this.users.set(user.email, user)

    return { ...user, password: '' } // Don't return password
  }

  async createUser(email: string, password: string, name: string, role: 'admin' | 'user' = 'user'): Promise<User> {
    if (this.users.has(email.toLowerCase())) {
      throw new Error('User already exists')
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user: User = {
      id: this.generateId(),
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      role,
      createdAt: new Date().toISOString()
    }

    this.users.set(user.email, user)
    return { ...user, password: '' } // Don't return password
  }

  async createSession(userId: string): Promise<Session> {
    const sessionId = this.generateId()
    const token = this.generateToken()
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours

    const session: Session = {
      id: sessionId,
      userId,
      token,
      expiresAt,
      createdAt: new Date().toISOString()
    }

    this.sessions.set(token, session)
    return session
  }

  async validateSession(token: string): Promise<User | null> {
    console.log('Validating session token:', token.substring(0, 10) + '...')
    const session = this.sessions.get(token)
    if (!session) {
      console.log('Session not found')
      return null
    }

    if (new Date(session.expiresAt) < new Date()) {
      console.log('Session expired')
      this.sessions.delete(token)
      return null
    }

    const user = Array.from(this.users.values()).find(u => u.id === session.userId)
    console.log('Session valid, user found:', user?.email)
    return user ? { ...user, password: '' } : null
  }

  async invalidateSession(token: string): Promise<void> {
    this.sessions.delete(token)
  }

  getUserById(id: string): User | null {
    const user = Array.from(this.users.values()).find(u => u.id === id)
    return user ? { ...user, password: '' } : null
  }

  getAllUsers(): User[] {
    return Array.from(this.users.values()).map(user => ({ ...user, password: '' }))
  }

  private generateId(): string {
    return 'usr_' + Math.random().toString(36).substr(2, 9)
  }

  private generateToken(): string {
    return Math.random().toString(36).substr(2) + Math.random().toString(36).substr(2)
  }
}

// Create a singleton instance
let authServiceInstance: AuthService | null = null

export function getAuthService(): AuthService {
  if (!authServiceInstance) {
    authServiceInstance = new AuthService()
  }
  return authServiceInstance
}
