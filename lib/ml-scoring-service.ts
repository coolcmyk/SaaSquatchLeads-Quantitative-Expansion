interface LeadInput {
  company: string
  website: string
  employees: string
  revenue: string
  industry: string
  techStack: string
}

interface MLPrediction {
  overall: number
  factors: {
    companySize: number
    industry: number
    technology: number
    funding: number
    growth: number
    engagement: number
  }
  recommendation: string
  priority: "high" | "medium" | "low"
  conversionProbability: number
  predictedDealSize: string
  timeToClose: string
  similarCompanies: string[]
  recommendations: string[]
  riskFactors: string[]
  marketTrends: {
    industryGrowth: number
    competitiveIndex: number
    demandScore: number
  }
}

export class MLScoringService {
  private industryWeights = {
    software: 0.95,
    fintech: 0.88,
    healthcare: 0.82,
    ecommerce: 0.79,
    manufacturing: 0.65,
    default: 0.7,
  }

  private techStackScores = {
    react: 15,
    "node.js": 12,
    python: 18,
    aws: 20,
    docker: 10,
    kubernetes: 15,
    ai: 25,
    "machine learning": 22,
    blockchain: 8,
  }

  async predictLeadScore(input: LeadInput): Promise<MLPrediction> {
    // Simulate ML processing time
    await new Promise((resolve) => setTimeout(resolve, 2500))

    // Advanced scoring algorithm
    const scores = this.calculateAdvancedScores(input)
    const marketAnalysis = this.analyzeMarketTrends(input.industry)
    const predictions = this.generatePredictions(input, scores)

    return {
      overall: scores.overall,
      factors: scores.factors,
      recommendation: this.generateRecommendation(scores.overall, input),
      priority: this.determinePriority(scores.overall, marketAnalysis),
      conversionProbability: predictions.conversionProbability,
      predictedDealSize: predictions.dealSize,
      timeToClose: predictions.timeToClose,
      similarCompanies: this.findSimilarCompanies(input),
      recommendations: this.generateActionableRecommendations(input, scores),
      riskFactors: this.identifyRiskFactors(input, scores),
      marketTrends: marketAnalysis,
    }
  }

  private calculateAdvancedScores(input: LeadInput) {
    // Company size scoring with ML-inspired logic
    const companySizeScore = this.scoreCompanySize(input.employees)

    // Industry alignment with market data
    const industryScore = this.scoreIndustry(input.industry)

    // Technology stack analysis
    const technologyScore = this.scoreTechnologyStack(input.techStack)

    // Revenue-based funding estimation
    const fundingScore = this.estimateFundingScore(input.revenue)

    // Growth indicators from multiple signals
    const growthScore = this.analyzeGrowthIndicators(input)

    // Engagement potential based on digital presence
    const engagementScore = this.scoreEngagementPotential(input.website, input.techStack)

    const factors = {
      companySize: companySizeScore,
      industry: industryScore,
      technology: technologyScore,
      funding: fundingScore,
      growth: growthScore,
      engagement: engagementScore,
    }

    // Weighted overall score with ML-inspired algorithm
    const overall = Math.round(
      companySizeScore * 0.2 +
        industryScore * 0.25 +
        technologyScore * 0.15 +
        fundingScore * 0.15 +
        growthScore * 0.15 +
        engagementScore * 0.1,
    )

    return { overall, factors }
  }

  private scoreCompanySize(employees: string): number {
    const sizeMap: { [key: string]: number } = {
      "1-10": 45,
      "11-50": 72,
      "51-200": 88,
      "201-1000": 95,
      "1000+": 85,
    }

    // Find matching range or estimate from string
    for (const [range, score] of Object.entries(sizeMap)) {
      if (employees.includes(range) || employees.toLowerCase().includes(range)) {
        return score
      }
    }

    // Extract numbers and estimate
    const numbers = employees.match(/\d+/g)
    if (numbers) {
      const size = Number.parseInt(numbers[0])
      if (size < 10) return 45
      if (size < 50) return 72
      if (size < 200) return 88
      if (size < 1000) return 95
      return 85
    }

    return 60 // Default
  }

