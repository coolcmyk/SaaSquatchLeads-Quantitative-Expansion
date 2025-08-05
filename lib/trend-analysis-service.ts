interface TrendData {
  period: string
  leads: number
  conversions: number
  dealSize: number
  velocity: number
}

interface SeasonalPattern {
  month: string
  multiplier: number
  confidence: number
}

interface IndustryTrend {
  industry: string
  growth: number
  volatility: number
  prediction: number
}

export class TrendAnalysisService {
  private historicalData: TrendData[] = [
    { period: "2023-Q1", leads: 1200, conversions: 360, dealSize: 85000, velocity: 45 },
    { period: "2023-Q2", leads: 1450, conversions: 435, dealSize: 92000, velocity: 42 },
    { period: "2023-Q3", leads: 1100, conversions: 330, dealSize: 78000, velocity: 48 },
    { period: "2023-Q4", leads: 1680, conversions: 504, dealSize: 105000, velocity: 38 },
    { period: "2024-Q1", leads: 1520, conversions: 456, dealSize: 98000, velocity: 41 },
  ]

  private seasonalPatterns: SeasonalPattern[] = [
    { month: "January", multiplier: 1.15, confidence: 0.87 },
    { month: "February", multiplier: 1.08, confidence: 0.82 },
    { month: "March", multiplier: 1.12, confidence: 0.85 },
    { month: "April", multiplier: 0.95, confidence: 0.78 },
    { month: "May", multiplier: 0.88, confidence: 0.81 },
    { month: "June", multiplier: 0.92, confidence: 0.79 },
    { month: "July", multiplier: 0.85, confidence: 0.76 },
    { month: "August", multiplier: 0.82, confidence: 0.74 },
    { month: "September", multiplier: 1.05, confidence: 0.83 },
    { month: "October", multiplier: 1.18, confidence: 0.89 },
    { month: "November", multiplier: 1.22, confidence: 0.91 },
    { month: "December", multiplier: 0.95, confidence: 0.77 },
  ]

  async analyzeTrends(timeframe = "12m"): Promise<any> {
    // Simulate analysis processing
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const trends = this.calculateTrends()
    const predictions = this.generatePredictions(timeframe)
    const seasonality = this.analyzeSeasonality()
    const industryTrends = this.analyzeIndustryTrends()

    return {
      trends,
      predictions,
      seasonality,
      industryTrends,
      insights: this.generateInsights(trends, predictions),
    }
  }

  private calculateTrends() {
    const recent = this.historicalData.slice(-4)
    const older = this.historicalData.slice(0, -4)

    const recentAvg = {
      leads: recent.reduce((sum, d) => sum + d.leads, 0) / recent.length,
      conversions: recent.reduce((sum, d) => sum + d.conversions, 0) / recent.length,
      dealSize: recent.reduce((sum, d) => sum + d.dealSize, 0) / recent.length,
      velocity: recent.reduce((sum, d) => sum + d.velocity, 0) / recent.length,
    }

    const olderAvg = {
      leads: older.reduce((sum, d) => sum + d.leads, 0) / older.length,
      conversions: older.reduce((sum, d) => sum + d.conversions, 0) / older.length,
      dealSize: older.reduce((sum, d) => sum + d.dealSize, 0) / older.length,
      velocity: older.reduce((sum, d) => sum + d.velocity, 0) / older.length,
    }

    return {
      leadGrowth: ((recentAvg.leads - olderAvg.leads) / olderAvg.leads) * 100,
      conversionGrowth: ((recentAvg.conversions - olderAvg.conversions) / olderAvg.conversions) * 100,
      dealSizeGrowth: ((recentAvg.dealSize - olderAvg.dealSize) / olderAvg.dealSize) * 100,
      velocityChange: ((recentAvg.velocity - olderAvg.velocity) / olderAvg.velocity) * 100,
    }
  }

  private generatePredictions(timeframe: string) {
    const latest = this.historicalData[this.historicalData.length - 1]
    const growthRate = 0.08 // 8% quarterly growth assumption

    const periods = timeframe === "12m" ? 4 : timeframe === "6m" ? 2 : 1
    const predictions = []

    for (let i = 1; i <= periods; i++) {
      const seasonalMultiplier = this.getSeasonalMultiplier(i)
      predictions.push({
        period: `2024-Q${i + 1}`,
        predictedLeads: Math.round(latest.leads * Math.pow(1 + growthRate, i) * seasonalMultiplier),
        predictedConversions: Math.round(latest.conversions * Math.pow(1 + growthRate, i) * seasonalMultiplier),
        predictedDealSize: Math.round(latest.dealSize * Math.pow(1.05, i)), // 5% deal size growth
        confidence: Math.max(0.6, 0.9 - i * 0.1), // Decreasing confidence over time
      })
    }

    return predictions
  }

  private getSeasonalMultiplier(quarterOffset: number): number {
    // Simplified seasonal adjustment
    const seasonalFactors = [1.15, 0.92, 0.85, 1.08] // Q1, Q2, Q3, Q4
    const currentQuarter = 1 // Assuming we're in Q1
    const targetQuarter = (currentQuarter + quarterOffset - 1) % 4
    return seasonalFactors[targetQuarter]
  }

