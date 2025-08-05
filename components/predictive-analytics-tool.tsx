"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  TrendingUp,
  Brain,
  Target,
  Calendar,
  DollarSign,
  Users,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Zap,
} from "lucide-react"

interface PredictiveModel {
  name: string
  accuracy: number
  lastTrained: string
  predictions: number
  status: "active" | "training" | "inactive"
}

interface MarketPrediction {
  industry: string
  growthForecast: number
  demandTrend: "increasing" | "stable" | "decreasing"
  competitiveIndex: number
  opportunityScore: number
  timeframe: string
}

interface ConversionPrediction {
  leadId: string
  company: string
  currentScore: number
  predictedConversion: number
  timeToClose: string
  dealSize: string
  confidence: number
  riskFactors: string[]
}

export default function PredictiveAnalyticsTool() {
  const [selectedModel, setSelectedModel] = useState("conversion")
  const [timeHorizon, setTimeHorizon] = useState("30d")
  const [isGenerating, setIsGenerating] = useState(false)

  const [models] = useState<PredictiveModel[]>([
    {
      name: "Conversion Predictor",
      accuracy: 87.3,
      lastTrained: "2024-01-15",
      predictions: 1247,
      status: "active",
    },
    {
      name: "Deal Size Estimator",
      accuracy: 82.1,
      lastTrained: "2024-01-14",
      predictions: 892,
      status: "active",
    },
    {
      name: "Churn Risk Analyzer",
      accuracy: 91.5,
      lastTrained: "2024-01-16",
      predictions: 456,
      status: "active",
    },
    {
      name: "Market Trend Forecaster",
      accuracy: 78.9,
      lastTrained: "2024-01-13",
      predictions: 234,
      status: "training",
    },
  ])

  const [marketPredictions] = useState<MarketPrediction[]>([
    {
      industry: "AI/Machine Learning",
      growthForecast: 94.2,
      demandTrend: "increasing",
      competitiveIndex: 78,
      opportunityScore: 92,
      timeframe: "Next 6 months",
    },
    {
      industry: "FinTech",
      growthForecast: 87.5,
      demandTrend: "increasing",
      competitiveIndex: 85,
      opportunityScore: 88,
      timeframe: "Next 6 months",
    },
    {
      industry: "Healthcare Tech",
      growthForecast: 82.1,
      demandTrend: "stable",
      competitiveIndex: 72,
      opportunityScore: 85,
      timeframe: "Next 6 months",
    },
    {
      industry: "E-commerce",
      growthForecast: 75.3,
      demandTrend: "stable",
      competitiveIndex: 91,
      opportunityScore: 78,
      timeframe: "Next 6 months",
    },
  ])

  const [conversionPredictions] = useState<ConversionPrediction[]>([
    {
      leadId: "L001",
      company: "TechFlow Solutions",
      currentScore: 87,
      predictedConversion: 92,
      timeToClose: "2-3 months",
      dealSize: "$150K",
      confidence: 89,
      riskFactors: ["Budget approval pending", "Multiple stakeholders"],
    },
    {
      leadId: "L002",
      company: "DataVision Analytics",
      currentScore: 73,
      predictedConversion: 68,
      timeToClose: "4-6 months",
      dealSize: "$75K",
      confidence: 76,
      riskFactors: ["Technical integration complexity", "Competitive evaluation"],
    },
    {
      leadId: "L003",
      company: "CloudScale Systems",
      currentScore: 91,
      predictedConversion: 95,
      timeToClose: "1-2 months",
      dealSize: "$250K",
      confidence: 94,
      riskFactors: ["Contract negotiation timeline"],
    },
  ])

  const getModelStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "training":
        return "bg-blue-500"
      case "inactive":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "increasing":
        return <TrendingUp className="h-4 w-4 text-green-400" />
      case "stable":
        return <BarChart3 className="h-4 w-4 text-yellow-400" />
      case "decreasing":
        return <TrendingUp className="h-4 w-4 text-red-400 rotate-180" />
      default:
        return <BarChart3 className="h-4 w-4 text-gray-400" />
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return "text-green-400"
    if (confidence >= 70) return "text-yellow-400"
    return "text-red-400"
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Brain className="h-5 w-5 text-purple-400" />
          Predictive Analytics Engine
        </CardTitle>
        <CardDescription className="text-gray-300">
          Advanced ML models for lead conversion prediction, market forecasting, and trend analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Model Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {models.map((model) => (
            <Card key={model.name} className="bg-slate-700/50 border-slate-600">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge className={`${getModelStatusColor(model.status)} text-white text-xs`}>
                    {model.status.toUpperCase()}
                  </Badge>
                  <span className="text-sm font-semibold text-green-400">{model.accuracy}%</span>
                </div>
                <h4 className="font-medium text-white text-sm mb-1">{model.name}</h4>
                <p className="text-xs text-gray-400">{model.predictions} predictions</p>
                <p className="text-xs text-gray-500">Updated {model.lastTrained}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Predictive Analytics Tabs */}
        <Tabs defaultValue="conversions" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
            <TabsTrigger value="conversions" className="data-[state=active]:bg-slate-700">
              Conversion Predictions
            </TabsTrigger>
            <TabsTrigger value="market" className="data-[state=active]:bg-slate-700">
              Market Forecasting
            </TabsTrigger>
            <TabsTrigger value="trends" className="data-[state=active]:bg-slate-700">
              Trend Analysis
            </TabsTrigger>
          </TabsList>

          {/* Conversion Predictions */}
          <TabsContent value="conversions" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Lead Conversion Predictions</h3>
              <Select value={timeHorizon} onValueChange={setTimeHorizon}>
                <SelectTrigger className="w-32 bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="30d">30 days</SelectItem>
                  <SelectItem value="60d">60 days</SelectItem>
                  <SelectItem value="90d">90 days</SelectItem>
                  <SelectItem value="180d">6 months</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              {conversionPredictions.map((prediction) => (
                <Card key={prediction.leadId} className="bg-slate-700/50 border-slate-600">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-white">{prediction.company}</h4>
                        <p className="text-sm text-gray-400">Lead ID: {prediction.leadId}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <span className={`text-lg font-bold ${getConfidenceColor(prediction.confidence)}`}>
                            {prediction.predictedConversion}%
                          </span>
                          <Badge variant="outline" className="border-slate-600 text-gray-300">
                            {prediction.confidence}% confidence
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-blue-400" />
                        <div>
                          <p className="text-xs text-gray-400">Time to Close</p>
                          <p className="text-sm text-white">{prediction.timeToClose}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-400" />
                        <div>
                          <p className="text-xs text-gray-400">Predicted Deal Size</p>
                          <p className="text-sm text-white">{prediction.dealSize}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-purple-400" />
                        <div>
                          <p className="text-xs text-gray-400">Current Score</p>
                          <p className="text-sm text-white">{prediction.currentScore}/100</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-300">Risk Factors:</p>
                      <div className="flex flex-wrap gap-2">
                        {prediction.riskFactors.map((risk, index) => (
                          <Badge key={index} variant="outline" className="border-red-500/30 text-red-300 bg-red-500/10">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            {risk}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Progress value={prediction.predictedConversion} className="mt-3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Market Forecasting */}
          <TabsContent value="market" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Market Growth Forecasting</h3>
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
                AI-Powered Predictions
              </Badge>
            </div>

            <div className="grid gap-4">
              {marketPredictions.map((market) => (
                <Card key={market.industry} className="bg-slate-700/50 border-slate-600">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-white">{market.industry}</h4>
                        <p className="text-sm text-gray-400">{market.timeframe}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getTrendIcon(market.demandTrend)}
                        <span className="text-sm text-gray-300 capitalize">{market.demandTrend}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Growth Forecast</p>
                        <div className="flex items-center gap-2">
                          <Progress value={market.growthForecast} className="flex-1" />
                          <span className="text-sm font-semibold text-green-400">{market.growthForecast}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Competitive Index</p>
                        <div className="flex items-center gap-2">
                          <Progress value={market.competitiveIndex} className="flex-1" />
                          <span className="text-sm font-semibold text-yellow-400">{market.competitiveIndex}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Opportunity Score</p>
                        <div className="flex items-center gap-2">
                          <Progress value={market.opportunityScore} className="flex-1" />
                          <span className="text-sm font-semibold text-purple-400">{market.opportunityScore}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {market.opportunityScore > 85 ? (
                          <CheckCircle className="h-4 w-4 text-green-400" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-yellow-400" />
                        )}
                        <span className="text-sm text-gray-300">
                          {market.opportunityScore > 85 ? "High Opportunity" : "Moderate Opportunity"}
                        </span>
                      </div>
                      <Button size="sm" variant="outline" className="border-slate-600 text-gray-300 bg-transparent">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Trend Analysis */}
          <TabsContent value="trends" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Advanced Trend Analysis</h3>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Zap className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
            </div>

            {/* Key Insights */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-green-400" />
                    <h4 className="font-semibold text-black">Conversion Trend</h4>
                  </div>
                  <p className="text-2xl font-bold text-black mb-1">+23%</p>
                  <p className="text-sm text-gray-800">vs. last quarter</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-5 w-5 text-blue-400" />
                    <h4 className="font-semibold text-black">Deal Size Growth</h4>
                  </div>
                  <p className="text-2xl font-bold text-black mb-1">+18%</p>
                  <p className="text-sm text-gray-800">average increase</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-5 w-5 text-purple-400" />
                    <h4 className="font-semibold text-black">Lead Quality</h4>
                  </div>
                  <p className="text-2xl font-bold text-black mb-1">87.3%</p>
                  <p className="text-sm text-gray-800">qualification rate</p>
                </CardContent>
              </Card>
            </div>

            {/* Seasonal Patterns */}
            <Card className="bg-slate-700/50 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white">Seasonal Patterns & Predictions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-white mb-3">Q1 2024 Predictions</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">Lead Volume</span>
                        <div className="flex items-center gap-2">
                          <Progress value={78} className="w-20" />
                          <span className="text-sm text-green-400">+12%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">Conversion Rate</span>
                        <div className="flex items-center gap-2">
                          <Progress value={85} className="w-20" />
                          <span className="text-sm text-green-400">+8%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">Deal Velocity</span>
                        <div className="flex items-center gap-2">
                          <Progress value={72} className="w-20" />
                          <span className="text-sm text-yellow-400">-5%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-white mb-3">Industry Hotspots</h4>
                    <div className="space-y-2">
                      <Badge className="bg-green-500/20 text-green-300 mr-2">AI/ML (+45%)</Badge>
                      <Badge className="bg-blue-500/20 text-blue-300 mr-2">FinTech (+32%)</Badge>
                      <Badge className="bg-purple-500/20 text-purple-300 mr-2">HealthTech (+28%)</Badge>
                      <Badge className="bg-yellow-500/20 text-yellow-300 mr-2">EdTech (+15%)</Badge>
                    </div>
                    <p className="text-sm text-gray-400 mt-3">
                      Predicted growth rates for next quarter based on current market trends and historical data.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
