import { type NextRequest, NextResponse } from "next/server"
import { EnrichmentService } from "@/lib/services/enrichment-service"
import { RealTimeDataService } from "@/lib/services/realtime-data-service"

export async function POST(request: NextRequest) {
  try {
    const { company, website } = await request.json()

    if (!company && !website) {
      return NextResponse.json({ error: "Company name or website is required" }, { status: 400 })
    }

    const enrichmentService = new EnrichmentService()
    const realTimeService = new RealTimeDataService()

    // Get real-time enrichment data
    const enrichedData = await realTimeService.enrichCompanyData({
      company,
      website,
    })

    // Store in database
    await enrichmentService.saveEnrichedData(enrichedData)

    return NextResponse.json({
      success: true,
      data: enrichedData,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error enriching company:", error)
    return NextResponse.json({ error: "Failed to enrich company data" }, { status: 500 })
  }
}
