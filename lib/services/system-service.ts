interface DatabaseStats {
  totalLeads: number
  activeUsers: number
  apiCalls: number
  systemHealth: 'healthy' | 'warning' | 'error'
  uptime: number
}

interface SystemLog {
  id: string
  timestamp: string
  level: 'info' | 'warn' | 'error'
  message: string
  userId?: string
  endpoint?: string
}

export class SystemService {
  private logs: SystemLog[] = []
  private stats: DatabaseStats = {
    totalLeads: 0,
    activeUsers: 0,
    apiCalls: 0,
    systemHealth: 'healthy',
    uptime: Date.now()
  }

  constructor() {
    this.initializeStats()
    this.startHealthMonitoring()
  }

  private initializeStats() {
    // Simulate some initial data
    this.stats = {
      totalLeads: Math.floor(Math.random() * 10000) + 5000,
      activeUsers: Math.floor(Math.random() * 50) + 10,
      apiCalls: Math.floor(Math.random() * 100000) + 50000,
      systemHealth: 'healthy',
      uptime: Date.now() - (Math.random() * 7 * 24 * 60 * 60 * 1000) // Up to 7 days ago
    }

    // Create some initial logs
    const initialLogs: Omit<SystemLog, 'id'>[] = [
      {
        timestamp: new Date().toISOString(),
        level: 'info',
        message: 'System started successfully',
      },
      {
        timestamp: new Date(Date.now() - 60000).toISOString(),
        level: 'info',
        message: 'Database connection established',
      },
      {
        timestamp: new Date(Date.now() - 120000).toISOString(),
        level: 'info',
        message: 'Authentication service initialized',
      }
    ]

    this.logs = initialLogs.map(log => ({
      ...log,
      id: this.generateId()
    }))
  }

  private startHealthMonitoring() {
    // Simulate periodic health checks
    setInterval(() => {
      this.updateSystemHealth()
      this.addRandomLog()
    }, 30000) // Every 30 seconds
  }

  private updateSystemHealth() {
    const random = Math.random()
    
    if (random < 0.1) {
      this.stats.systemHealth = 'warning'
      this.log('warn', 'High system load detected')
    } else if (random < 0.02) {
      this.stats.systemHealth = 'error'
      this.log('error', 'Database connection timeout')
    } else {
      this.stats.systemHealth = 'healthy'
    }

    // Update other stats
    this.stats.activeUsers = Math.max(1, this.stats.activeUsers + Math.floor(Math.random() * 3) - 1)
    this.stats.apiCalls += Math.floor(Math.random() * 10) + 1
  }

  private addRandomLog() {
    const messages = [
      'User authentication successful',
      'Lead data enriched',
      'Analytics query executed',
      'Export task completed',
      'WebSocket connection established',
      'Cache updated',
      'Backup completed successfully'
    ]

    const message = messages[Math.floor(Math.random() * messages.length)]
    this.log('info', message)
  }

  log(level: 'info' | 'warn' | 'error', message: string, userId?: string, endpoint?: string) {
    const logEntry: SystemLog = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      level,
      message,
      userId,
      endpoint
    }

    this.logs.unshift(logEntry)
    
    // Keep only last 1000 logs
    if (this.logs.length > 1000) {
      this.logs = this.logs.slice(0, 1000)
    }

    console.log(`[${level.toUpperCase()}] ${message}`)
  }

  getStats(): DatabaseStats {
    return { ...this.stats }
  }

  getLogs(limit: number = 50): SystemLog[] {
    return this.logs.slice(0, limit)
  }

  incrementApiCall(endpoint?: string, userId?: string) {
    this.stats.apiCalls++
    if (endpoint) {
      this.log('info', `API call: ${endpoint}`, userId, endpoint)
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9)
  }
}
