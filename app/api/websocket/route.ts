import type { NextRequest } from "next/server"
import { WebSocketService } from "@/lib/services/websocket-service"
import { getAuthenticatedUser } from "@/lib/middleware/auth"

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const user = await getAuthenticatedUser(request)
    if (!user) {
      return new Response("Authentication required", { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get("clientId") || user.id

    const wsService = new WebSocketService()
    return wsService.handleConnection(request, clientId, user)
  } catch (error) {
    console.error("WebSocket connection error:", error)
    return new Response("WebSocket connection failed", { status: 500 })
  }
}
