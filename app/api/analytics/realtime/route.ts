import { type NextRequest, NextResponse } from "next/server"
import { AnalyticsService } from "@/lib/services/analytics-service"
import { RealTimeDataService } from "@/lib/services/realtime-data-service"
import { getAuthenticatedUser } from "@/lib/middleware/auth"

export async function GET(request: NextRequest) {
  try {
    console.log('Analytics request received, checking auth...')
    // Check authentication
    const user = await getAuthenticatedUser(request)
    if (!user) {
      console.log('Analytics request - no authenticated user')
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    console.log('Analytics request - user authenticated:', user.email)

    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get("timeRange") || "24h"

    const analyticsService = new AnalyticsService()
    const realTimeService = new RealTimeDataService()

    // Get real-time analytics data
    const [metrics, trends, alerts] = await Promise.all([
      analyticsService.getRealTimeMetrics(timeRange),
      realTimeService.getTrendingData(),
      analyticsService.getActiveAlerts(),
    ])

    return NextResponse.json({
      success: true,
      data: {
        metrics,
        trends,
        alerts,
        lastUpdated: new Date().toISOString(),
        user: { id: user.id, name: user.name, role: user.role },
      },
    })
  } catch (error) {
    console.error("Error fetching real-time analytics:", error)
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
