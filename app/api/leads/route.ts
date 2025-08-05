import { type NextRequest, NextResponse } from "next/server"
import { LeadService } from "@/lib/services/lead-service"
import { RealTimeDataService } from "@/lib/services/realtime-data-service"
import { getAuthenticatedUser } from "@/lib/middleware/auth"

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const industry = searchParams.get("industry")
    const location = searchParams.get("location")
    const scoreMin = searchParams.get("scoreMin")

    const leadService = new LeadService()
    const leads = await leadService.getLeads({
      page,
      limit,
      filters: {
        industry,
        location,
        scoreMin: scoreMin ? Number.parseInt(scoreMin) : undefined,
      },
    })

    return NextResponse.json(leads)
  } catch (error) {
    console.error("Error fetching leads:", error)
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { searchParams } = body

    const realTimeService = new RealTimeDataService()
    const leads = await realTimeService.scrapeLeads(searchParams)

    return NextResponse.json({
      success: true,
      leads,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error scraping leads:", error)
    return NextResponse.json({ error: "Failed to scrape leads" }, { status: 500 })
  }
}
