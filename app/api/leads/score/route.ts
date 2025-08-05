import { type NextRequest, NextResponse } from "next/server"
import { MLScoringService } from "@/lib/ml-scoring-service"
import { RealTimeDataService } from "@/lib/services/realtime-data-service"
import { DatabaseService } from "@/lib/services/database-service"

export async function POST(request: NextRequest) {
  try {
    const leadData = await request.json()

    const mlService = new MLScoringService()
    const realTimeService = new RealTimeDataService()
    const dbService = new DatabaseService()

    // Get real-time market data for enhanced scoring
    const marketData = await realTimeService.getMarketData(leadData.industry)

    // Calculate ML score with real-time data
    const score = await mlService.predictLeadScore({
      ...leadData,
      marketData,
    })

    // Store scoring result
    await dbService.saveLeadScore({
      leadId: leadData.leadId || `lead_${Date.now()}`,
      score,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({
      success: true,
      score,
      marketData,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error scoring lead:", error)
    return NextResponse.json({ error: "Failed to score lead" }, { status: 500 })
  }
}
