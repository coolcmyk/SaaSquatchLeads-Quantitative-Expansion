import { DatabaseService } from "./database-service"

interface RealTimeMetrics {
  totalLeads: number
  qualifiedLeads: number
  conversionRate: number
  avgScore: number
  leadsToday: number
  scoresCalculated: number
  activeUsers: number
  systemLoad: number
}

interface Alert {
  id: string
  type: "info" | "warning" | "error" | "success"
  title: string
  message: string
  timestamp: string
  read: boolean
}

export class AnalyticsService {
  private dbService: DatabaseService

  constructor() {
    this.dbService = new DatabaseService()
  }

  async getRealTimeMetrics(timeRange: string): Promise<RealTimeMetrics> {
    const analytics = await this.dbService.getAnalytics(timeRange)

    // Add real-time specific metrics
    const realTimeMetrics: RealTimeMetrics = {
      totalLeads: analytics.totalLeads,
      qualifiedLeads: analytics.qualifiedLeads,
      conversionRate: analytics.conversionRate,
      avgScore: analytics.avgScore,
      leadsToday: Math.floor(Math.random() * 50) + 20,
      scoresCalculated: Math.floor(Math.random() * 200) + 100,
      activeUsers: Math.floor(Math.random() * 25) + 5,
      systemLoad: Math.random() * 0.3 + 0.1, // 10-40% load
    }

    return realTimeMetrics
  }

  async getActiveAlerts(): Promise<Alert[]> {
    // Simulate dynamic alerts based on system state
    const alerts: Alert[] = []

    // Random alert generation for demo
    if (Math.random() > 0.7) {
      alerts.push({
        id: `alert_${Date.now()}`,
        type: "success",
        title: "High-Value Lead Detected",
        message: "A lead with 95+ score has been identified in the AI/ML sector",
        timestamp: new Date().toISOString(),
        read: false,
      })
    }

    if (Math.random() > 0.8) {
      alerts.push({
        id: `alert_${Date.now() + 1}`,
        type: "warning",
        title: "API Rate Limit Approaching",
        message: "Enrichment API usage at 85% of daily limit",
        timestamp: new Date().toISOString(),
        read: false,
      })
    }

    if (Math.random() > 0.9) {
      alerts.push({
        id: `alert_${Date.now() + 2}`,
        type: "info",
        title: "Market Trend Update",
        message: "FinTech sector showing 32% growth this quarter",
        timestamp: new Date().toISOString(),
        read: false,
      })
    }

    return alerts
  }

  async getPerformanceMetrics(): Promise<any> {
    return {
      apiResponseTimes: {
        enrichment: Math.random() * 500 + 200, // 200-700ms
        scoring: Math.random() * 300 + 100, // 100-400ms
        scraping: Math.random() * 1000 + 500, // 500-1500ms
      },
      successRates: {
        enrichment: 0.95 + Math.random() * 0.04, // 95-99%
        scoring: 0.98 + Math.random() * 0.02, // 98-100%
        scraping: 0.88 + Math.random() * 0.1, // 88-98%
      },
      dataQuality: {
        completeness: 0.92 + Math.random() * 0.06, // 92-98%
        accuracy: 0.89 + Math.random() * 0.08, // 89-97%
        freshness: 0.95 + Math.random() * 0.04, // 95-99%
      },
    }
  }

  async getTrendAnalysis(period: string): Promise<any> {
    const periods = {
      "1h": 1,
      "24h": 24,
      "7d": 168,
      "30d": 720,
    }

    const hours = periods[period as keyof typeof periods] || 24
    const dataPoints = Math.min(hours, 50) // Limit data points for performance

    const trendData = []
    const now = new Date()

    for (let i = dataPoints - 1; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * (hours / dataPoints) * 60 * 60 * 1000)

      trendData.push({
        timestamp: timestamp.toISOString(),
        leads: Math.floor(Math.random() * 20) + 10,
        conversions: Math.floor(Math.random() * 5) + 2,
        avgScore: Math.random() * 20 + 70,
        apiCalls: Math.floor(Math.random() * 100) + 50,
      })
    }

    return {
      period,
      dataPoints: trendData,
      summary: {
        totalLeads: trendData.reduce((sum, point) => sum + point.leads, 0),
        totalConversions: trendData.reduce((sum, point) => sum + point.conversions, 0),
        avgScore: trendData.reduce((sum, point) => sum + point.avgScore, 0) / trendData.length,
        trend: Math.random() > 0.5 ? "increasing" : "stable",
      },
    }
  }

  async generateInsights(): Promise<any[]> {
    const insights = []

    // Performance insights
    const metrics = await this.getPerformanceMetrics()

    if (metrics.successRates.enrichment < 0.9) {
      insights.push({
        type: "performance",
        severity: "warning",
        title: "Enrichment Success Rate Below Threshold",
        description: `Current success rate: ${(metrics.successRates.enrichment * 100).toFixed(1)}%`,
        recommendation: "Check API connectivity and rate limits",
        impact: "medium",
      })
    }

    if (metrics.apiResponseTimes.scoring > 300) {
      insights.push({
        type: "performance",
        severity: "info",
        title: "Scoring Response Time Elevated",
        description: `Average response time: ${metrics.apiResponseTimes.scoring.toFixed(0)}ms`,
        recommendation: "Consider optimizing ML model inference",
        impact: "low",
      })
    }

    // Business insights
    const analytics = await this.dbService.getAnalytics("7d")

    if (analytics.conversionRate > 35) {
      insights.push({
        type: "business",
        severity: "success",
        title: "High Conversion Rate Detected",
        description: `Current conversion rate: ${analytics.conversionRate.toFixed(1)}%`,
        recommendation: "Scale successful strategies to increase lead volume",
        impact: "high",
      })
    }

    if (analytics.avgScore < 65) {
      insights.push({
        type: "business",
        severity: "warning",
        title: "Lead Quality Declining",
        description: `Average lead score: ${analytics.avgScore}`,
        recommendation: "Review lead sources and qualification criteria",
        impact: "medium",
      })
    }

    return insights
  }
}
