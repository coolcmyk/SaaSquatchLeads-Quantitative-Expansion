interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  metadata?: {
    total?: number
    page?: number
    limit?: number
    hasMore?: boolean
  }
}

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
}

class ApiClient {
  private baseUrl: string

  constructor() {
    this.baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://your-domain.com' 
      : 'http://localhost:3000'
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}/api${endpoint}`
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Include cookies for auth
      ...options,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `HTTP ${response.status}`)
    }

    return response.json()
  }

  // Auth methods
  async login(email: string, password: string) {
    return this.request<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
  }

  async register(email: string, password: string, name: string) {
    return this.request<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    })
  }

  async logout() {
    return this.request('/auth/logout', { method: 'POST' })
  }

  async getMe() {
    return this.request<{ user: User }>('/auth/me')
  }

  // Analytics methods
  async getRealTimeAnalytics(timeRange: string = '24h') {
    return this.request(`/analytics/realtime?timeRange=${timeRange}`)
  }

  // Leads methods
  async getLeads(params: {
    page?: number
    limit?: number
    industry?: string
    location?: string
    scoreMin?: number
  } = {}) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString())
      }
    })
    
    return this.request(`/leads?${searchParams}`)
  }

  async enrichLead(companyName: string) {
    return this.request('/leads/enrich', {
      method: 'POST',
      body: JSON.stringify({ company: companyName }),
    })
  }

  async scoreLead(leadData: any) {
    return this.request('/leads/score', {
      method: 'POST',
      body: JSON.stringify(leadData),
    })
  }

  // WebSocket connection for real-time updates
  connectWebSocket() {
    const wsUrl = `${this.baseUrl.replace('http', 'ws')}/api/websocket`
    return new WebSocket(wsUrl)
  }
}

export const apiClient = new ApiClient()
export type { ApiResponse, User }
