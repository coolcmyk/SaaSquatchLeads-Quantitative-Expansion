"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BarChart3, TrendingUp, AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { MLScoringService } from "@/lib/ml-scoring-service"

interface ScoringFactors {
  companySize: number
  industry: number
  technology: number
  funding: number
  growth: number
  engagement: number
}

interface LeadScore {
  overall: number
  factors: ScoringFactors
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

export default function LeadScoringTool() {
  const [isScoring, setIsScoring] = useState(false)
  const [leadScore, setLeadScore] = useState<LeadScore | null>(null)
  const [leadData, setLeadData] = useState({
    company: "",
    website: "",
    employees: "",
    revenue: "",
    industry: "",
    techStack: "",
  })

  const scoreFactors = [
    { key: "companySize", label: "Company Size", weight: 20 },
    { key: "industry", label: "Industry Match", weight: 25 },
    { key: "technology", label: "Technology Stack", weight: 15 },
    { key: "funding", label: "Funding Status", weight: 15 },
    { key: "growth", label: "Growth Indicators", weight: 15 },
    { key: "engagement", label: "Engagement Potential", weight: 10 },
  ]

  const calculateScore = async () => {
    setIsScoring(true)

    try {
      // Use ML service for advanced scoring
      const mlService = new MLScoringService()
      const score = await mlService.predictLeadScore({
        company: leadData.company,
        website: leadData.website,
        employees: leadData.employees,
        revenue: leadData.revenue,
        industry: leadData.industry,
        techStack: leadData.techStack,
      })

      setLeadScore(score)
    } catch (error) {
      console.error("Scoring failed:", error)
    } finally {
      setIsScoring(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-green-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400"
    if (score >= 60) return "text-yellow-400"
    return "text-red-400"
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <BarChart3 className="h-5 w-5 text-purple-400" />
          AI Lead Scoring Engine
        </CardTitle>
        <CardDescription className="text-gray-300">
          Advanced ML-powered lead qualification with detailed scoring breakdown
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Lead Input */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="company" className="text-gray-300">
              Company Name
            </Label>
            <Input
              id="company"
              placeholder="TechFlow Solutions"
              value={leadData.company}
              onChange={(e) => setLeadData((prev) => ({ ...prev, company: e.target.value }))}
              className="bg-slate-700 border-slate-600 text-white placeholder-gray-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website" className="text-gray-300">
              Website
            </Label>
            <Input
              id="website"
              placeholder="techflow.com"
              value={leadData.website}
              onChange={(e) => setLeadData((prev) => ({ ...prev, website: e.target.value }))}
              className="bg-slate-700 border-slate-600 text-white placeholder-gray-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="employees" className="text-gray-300">
              Employee Count
            </Label>
            <Input
              id="employees"
              placeholder="50-200"
              value={leadData.employees}
              onChange={(e) => setLeadData((prev) => ({ ...prev, employees: e.target.value }))}
              className="bg-slate-700 border-slate-600 text-white placeholder-gray-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="revenue" className="text-gray-300">
              Annual Revenue
            </Label>
            <Input
              id="revenue"
              placeholder="$5M-$10M"
              value={leadData.revenue}
              onChange={(e) => setLeadData((prev) => ({ ...prev, revenue: e.target.value }))}
              className="bg-slate-700 border-slate-600 text-white placeholder-gray-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="industry" className="text-gray-300">
              Industry
            </Label>
            <Input
              id="industry"
              placeholder="Software Development"
              value={leadData.industry}
              onChange={(e) => setLeadData((prev) => ({ ...prev, industry: e.target.value }))}
              className="bg-slate-700 border-slate-600 text-white placeholder-gray-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="techStack" className="text-gray-300">
              Technology Stack
            </Label>
            <Input
              id="techStack"
              placeholder="React, Node.js, AWS"
              value={leadData.techStack}
              onChange={(e) => setLeadData((prev) => ({ ...prev, techStack: e.target.value }))}
              className="bg-slate-700 border-slate-600 text-white placeholder-gray-400"
            />
          </div>
        </div>

        <Button
          onClick={calculateScore}
          disabled={isScoring || !leadData.company || !leadData.website}
          className="w-full bg-purple-600 hover:bg-purple-700"
        >
          {isScoring ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing Lead...
            </>
          ) : (
            <>
              <TrendingUp className="mr-2 h-4 w-4" />
              Calculate Lead Score
            </>
          )}
        </Button>

        {/* Scoring Results */}
        {leadScore && (
          <div className="space-y-6">
            {/* Overall Score */}
            <Card className="bg-slate-700/50 border-slate-600">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white">Overall Lead Score</h3>
                  <div className="flex items-center gap-2">
                    <span className={`text-3xl font-bold ${getScoreColor(leadScore.overall)}`}>
                      {leadScore.overall}
                    </span>
                    <Badge className={`${getPriorityColor(leadScore.priority)} text-white`}>
                      {leadScore.priority.toUpperCase()} PRIORITY
                    </Badge>
                  </div>
                </div>
                <Progress value={leadScore.overall} className="h-3 mb-4" />
                <div className="flex items-start gap-2">
                  {leadScore.priority === "high" ? (
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5" />
                  )}
                  <p className="text-sm text-gray-300">{leadScore.recommendation}</p>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Breakdown */}
            <Card className="bg-slate-700/50 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white">Scoring Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {scoreFactors.map((factor) => {
                  const score = leadScore.factors[factor.key as keyof ScoringFactors]
                  return (
                    <div key={factor.key} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-300">
                          {factor.label} ({factor.weight}% weight)
                        </span>
                        <span className={`text-sm font-semibold ${getScoreColor(score)}`}>{score}/100</span>
                      </div>
                      <Progress value={score} className="h-2" />
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>
        )}

        {/* ML Insights */}
        {leadScore && (
          <Card className="bg-slate-700/50 border-slate-600">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-400" />
                ML Insights & Predictions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-white">Conversion Probability</h4>
                  <div className="flex items-center gap-2">
                    <Progress value={leadScore.conversionProbability} className="flex-1" />
                    <span className="text-sm font-semibold text-green-400">{leadScore.conversionProbability}%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-white">Deal Size Prediction</h4>
                  <p className="text-lg font-semibold text-blue-400">${leadScore.predictedDealSize}</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-white">Similar Companies</h4>
                <div className="flex flex-wrap gap-2">
                  {leadScore.similarCompanies.map((company, index) => (
                    <Badge key={index} variant="outline" className="border-slate-600 text-gray-300">
                      {company}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-white">Recommended Actions</h4>
                <ul className="space-y-1">
                  {leadScore.recommendations.map((rec, index) => (
                    <li key={index} className="text-sm text-gray-300 flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  )
}