  private analyzeSeasonality() {
    return {
      strongestMonth: "November",
      weakestMonth: "August",
      seasonalVariation: 0.47, // 47% variation between peak and trough
      patterns: this.seasonalPatterns.slice(0, 6), // Next 6 months
    }
  }

  private analyzeIndustryTrends(): IndustryTrend[] {
    return [
      { industry: "AI/Machine Learning", growth: 45.2, volatility: 0.23, prediction: 52.1 },
      { industry: "FinTech", growth: 32.1, volatility: 0.18, prediction: 38.7 },
      { industry: "HealthTech", growth: 28.5, volatility: 0.15, prediction: 31.2 },
      { industry: "EdTech", growth: 15.3, volatility: 0.22, prediction: 18.9 },
      { industry: "E-commerce", growth: 8.7, volatility: 0.31, prediction: 12.4 },
    ]
  }

  private generateInsights(trends: any, predictions: any) {
    const insights = []

    if (trends.leadGrowth > 15) {
      insights.push({
        type: "positive",
        title: "Strong Lead Growth",
        description: `Lead volume has increased by ${trends.leadGrowth.toFixed(1)}% indicating strong market demand.`,
        action: "Consider scaling outreach efforts to capitalize on increased demand.",
      })
    }

    if (trends.conversionGrowth > 10) {
      insights.push({
        type: "positive",
        title: "Improving Conversion Rates",
        description: `Conversion rates have improved by ${trends.conversionGrowth.toFixed(1)}%, suggesting better lead quality or sales process optimization.`,
        action: "Document and replicate successful conversion strategies across all channels.",
      })
    }

    if (trends.dealSizeGrowth > 20) {
      insights.push({
        type: "positive",
        title: "Deal Size Expansion",
        description: `Average deal size has grown by ${trends.dealSizeGrowth.toFixed(1)}%, indicating successful upselling or premium positioning.`,
        action: "Focus on enterprise accounts and premium service offerings.",
      })
    }

    if (trends.velocityChange < -10) {
      insights.push({
        type: "warning",
        title: "Slower Sales Velocity",
        description: `Sales velocity has decreased by ${Math.abs(trends.velocityChange).toFixed(1)}%, indicating longer sales cycles.`,
        action: "Review sales process for bottlenecks and consider sales enablement improvements.",
      })
    }

    return insights
  }

  async generateForecastReport(options: any = {}) {
    const analysis = await this.analyzeTrends(options.timeframe)

    return {
      executiveSummary: this.generateExecutiveSummary(analysis),
      keyMetrics: this.extractKeyMetrics(analysis),
      recommendations: this.generateRecommendations(analysis),
      riskFactors: this.identifyRiskFactors(analysis),
      generatedAt: new Date().toISOString(),
    }
  }

  private generateExecutiveSummary(analysis: any) {
    return `Based on ML analysis of historical performance data, lead generation shows ${analysis.trends.leadGrowth > 0 ? "positive" : "negative"} momentum with ${Math.abs(analysis.trends.leadGrowth).toFixed(1)}% growth in lead volume. Conversion rates have ${analysis.trends.conversionGrowth > 0 ? "improved" : "declined"} by ${Math.abs(analysis.trends.conversionGrowth).toFixed(1)}%, while average deal sizes show ${analysis.trends.dealSizeGrowth > 0 ? "expansion" : "contraction"} of ${Math.abs(analysis.trends.dealSizeGrowth).toFixed(1)}%. Predictive models indicate continued ${analysis.predictions[0].confidence > 0.8 ? "strong" : "moderate"} performance in the coming quarters.`
  }

  private extractKeyMetrics(analysis: any) {
    return {
      leadGrowthRate: `${analysis.trends.leadGrowth.toFixed(1)}%`,
      conversionImprovement: `${analysis.trends.conversionGrowth.toFixed(1)}%`,
      dealSizeChange: `${analysis.trends.dealSizeGrowth.toFixed(1)}%`,
      velocityChange: `${analysis.trends.velocityChange.toFixed(1)}%`,
      seasonalPeak: analysis.seasonality.strongestMonth,
      topGrowthIndustry: analysis.industryTrends[0].industry,
    }
  }

  private generateRecommendations(analysis: any) {
    const recommendations = []

    if (analysis.trends.leadGrowth > 20) {
      recommendations.push("Scale marketing spend and sales team capacity to handle increased lead volume")
    }

    if (analysis.seasonality.seasonalVariation > 0.3) {
      recommendations.push("Implement seasonal staffing and budget allocation strategies")
    }

    if (analysis.industryTrends[0].growth > 40) {
      recommendations.push(`Focus expansion efforts on ${analysis.industryTrends[0].industry} sector`)
    }

    return recommendations
  }

  private identifyRiskFactors(analysis: any) {
    const risks = []

    if (analysis.trends.velocityChange < -15) {
      risks.push("Significant slowdown in sales velocity may impact revenue targets")
    }

    if (analysis.predictions[0].confidence < 0.7) {
      risks.push("High market volatility reduces prediction accuracy")
    }

    analysis.industryTrends.forEach((trend) => {
      if (trend.volatility > 0.25) {
        risks.push(`High volatility in ${trend.industry} sector increases forecast uncertainty`)
      }
    })

    return risks
  }
}
