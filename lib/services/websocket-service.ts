import type { NextRequest } from "next/server"

interface WebSocketClient {
  id: string
  userId?: string
  socket: WebSocket
  subscriptions: Set<string>
  lastActivity: Date
}

export class WebSocketService {
  private clients = new Map<string, WebSocketClient>()
  private channels = new Map<string, Set<string>>() // channel -> client IDs

  async handleConnection(request: NextRequest, clientId: string, user?: any) {
    try {
      const { socket, response } = await this.upgradeConnection(request)

      const client: WebSocketClient = {
        id: clientId,
        userId: user?.id,
        socket,
        subscriptions: new Set(),
        lastActivity: new Date(),
      }

      this.clients.set(clientId, client)

      socket.onmessage = (event) => {
        this.handleMessage(clientId, JSON.parse(event.data))
      }

      socket.onclose = () => {
        this.handleDisconnection(clientId)
      }

      socket.onerror = (error) => {
        console.error(`WebSocket error for client ${clientId}:`, error)
        this.handleDisconnection(clientId)
      }

      // Send welcome message
      this.sendToClient(clientId, {
        type: "connected",
        clientId,
        timestamp: new Date().toISOString(),
      })

      return response
    } catch (error) {
      console.error("WebSocket upgrade failed:", error)
      throw error
    }
  }

  private async upgradeConnection(request: NextRequest): Promise<{ socket: WebSocket; response: Response }> {
    // In a real implementation, this would handle WebSocket upgrade
    // For now, we'll simulate the WebSocket connection
    throw new Error("WebSocket upgrade not implemented in this demo")
  }

  private handleMessage(clientId: string, message: any) {
    const client = this.clients.get(clientId)
    if (!client) return

    client.lastActivity = new Date()

    switch (message.type) {
      case "subscribe":
        this.handleSubscription(clientId, message.channel)
        break
      case "unsubscribe":
        this.handleUnsubscription(clientId, message.channel)
        break
      case "ping":
        this.sendToClient(clientId, { type: "pong", timestamp: new Date().toISOString() })
        break
      default:
        console.log(`Unknown message type: ${message.type}`)
    }
  }

  private handleSubscription(clientId: string, channel: string) {
    const client = this.clients.get(clientId)
    if (!client) return

    client.subscriptions.add(channel)

    if (!this.channels.has(channel)) {
      this.channels.set(channel, new Set())
    }
    this.channels.get(channel)!.add(clientId)

    this.sendToClient(clientId, {
      type: "subscribed",
      channel,
      timestamp: new Date().toISOString(),
    })

    // Start sending real-time updates for this channel
    this.startChannelUpdates(channel)
  }

  private handleUnsubscription(clientId: string, channel: string) {
    const client = this.clients.get(clientId)
    if (!client) return

    client.subscriptions.delete(channel)
    this.channels.get(channel)?.delete(clientId)

    this.sendToClient(clientId, {
      type: "unsubscribed",
      channel,
      timestamp: new Date().toISOString(),
    })
  }

  private handleDisconnection(clientId: string) {
    const client = this.clients.get(clientId)
    if (!client) return

    // Remove from all channels
    client.subscriptions.forEach((channel) => {
      this.channels.get(channel)?.delete(clientId)
    })

    this.clients.delete(clientId)
    console.log(`Client ${clientId} disconnected`)
  }

  private sendToClient(clientId: string, message: any) {
    const client = this.clients.get(clientId)
    if (!client || client.socket.readyState !== WebSocket.OPEN) return

    try {
      client.socket.send(JSON.stringify(message))
    } catch (error) {
      console.error(`Failed to send message to client ${clientId}:`, error)
      this.handleDisconnection(clientId)
    }
  }

  private broadcastToChannel(channel: string, message: any) {
    const clientIds = this.channels.get(channel)
    if (!clientIds) return

    clientIds.forEach((clientId) => {
      this.sendToClient(clientId, {
        ...message,
        channel,
        timestamp: new Date().toISOString(),
      })
    })
  }

  private startChannelUpdates(channel: string) {
    // Prevent duplicate intervals
    if (this.channelIntervals.has(channel)) return

    const interval = setInterval(() => {
      this.sendChannelUpdate(channel)
    }, this.getUpdateInterval(channel))

    this.channelIntervals.set(channel, interval)
  }

  private channelIntervals = new Map<string, NodeJS.Timeout>()

  private getUpdateInterval(channel: string): number {
    const intervals: { [key: string]: number } = {
      leads: 5000, // 5 seconds
      analytics: 10000, // 10 seconds
      scoring: 15000, // 15 seconds
      market: 30000, // 30 seconds
    }
    return intervals[channel] || 10000
  }

  private async sendChannelUpdate(channel: string) {
    const clientIds = this.channels.get(channel)
    if (!clientIds || clientIds.size === 0) {
      // No subscribers, stop updates
      const interval = this.channelIntervals.get(channel)
      if (interval) {
        clearInterval(interval)
        this.channelIntervals.delete(channel)
      }
      return
    }

    let updateData: any

    switch (channel) {
      case "leads":
        updateData = await this.getLeadsUpdate()
        break
      case "analytics":
        updateData = await this.getAnalyticsUpdate()
        break
      case "scoring":
        updateData = await this.getScoringUpdate()
        break
      case "market":
        updateData = await this.getMarketUpdate()
        break
      default:
        return
    }

    this.broadcastToChannel(channel, {
      type: "update",
      data: updateData,
    })
  }

  private async getLeadsUpdate() {
    return {
      newLeads: Math.floor(Math.random() * 5),
      totalLeads: 1247 + Math.floor(Math.random() * 100),
      qualifiedLeads: 423 + Math.floor(Math.random() * 50),
      conversionRate: 33.9 + (Math.random() - 0.5) * 2,
    }
  }

  private async getAnalyticsUpdate() {
    return {
      activeUsers: Math.floor(Math.random() * 50) + 100,
      leadsProcessed: Math.floor(Math.random() * 20) + 50,
      avgScore: 72.4 + (Math.random() - 0.5) * 5,
      topIndustry: "Software Development",
    }
  }

  private async getScoringUpdate() {
    return {
      modelsActive: 4,
      predictionsToday: Math.floor(Math.random() * 100) + 200,
      avgAccuracy: 87.3 + (Math.random() - 0.5) * 2,
      highPriorityLeads: Math.floor(Math.random() * 10) + 15,
    }
  }

  private async getMarketUpdate() {
    return {
      trendingIndustries: [
        { name: "AI/ML", growth: 45.2 + (Math.random() - 0.5) * 5 },
        { name: "FinTech", growth: 32.1 + (Math.random() - 0.5) * 3 },
      ],
      marketVolatility: Math.random() * 0.1 + 0.15,
      opportunityIndex: Math.floor(Math.random() * 10) + 85,
    }
  }

  // Public methods for triggering updates
  public triggerLeadUpdate(leadData: any) {
    this.broadcastToChannel("leads", {
      type: "lead_update",
      data: leadData,
    })
  }

  public triggerScoringUpdate(scoreData: any) {
    this.broadcastToChannel("scoring", {
      type: "score_update",
      data: scoreData,
    })
  }

  public triggerAlert(alert: any) {
    // Broadcast to all connected clients
    this.clients.forEach((client, clientId) => {
      this.sendToClient(clientId, {
        type: "alert",
        data: alert,
        timestamp: new Date().toISOString(),
      })
    })
  }
}
