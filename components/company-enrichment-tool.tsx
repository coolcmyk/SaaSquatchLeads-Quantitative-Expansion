"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Users, Building, Globe, DollarSign, MapPin, Calendar, Loader2, ExternalLink } from "lucide-react"

interface EnrichedData {
  company: string
  website: string
  description: string
  industry: string
  founded: string
  employees: string
  revenue: string
  location: string
  technologies: string[]
  socialMedia: {
    linkedin: string
    twitter: string
  }
  keyContacts: Array<{
    name: string
    title: string
    email: string
    linkedin: string
  }>
  recentNews: Array<{
    title: string
    date: string
    source: string
  }>
}

export default function CompanyEnrichmentTool() {
  const [isEnriching, setIsEnriching] = useState(false)
  const [enrichedData, setEnrichedData] = useState<EnrichedData | null>(null)
  const [companyInput, setCompanyInput] = useState("")

  const enrichCompany = async () => {
    setIsEnriching(true)
    setEnrichedData(null)

    try {
      const response = await fetch("/api/enrichment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ company: companyInput, website: companyInput }),
      })

      if (!response.ok) {
        throw new Error("Enrichment request failed")
      }

      const data = await response.json()
      setEnrichedData(data)
    } catch (error) {
      console.error("Failed to enrich company data:", error)
      // Optionally, set an error state to display to the user
    } finally {
      setIsEnriching(false)
    }
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Users className="h-5 w-5 text-green-400" />
          Company Enrichment Engine
        </CardTitle>
        <CardDescription className="text-gray-300">
          Get comprehensive company insights, contacts, and intelligence data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input */}
        <div className="flex gap-4">
          <div className="flex-1 space-y-2">
            <Label htmlFor="company" className="text-gray-300">
              Company Name or Website
            </Label>
            <Input
              id="company"
              placeholder="TechFlow Solutions or techflow.com"
              value={companyInput}
              onChange={(e) => setCompanyInput(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white placeholder-gray-400"
            />
          </div>
          <div className="flex items-end">
            <Button
              onClick={enrichCompany}
              disabled={isEnriching || !companyInput}
              className="bg-green-600 hover:bg-green-700"
            >
              {isEnriching ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enriching...
                </>
              ) : (
                <>
                  <Building className="mr-2 h-4 w-4" />
                  Enrich
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Enriched Data */}
        {enrichedData && (
          <div className="space-y-6">
            {/* Company Overview */}
            <Card className="bg-slate-700/50 border-slate-600">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">{enrichedData.company}</CardTitle>
                  <Badge variant="secondary" className="bg-green-500/20 text-green-300">
                    Verified
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300">{enrichedData.description}</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-blue-400" />
                    <div>
                      <p className="text-xs text-gray-400">Industry</p>
                      <p className="text-sm text-white">{enrichedData.industry}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-400" />
                    <div>
                      <p className="text-xs text-gray-400">Founded</p>
                      <p className="text-sm text-white">{enrichedData.founded}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-400" />
                    <div>
                      <p className="text-xs text-gray-400">Employees</p>
                      <p className="text-sm text-white">{enrichedData.employees}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-blue-400" />
                    <div>
                      <p className="text-xs text-gray-400">Revenue</p>
                      <p className="text-sm text-white">{enrichedData.revenue}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-400" />
                    <span className="text-sm text-gray-300">{enrichedData.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-blue-400" />
                    <a
                      href={enrichedData.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-400 hover:underline flex items-center gap-1"
                    >
                      {enrichedData.website}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-300 mb-2">Technology Stack</p>
                  <div className="flex flex-wrap gap-2">
                    {enrichedData.technologies.map((tech) => (
                      <Badge key={tech} variant="outline" className="border-slate-600 text-gray-300">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Contacts */}
            <Card className="bg-slate-700/50 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white">Key Contacts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {enrichedData.keyContacts.map((contact, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-white">{contact.name}</h4>
                          <p className="text-sm text-gray-400">{contact.title}</p>
                          <p className="text-sm text-blue-400">{contact.email}</p>
                        </div>
                        <Button size="sm" variant="outline" className="border-slate-600 text-gray-300 bg-transparent">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          LinkedIn
                        </Button>
                      </div>
                      {index < enrichedData.keyContacts.length - 1 && <Separator className="mt-4 bg-slate-600" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent News */}
            <Card className="bg-slate-700/50 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white">Recent News & Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {enrichedData.recentNews.map((news, index) => (
                    <div key={index} className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-white">{news.title}</h4>
                        <p className="text-sm text-gray-400">
                          {news.source} • {news.date}
                        </p>
                      </div>
                      <Badge variant="outline" className="border-slate-600 text-gray-300">
                        News
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
