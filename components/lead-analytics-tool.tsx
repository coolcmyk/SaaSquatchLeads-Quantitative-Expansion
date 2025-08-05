"use client"

import { useState } from "react"
import * as XLSX from "xlsx"
import jsPDF from "jspdf"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart3, TrendingUp, Users, Target, Calendar } from "lucide-react"

interface AnalyticsData {
  totalLeads: number
  qualifiedLeads: number
  conversionRate: number
  avgScore: number
  topIndustries: Array<{ name: string; count: number; percentage: number }>
  monthlyTrends: Array<{ month: string; leads: number; qualified: number }>
  scoreDistribution: Array<{ range: string; count: number; percentage: number }>
}

export default function LeadAnalyticsTool() {
  const [timeRange, setTimeRange] = useState("30d")
  const [analyticsData] = useState<AnalyticsData>({
    totalLeads: 1247,
    qualifiedLeads: 423,
    conversionRate: 33.9,
    avgScore: 72.4,
    topIndustries: [
      { name: "Software Development", count: 312, percentage: 25.0 },
      { name: "Financial Services", count: 187, percentage: 15.0 },
      { name: "Healthcare", count: 156, percentage: 12.5 },
      { name: "E-commerce", count: 124, percentage: 9.9 },
      { name: "Manufacturing", count: 98, percentage: 7.9 },
    ],
    monthlyTrends: [
      { month: "Oct", leads: 89, qualified: 31 },
      { month: "Nov", leads: 156, qualified: 52 },
      { month: "Dec", leads: 203, qualified: 71 },
      { month: "Jan", leads: 287, qualified: 98 },
      { month: "Feb", leads: 312, qualified: 108 },
      { month: "Mar", leads: 200, qualified: 63 },
    ],
    scoreDistribution: [
      { range: "90-100", count: 89, percentage: 7.1 },
      { range: "80-89", count: 187, percentage: 15.0 },
      { range: "70-79", count: 312, percentage: 25.0 },
      { range: "60-69", count: 298, percentage: 23.9 },
      { range: "50-59", count: 234, percentage: 18.8 },
      { range: "0-49", count: 127, percentage: 10.2 },
    ],
  })

  const getScoreColor = (range: string) => {
    if (range.startsWith("90") || range.startsWith("80")) return "bg-green-500"
    if (range.startsWith("70") || range.startsWith("60")) return "bg-yellow-500"
    return "bg-red-500"
  }

  const handleExport = () => {
    const wb = XLSX.utils.book_new();

    // Key Metrics
    const metrics = [
      { Metric: 'Total Leads', Value: analyticsData.totalLeads },
      { Metric: 'Qualified Leads', Value: analyticsData.qualifiedLeads },
      { Metric: 'Conversion Rate', Value: `${analyticsData.conversionRate}%` },
      { Metric: 'Avg Lead Score', Value: analyticsData.avgScore },
    ];
    const wsMetrics = XLSX.utils.json_to_sheet(metrics);
    XLSX.utils.book_append_sheet(wb, wsMetrics, 'Key Metrics');

    // Top Industries
    const wsIndustries = XLSX.utils.json_to_sheet(analyticsData.topIndustries);
    XLSX.utils.book_append_sheet(wb, wsIndustries, 'Top Industries');

    // Monthly Trends
    const wsTrends = XLSX.utils.json_to_sheet(analyticsData.monthlyTrends);
    XLSX.utils.book_append_sheet(wb, wsTrends, 'Monthly Trends');

    // Score Distribution
    const wsScores = XLSX.utils.json_to_sheet(analyticsData.scoreDistribution);
    XLSX.utils.book_append_sheet(wb, wsScores, 'Score Distribution');

    XLSX.writeFile(wb, 'lead_analytics.xlsx');
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <BarChart3 className="h-5 w-5 text-teal-400" />
          Lead Analytics Dashboard
        </CardTitle>
        <CardDescription className="text-gray-300">
          Comprehensive analytics and insights for your lead generation performance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Time Range Selector */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Performance Overview</h3>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32 bg-slate-700 border-slate-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600">
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-slate-700/50 border-slate-600">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-400" />
                <div>
                  <p className="text-sm text-gray-400">Total Leads</p>
                  <p className="text-2xl font-bold text-white">{analyticsData.totalLeads.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-700/50 border-slate-600">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-400" />
                <div>
                  <p className="text-sm text-gray-400">Qualified Leads</p>
                  <p className="text-2xl font-bold text-white">{analyticsData.qualifiedLeads.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-700/50 border-slate-600">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-400" />
                <div>
                  <p className="text-sm text-gray-400">Conversion Rate</p>
                  <p className="text-2xl font-bold text-white">{analyticsData.conversionRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-700/50 border-slate-600">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-orange-400" />
                <div>
                  <p className="text-sm text-gray-400">Avg Lead Score</p>
                  <p className="text-2xl font-bold text-white">{analyticsData.avgScore}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Industries */}
        <Card className="bg-slate-700/50 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white">Top Industries</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analyticsData.topIndustries.map((industry, index) => (
              <div key={industry.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-300">{industry.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">{industry.count} leads</span>
                    <Badge variant="outline" className="border-slate-600 text-gray-300">
                      {industry.percentage}%
                    </Badge>
                  </div>
                </div>
                <Progress value={industry.percentage} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Monthly Trends */}
        <Card className="bg-slate-700/50 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white">Monthly Lead Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.monthlyTrends.map((month) => (
                <div key={month.month} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-300 w-12">{month.month}</span>
                  <div className="flex-1 mx-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-600 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${(month.leads / 350) * 100}%` }}
                        />
                      </div>
                      <div className="flex-1 bg-slate-600 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${(month.qualified / 120) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-white">
                      {month.leads} / {month.qualified}
                    </p>
                    <p className="text-xs text-gray-400">Total / Qualified</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-slate-600">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full" />
                <span className="text-sm text-gray-300">Total Leads</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span className="text-sm text-gray-300">Qualified Leads</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Score Distribution */}
        <Card className="bg-slate-700/50 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white">Lead Score Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analyticsData.scoreDistribution.map((score) => (
              <div key={score.range} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-300">Score {score.range}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">{score.count} leads</span>
                    <Badge className={`${getScoreColor(score.range)} text-white`}>{score.percentage}%</Badge>
                  </div>
                </div>
                <Progress value={score.percentage} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Export Options */}
        <div className="flex gap-4">
          <Button variant="outline" className="border-slate-600 text-gray-300 bg-transparent">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Report
          </Button>
          <Button className="bg-teal-600 hover:bg-teal-700" onClick={handleExport}>
            <TrendingUp className="mr-2 h-4 w-4" />
            Export Analytics
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