  private scoreIndustry(industry: string): number {
    const industryLower = industry.toLowerCase()

    if (industryLower.includes("software") || industryLower.includes("saas")) return 92
    if (industryLower.includes("fintech") || industryLower.includes("financial")) return 88
    if (industryLower.includes("healthcare") || industryLower.includes("medical")) return 85
    if (industryLower.includes("ecommerce") || industryLower.includes("retail")) return 78
    if (industryLower.includes("ai") || industryLower.includes("machine learning")) return 95
    if (industryLower.includes("manufacturing")) return 65

    return 70 // Default
  }

  private scoreTechnologyStack(techStack: string): number {
    if (!techStack) return 50

    const techLower = techStack.toLowerCase()
    let score = 50

    // Add points for modern technologies
    Object.entries(this.techStackScores).forEach(([tech, points]) => {
      if (techLower.includes(tech)) {
        score += points
      }
    })

    return Math.min(score, 100)
  }

  private estimateFundingScore(revenue: string): number {
    if (!revenue) return 60

    const revenueLower = revenue.toLowerCase()

    if (revenueLower.includes("$100m") || revenueLower.includes("$1b")) return 95
    if (revenueLower.includes("$50m")) return 92
    if (revenueLower.includes("$25m")) return 88
    if (revenueLower.includes("$10m")) return 85
    if (revenueLower.includes("$5m")) return 80
    if (revenueLower.includes("$1m")) return 75

    return 70
  }

  private analyzeGrowthIndicators(input: LeadInput): number {
    let growthScore = 70 // Base score

    // Recent founding suggests growth phase
    const currentYear = new Date().getFullYear()
    if (
      input.company.includes("2020") ||
      input.company.includes("2021") ||
      input.company.includes("2022") ||
      input.company.includes("2023")
    ) {
      growthScore += 15
    }

    // Modern tech stack indicates growth investment
    if (
      input.techStack.toLowerCase().includes("cloud") ||
      input.techStack.toLowerCase().includes("aws") ||
      input.techStack.toLowerCase().includes("kubernetes")
    ) {
      growthScore += 10
    }

    // Industry growth correlation
    if (input.industry.toLowerCase().includes("ai") || input.industry.toLowerCase().includes("fintech")) {
      growthScore += 8
    }

    return Math.min(growthScore, 100)
  }

  private scoreEngagementPotential(website: string, techStack: string): number {
    let engagementScore = 60

    // Modern website suggests digital maturity
    if (website.includes(".com") || website.includes(".io")) {
      engagementScore += 10
    }

    // Modern tech stack suggests technical sophistication
    if (techStack.toLowerCase().includes("react") || techStack.toLowerCase().includes("node")) {
      engagementScore += 15
    }

    // API-first companies are easier to integrate with
    if (techStack.toLowerCase().includes("api") || techStack.toLowerCase().includes("rest")) {
      engagementScore += 7
    }

    return Math.min(engagementScore, 100)
  }

  private analyzeMarketTrends(industry: string) {
    const industryTrends: { [key: string]: any } = {
      software: { growth: 85, competitive: 78, demand: 92 },
      fintech: { growth: 88, competitive: 85, demand: 89 },
      healthcare: { growth: 75, competitive: 65, demand: 88 },
      ecommerce: { growth: 70, competitive: 90, demand: 82 },
      ai: { growth: 95, competitive: 88, demand: 94 },
      default: { growth: 65, competitive: 70, demand: 70 },
    }

    const industryKey = Object.keys(industryTrends).find((key) => industry.toLowerCase().includes(key)) || "default"

    return {
      industryGrowth: industryTrends[industryKey].growth,
      competitiveIndex: industryTrends[industryKey].competitive,
      demandScore: industryTrends[industryKey].demand,
    }
  }

