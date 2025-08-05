"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Users, Mail, BarChart3, Download, Zap, Brain, Activity, Shield } from "lucide-react"
import { ProtectedLayout } from "@/components/protected-layout"
import { useAuth } from "@/contexts/auth-context"
import LeadScrapingTool from "@/components/lead-scraping-tool"
import EmailGeneratorTool from "@/components/email-generator-tool"
import LeadScoringTool from "@/components/lead-scoring-tool"
import CompanyEnrichmentTool from "@/components/company-enrichment-tool"
import LeadAnalyticsTool from "@/components/lead-analytics-tool"
import BulkExportTool from "@/components/bulk-export-tool"
import PredictiveAnalyticsTool from "@/components/predictive-analytics-tool"
import RealTimeDashboard from "@/components/realtime-dashboard"
import { AdminDashboard } from "@/components/admin-dashboard"

export default function SaaSquatchExpansion() {
  const [activeTab, setActiveTab] = useState("realtime")
  const { user } = useAuth()

  const tools = [
    {
      id: "realtime",
      name: "Real-time Dashboard",
      icon: Activity,
      description: "Live system metrics and alerts",
      color: "bg-red-500",
    },
    {
      id: "scraping",
      name: "Lead Scraping",
      icon: Search,
      description: "Extract leads from multiple sources",
      color: "bg-blue-500",
    },
    {
      id: "enrichment",
      name: "Company Enrichment",
      icon: Users,
      description: "Enrich company data with detailed insights",
      color: "bg-green-500",
    },
    {
      id: "scoring",
      name: "Lead Scoring",
      icon: BarChart3,
      description: "AI-powered lead qualification scoring",
      color: "bg-purple-500",
    },
    {
      id: "email",
      name: "Email Generator",
      icon: Mail,
      description: "Generate personalized outreach emails",
      color: "bg-orange-500",
    },
    {
      id: "analytics",
      name: "Lead Analytics",
      icon: BarChart3,
      description: "Analyze lead performance and trends",
      color: "bg-teal-500",
    },
    {
      id: "predictive",
      name: "Predictive ML",
      icon: Brain,
      description: "Advanced ML predictions and forecasting",
      color: "bg-purple-600",
    },
    {
      id: "export",
      name: "Bulk Export",
      icon: Download,
      description: "Export leads to various formats",
      color: "bg-indigo-500",
    },
  ]

  // Add admin tool for admin users
  const adminTools = user?.role === 'admin' ? [
    {
      id: "admin",
      name: "Admin Panel",
      icon: Shield,
      description: "Manage users and system settings",
      color: "bg-red-500",
    },
  ] : []

  const allTools = [...tools, ...adminTools]

  return (
    <ProtectedLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="h-8 w-8 text-blue-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              SaaSquatch Expansion Suite
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            A comprehensive collection of lightweight lead generation tools with real-time data integration and
            functional backend
          </p>
          <div className="flex items-center justify-center gap-4 mt-6">
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
              8 Integrated Tools
            </Badge>
            <Badge variant="secondary" className="bg-green-500/20 text-green-300">
              Real-time Data
            </Badge>
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
              ML-Powered
            </Badge>
            <Badge variant="secondary" className="bg-red-500/20 text-red-300">
              Live Backend
            </Badge>
          </div>
        </div>

        {/* Tool Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 mb-8 bg-slate-800/50">
            {allTools.map((tool) => {
              const Icon = tool.icon
              return (
                <TabsTrigger
                  key={tool.id}
                  value={tool.id}
                  className="flex flex-col items-center gap-1 p-3 data-[state=active]:bg-slate-700"
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-xs hidden sm:block">{tool.name}</span>
                </TabsTrigger>
              )
            })}
          </TabsList>

          {/* Tool Content */}
          <TabsContent value="realtime">
            <RealTimeDashboard />
          </TabsContent>

          <TabsContent value="scraping">
            <LeadScrapingTool />
          </TabsContent>

          <TabsContent value="enrichment">
            <CompanyEnrichmentTool />
          </TabsContent>

          <TabsContent value="scoring">
            <LeadScoringTool />
          </TabsContent>

          <TabsContent value="email">
            <EmailGeneratorTool />
          </TabsContent>

          <TabsContent value="analytics">
            <LeadAnalyticsTool />
          </TabsContent>

          <TabsContent value="predictive">
            <PredictiveAnalyticsTool />
          </TabsContent>

          <TabsContent value="export">
            <BulkExportTool />
          </TabsContent>

          {user?.role === 'admin' && (
            <TabsContent value="admin">
              <AdminDashboard />
            </TabsContent>
          )}
        </Tabs>

        {/* Footer */}
        <div className="mt-16 text-center text-gray-400">
          <p className="text-sm">Built for the Caprae Capital Partners AI-Readiness Challenge</p>
          <p className="text-xs mt-2">Enhanced with real-time data integration and functional backend</p>
        </div>
      </div>
    </ProtectedLayout>
  )
}
