interface Lead {
  id: string
  company: string
  website: string
  industry: string
  location: string
  employees: string
  revenue: string
  score?: number
  status: "new" | "qualified" | "contacted" | "converted" | "lost"
  createdAt: string
  updatedAt: string
}

interface LeadScore {
  leadId: string
  score: any
  timestamp: string
}

interface EnrichedData {
  id: string
  company: string
  data: any
  timestamp: string
}

export class DatabaseService {
  private leads: Map<string, Lead> = new Map()
  private scores: Map<string, LeadScore[]> = new Map()
  private enrichedData: Map<string, EnrichedData> = new Map()

  // Initialize with some mock data
  constructor() {
    this.initializeMockData()
  }

  private initializeMockData() {
    const mockLeads: Lead[] = [
      {
        id: "lead_1",
        company: "TechFlow Solutions",
        website: "https://techflow.com",
        industry: "Software Development",
        location: "San Francisco, CA",
        employees: "50-200",
        revenue: "$5M-$10M",
        score: 87,
        status: "qualified",
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "lead_2",
        company: "DataVision Analytics",
        website: "https://datavision.io",
        industry: "Data Analytics",
        location: "Austin, TX",
        employees: "25-50",
        revenue: "$1M-$5M",
        score: 73,
        status: "new",
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "lead_3",
        company: "CloudScale Systems",
        website: "https://cloudscale.net",
        industry: "Cloud Services",
        location: "Seattle, WA",
        employees: "100-500",
        revenue: "$10M-$50M",
        score: 91,
        status: "contacted",
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]

    mockLeads.forEach((lead) => {
      this.leads.set(lead.id, lead)
    })
  }

  async getLeads(options: {
    page: number
    limit: number
    filters?: {
      industry?: string
      location?: string
      scoreMin?: number
      status?: string
    }
  }): Promise<{ leads: Lead[]; total: number; page: number; limit: number }> {
    let filteredLeads = Array.from(this.leads.values())

    // Apply filters
    if (options.filters) {
      const { industry, location, scoreMin, status } = options.filters

      if (industry) {
        filteredLeads = filteredLeads.filter((lead) => lead.industry.toLowerCase().includes(industry.toLowerCase()))
      }

      if (location) {
        filteredLeads = filteredLeads.filter((lead) => lead.location.toLowerCase().includes(location.toLowerCase()))
      }

      if (scoreMin && typeof scoreMin === "number") {
        filteredLeads = filteredLeads.filter((lead) => (lead.score || 0) >= scoreMin)
      }

      if (status) {
        filteredLeads = filteredLeads.filter((lead) => lead.status === status)
      }
    }

    // Sort by updatedAt desc
    filteredLeads.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

    // Pagination
    const start = (options.page - 1) * options.limit
    const paginatedLeads = filteredLeads.slice(start, start + options.limit)

    return {
      leads: paginatedLeads,
      total: filteredLeads.length,
      page: options.page,
      limit: options.limit,
    }
  }

  async createLead(leadData: Omit<Lead, "id" | "createdAt" | "updatedAt">): Promise<Lead> {
    const lead: Lead = {
      ...leadData,
      id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    this.leads.set(lead.id, lead)
    return lead
  }

  async updateLead(id: string, updates: Partial<Lead>): Promise<Lead | null> {
    const lead = this.leads.get(id)
    if (!lead) return null

    const updatedLead = {
      ...lead,
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    this.leads.set(id, updatedLead)
    return updatedLead
  }

  async deleteLead(id: string): Promise<boolean> {
    return this.leads.delete(id)
  }

  async saveLeadScore(scoreData: LeadScore): Promise<void> {
    const existingScores = this.scores.get(scoreData.leadId) || []
    existingScores.push(scoreData)
    this.scores.set(scoreData.leadId, existingScores)

    // Update lead with latest score
    const lead = this.leads.get(scoreData.leadId)
    if (lead) {
      lead.score = scoreData.score.overall
      lead.updatedAt = new Date().toISOString()
      this.leads.set(scoreData.leadId, lead)
    }
  }

  async getLeadScores(leadId: string): Promise<LeadScore[]> {
    return this.scores.get(leadId) || []
  }

  async saveEnrichedData(data: any): Promise<void> {
    const enrichedData: EnrichedData = {
      id: `enriched_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      company: data.company,
      data,
      timestamp: new Date().toISOString(),
    }

    this.enrichedData.set(enrichedData.id, enrichedData)
  }

  async getEnrichedData(company: string): Promise<EnrichedData | null> {
    const entries = Array.from(this.enrichedData.values())
    return entries.find((entry) => entry.company.toLowerCase() === company.toLowerCase()) || null
  }

  async getAnalytics(timeRange: string): Promise<any> {
    const leads = Array.from(this.leads.values())
    const now = new Date()
    let startDate: Date

    switch (timeRange) {
      case "24h":
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
        break
      case "7d":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case "30d":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      default:
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    }

    const filteredLeads = leads.filter((lead) => new Date(lead.createdAt) >= startDate)

    const totalLeads = filteredLeads.length
    const qualifiedLeads = filteredLeads.filter((lead) => (lead.score || 0) >= 70).length
    const convertedLeads = filteredLeads.filter((lead) => lead.status === "converted").length

    const avgScore = filteredLeads.reduce((sum, lead) => sum + (lead.score || 0), 0) / (totalLeads || 1)

    const industryBreakdown = filteredLeads.reduce(
      (acc, lead) => {
        acc[lead.industry] = (acc[lead.industry] || 0) + 1
        return acc
      },
      {} as { [key: string]: number },
    )

    return {
      totalLeads,
      qualifiedLeads,
      convertedLeads,
      conversionRate: totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0,
      avgScore: Math.round(avgScore * 10) / 10,
      industryBreakdown,
      timeRange,
      generatedAt: new Date().toISOString(),
    }
  }

  async searchLeads(query: string): Promise<Lead[]> {
    const leads = Array.from(this.leads.values())
    const searchTerm = query.toLowerCase()

    return leads.filter(
      (lead) =>
        lead.company.toLowerCase().includes(searchTerm) ||
        lead.industry.toLowerCase().includes(searchTerm) ||
        lead.location.toLowerCase().includes(searchTerm) ||
        lead.website.toLowerCase().includes(searchTerm),
    )
  }

  // Real-time data simulation
  async simulateRealTimeUpdates(): Promise<void> {
    setInterval(() => {
      // Randomly update some leads
      const leads = Array.from(this.leads.values())
      const randomLead = leads[Math.floor(Math.random() * leads.length)]

      if (randomLead) {
        randomLead.score = Math.max(0, Math.min(100, (randomLead.score || 50) + (Math.random() - 0.5) * 10))
        randomLead.updatedAt = new Date().toISOString()
        this.leads.set(randomLead.id, randomLead)
      }
    }, 10000) // Update every 10 seconds
  }
}
