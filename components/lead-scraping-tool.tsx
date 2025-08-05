"use client"

import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Building, MapPin, Users, Loader2 } from "lucide-react"

interface Lead {
  id: string
  company: string
  website: string
  industry: string
  location: string
  employees: string
  revenue: string
  confidence: number
}

export default function LeadScrapingTool() {
  const [isLoading, setIsLoading] = useState(false)
  const [leads, setLeads] = useState<Lead[]>([])
  const [searchParams, setSearchParams] = useState({
    industry: "",
    location: "",
    companySize: "",
    keywords: "",
  })

  const mockLeads: Lead[] = [
    {
      id: "1",
      company: "TechFlow Solutions",
      website: "techflow.com",
      industry: "Software Development",
      location: "San Francisco, CA",
      employees: "50-200",
      revenue: "$5M-$10M",
      confidence: 92,
    },
    {
      id: "2",
      company: "DataVision Analytics",
      website: "datavision.io",
      industry: "Data Analytics",
      location: "Austin, TX",
      employees: "25-50",
      revenue: "$1M-$5M",
      confidence: 87,
    },
    {
      id: "3",
      company: "CloudScale Systems",
      website: "cloudscale.net",
      industry: "Cloud Services",
      location: "Seattle, WA",
      employees: "100-500",
      revenue: "$10M-$50M",
      confidence: 95,
    },
  ]

  const handleSearch = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setLeads(mockLeads)
    setIsLoading(false)
  }

  const [isEnriching, setIsEnriching] = useState(false);
  const [enrichedData, setEnrichedData] = useState<any>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const handleEnrich = async (website: string) => {
    setIsEnriching(true);
    try {
      const response = await fetch('/api/enrichment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ website }),
      });
      const data = await response.json();
      setEnrichedData(data);
      setIsAlertOpen(true);
    } catch (error) {
      console.error('Enrichment failed:', error);
    }
    setIsEnriching(false);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "bg-green-500"
    if (confidence >= 80) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Search className="h-5 w-5 text-blue-400" />
          Lead Scraping Tool
        </CardTitle>
        <CardDescription className="text-gray-300">
          Extract targeted leads from multiple data sources with advanced filtering
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search Parameters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="industry" className="text-gray-300">
              Industry
            </Label>
            <Select
              value={searchParams.industry}
              onValueChange={(value) => setSearchParams((prev) => ({ ...prev, industry: value }))}
            >
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="software">Software Development</SelectItem>
                <SelectItem value="fintech">Financial Technology</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="ecommerce">E-commerce</SelectItem>
                <SelectItem value="saas">SaaS</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-gray-300">
              Location
            </Label>
            <Input
              id="location"
              placeholder="e.g., San Francisco, CA"
              value={searchParams.location}
              onChange={(e) => setSearchParams((prev) => ({ ...prev, location: e.target.value }))}
              className="bg-slate-700 border-slate-600 text-white placeholder-gray-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="companySize" className="text-gray-300">
              Company Size
            </Label>
            <Select
              value={searchParams.companySize}
              onValueChange={(value) => setSearchParams((prev) => ({ ...prev, companySize: value }))}
            >
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="1-10">1-10 employees</SelectItem>
                <SelectItem value="11-50">11-50 employees</SelectItem>
                <SelectItem value="51-200">51-200 employees</SelectItem>
                <SelectItem value="201-1000">201-1000 employees</SelectItem>
                <SelectItem value="1000+">1000+ employees</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="keywords" className="text-gray-300">
              Keywords
            </Label>
            <Input
              id="keywords"
              placeholder="e.g., AI, machine learning"
              value={searchParams.keywords}
              onChange={(e) => setSearchParams((prev) => ({ ...prev, keywords: e.target.value }))}
              className="bg-slate-700 border-slate-600 text-white placeholder-gray-400"
            />
          </div>
        </div>

        <Button onClick={handleSearch} disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Scraping Leads...
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Start Scraping
            </>
          )}
        </Button>

        {/* Results */}
        {leads.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Found {leads.length} leads</h3>
              <Badge variant="secondary" className="bg-green-500/20 text-green-300">
                High Quality
              </Badge>
            </div>

            <div className="grid gap-4">
              {leads.map((lead) => (
                <Card key={lead.id} className="bg-slate-700/50 border-slate-600">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-blue-400" />
                          <h4 className="font-semibold text-white">{lead.company}</h4>
                          <Badge className={`${getConfidenceColor(lead.confidence)} text-white text-xs`}>
                            {lead.confidence}% match
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-300">{lead.website}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {lead.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {lead.employees}
                          </span>
                          <span>{lead.revenue}</span>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="border-slate-600 text-gray-300 bg-transparent" onClick={() => handleEnrich(lead.website)} disabled={isEnriching}>
                        {isEnriching ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Enrich'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
        <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Enrichment Results</AlertDialogTitle>
              <AlertDialogDescription>
                {enrichedData ? (
                  <pre>{JSON.stringify(enrichedData, null, 2)}</pre>
                ) : (
                  <p>No data found.</p>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  )
}