  private generatePredictions(input: LeadInput, scores: any) {
    const baseConversion = 25
    const scoreBonus = Math.floor((scores.overall - 50) * 0.8)
    const conversionProbability = Math.max(5, Math.min(95, baseConversion + scoreBonus))

    // Deal size prediction based on company size and industry
    const dealSizes = {
      small: ["$5K", "$15K", "$25K"],
      medium: ["$50K", "$100K", "$150K"],
      large: ["$250K", "$500K", "$750K"],
      enterprise: ["$1M", "$2M", "$5M"],
    }

    let sizeCategory = "small"
    if (scores.factors.companySize > 85) sizeCategory = "enterprise"
    else if (scores.factors.companySize > 75) sizeCategory = "large"
    else if (scores.factors.companySize > 65) sizeCategory = "medium"

    const dealSize = dealSizes[sizeCategory as keyof typeof dealSizes][Math.floor(Math.random() * 3)]

    // Time to close prediction
    const timeToClose = scores.overall > 80 ? "2-3 months" : scores.overall > 60 ? "3-6 months" : "6-12 months"

    return {
      conversionProbability,
      dealSize,
      timeToClose,
    }
  }

  private findSimilarCompanies(input: LeadInput): string[] {
    const similarCompanies = [
      "TechFlow Solutions",
      "DataVision Analytics",
      "CloudScale Systems",
      "InnovateTech Corp",
      "NextGen Software",
      "Digital Transform Co",
      "SmartData Inc",
      "FutureTech Solutions",
      "AgileCloud Systems",
    ]

    // Return 3-4 random similar companies
    const shuffled = similarCompanies.sort(() => 0.5 - Math.random())
    return shuffled.slice(0, 3 + Math.floor(Math.random() * 2))
  }

  private generateActionableRecommendations(input: LeadInput, scores: any): string[] {
    const recommendations = []

    if (scores.overall > 80) {
      recommendations.push("Schedule demo within 48 hours - high conversion probability")
      recommendations.push("Prepare enterprise-level proposal with custom pricing")
    } else if (scores.overall > 60) {
      recommendations.push("Send personalized case study relevant to their industry")
      recommendations.push("Offer free trial or pilot program")
    } else {
      recommendations.push("Nurture with educational content for 2-3 months")
      recommendations.push("Focus on building relationship before pitching")
    }

    if (scores.factors.technology > 80) {
      recommendations.push("Highlight technical integration capabilities")
    }

    if (scores.factors.growth > 80) {
      recommendations.push("Emphasize scalability and growth support features")
    }

    return recommendations
  }

  private identifyRiskFactors(input: LeadInput, scores: any): string[] {
    const risks = []

    if (scores.factors.companySize < 60) {
      risks.push("Small company size may indicate budget constraints")
    }

    if (scores.factors.technology < 60) {
      risks.push("Limited technical infrastructure may slow implementation")
    }

    if (scores.factors.engagement < 60) {
      risks.push("Low digital engagement suggests longer sales cycle")
    }

    if (input.industry.toLowerCase().includes("manufacturing")) {
      risks.push("Traditional industry may have longer decision-making process")
    }

    return risks
  }

  private generateRecommendation(score: number, input: LeadInput): string {
    if (score >= 85) {
      return `Exceptional lead with ${score}% match score. This ${input.industry} company shows strong indicators for immediate engagement. Recommend priority outreach with executive-level messaging and custom demo preparation.`
    } else if (score >= 70) {
      return `Strong lead candidate with ${score}% match score. Good alignment with our target profile. Recommend personalized outreach within 24-48 hours with industry-specific value proposition.`
    } else if (score >= 55) {
      return `Moderate potential lead with ${score}% match score. Some alignment but may require longer nurturing cycle. Recommend educational content approach and relationship building.`
    } else {
      return `Lower priority lead with ${score}% match score. Limited alignment with ideal customer profile. Consider for long-term nurturing campaign or deprioritize for higher-value prospects.`
    }
  }

  private determinePriority(score: number, marketTrends: any): "high" | "medium" | "low" {
    // Adjust priority based on market trends
    const trendBonus = (marketTrends.industryGrowth + marketTrends.demandScore) / 20
    const adjustedScore = score + trendBonus

    if (adjustedScore >= 80) return "high"
    if (adjustedScore >= 60) return "medium"
    return "low"
  }
}
