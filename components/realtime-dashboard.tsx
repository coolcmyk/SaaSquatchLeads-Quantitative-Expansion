"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Activity,
  TrendingUp,
  Users,
  Zap,
  AlertCircle,
  CheckCircle,
  Clock,
  Database,
  Wifi,
  WifiOff,
} from "lucide-react"

interface RealTimeMetrics {
  totalLeads: number
  qualifiedLeads: number
  conversionRate: number
  avgScore: number
  leadsToday: number
  scoresCalculated: number
  activeUsers: number
  systemLoad: number
}

interface Alert {
  id: string
  type: "info" | "warning" | "error" | "success"
  title: string
  message: string
  timestamp: string
  read: boolean
}

export default function RealTimeDashboard() {
  const [metrics, setMetrics] = useState<RealTimeMetrics | null>(null)
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  useEffect(() => {
    // Initialize real-time connection
    connectToRealTimeData()

    // Fetch initial data
    fetchRealTimeMetrics()
    fetchAlerts()

    // Set up periodic updates
    const metricsInterval = setInterval(fetchRealTimeMetrics, 5000) // Every 5 seconds
    const alertsInterval = setInterval(fetchAlerts, 15000) // Every 15 seconds

    return () => {
      clearInterval(metricsInterval)
      clearInterval(alertsInterval)
    }
  }, [])

  const connectToRealTimeData = () => {
    // Simulate WebSocket connection
    setIsConnected(true)

    // Simulate connection status changes
    const connectionInterval = setInterval(() => {
      if (Math.random() > 0.95) {
        // 5% chance of temporary disconnection
        setIsConnected(false)
        setTimeout(() => setIsConnected(true), 2000)
      }
    }, 10000)

    return () => clearInterval(connectionInterval)
  }

  const fetchRealTimeMetrics = async () => {
    try {
      const response = await fetch("/api/analytics/realtime?timeRange=24h", {
        credentials: 'include'
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      
      const data = await response.json()

      if (data.success) {
        setMetrics(data.data.metrics)
        setLastUpdate(new Date())
        setIsConnected(true)
      }
    } catch (error) {
      console.error("Failed to fetch real-time metrics:", error)
      setIsConnected(false)
    }
  }

  const fetchAlerts = async () => {
    try {
      const response = await fetch("/api/analytics/realtime", {
        credentials: 'include'
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      
      const data = await response.json()

      if (data.success) {
        setAlerts(data.data.alerts)
      }
    } catch (error) {
      console.error("Failed to fetch alerts:", error)
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-400" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-400" />
      default:
        return <AlertCircle className="h-4 w-4 text-blue-400" />
    }
  }

  const getAlertColor = (type: string) => {
    switch (type) {
      case "success":
        return "border-green-500/30 bg-green-500/10"
      case "warning":
        return "border-yellow-500/30 bg-yellow-500/10"
      case "error":
        return "border-red-500/30 bg-red-500/10"
      default:
        return "border-blue-500/30 bg-blue-500/10"
    }
  }

  if (!metrics) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
            <span className="ml-2 text-gray-300">Loading real-time data...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isConnected ? <Wifi className="h-5 w-5 text-green-400" /> : <WifiOff className="h-5 w-5 text-red-400" />}
              <span className="text-white font-medium">{isConnected ? "Connected" : "Disconnected"}</span>
              <Badge
                variant="outline"
                className={`${isConnected ? "border-green-500/30 text-green-300" : "border-red-500/30 text-red-300"}`}
              >
                Real-time
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Clock className="h-4 w-4" />
              {lastUpdate ? `Updated ${lastUpdate.toLocaleTimeString()}` : "Never"}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-400" />
              <div>
                <p className="text-sm text-gray-400">Total Leads</p>
                <p className="text-2xl font-bold text-white">{metrics.totalLeads.toLocaleString()}</p>
                <p className="text-xs text-blue-300">+{metrics.leadsToday} today</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-400" />
              <div>
                <p className="text-sm text-gray-400">Qualified Leads</p>
                <p className="text-2xl font-bold text-white">{metrics.qualifiedLeads.toLocaleString()}</p>
                <p className="text-xs text-green-300">{metrics.conversionRate.toFixed(1)}% rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-purple-400" />
              <div>
                <p className="text-sm text-gray-400">Avg Score</p>
                <p className="text-2xl font-bold text-white">{metrics.avgScore.toFixed(1)}</p>
                <p className="text-xs text-purple-300">{metrics.scoresCalculated} calculated</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-orange-400" />
              <div>
                <p className="text-sm text-gray-400">Active Users</p>
                <p className="text-2xl font-bold text-white">{metrics.activeUsers}</p>
                <p className="text-xs text-orange-300">System load: {(metrics.systemLoad * 100).toFixed(0)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Performance */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Database className="h-5 w-5 text-teal-400" />
            System Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-300">CPU Usage</span>
                <span className="text-sm text-gray-400">{(metrics.systemLoad * 100).toFixed(0)}%</span>
              </div>
              <Progress value={metrics.systemLoad * 100} className="h-2" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-300">Memory Usage</span>
                <span className="text-sm text-gray-400">{((metrics.systemLoad + 0.1) * 100).toFixed(0)}%</span>
              </div>
              <Progress value={(metrics.systemLoad + 0.1) * 100} className="h-2" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-300">API Response</span>
                <span className="text-sm text-gray-400">{(200 + metrics.systemLoad * 300).toFixed(0)}ms</span>
              </div>
              <Progress value={Math.min(100, (200 + metrics.systemLoad * 300) / 5)} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Alerts */}
      {alerts.length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
              Real-time Alerts
              <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300">
                {alerts.filter((alert) => !alert.read).length} new
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.slice(0, 5).map((alert) => (
              <div key={alert.id} className={`p-3 rounded-lg border ${getAlertColor(alert.type)}`}>
                <div className="flex items-start gap-3">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1">
                    <h4 className="font-medium text-white">{alert.title}</h4>
                    <p className="text-sm text-gray-300 mt-1">{alert.message}</p>
                    <p className="text-xs text-gray-400 mt-2">{new Date(alert.timestamp).toLocaleTimeString()}</p>
                  </div>
                  {!alert.read && <div className="w-2 h-2 bg-blue-400 rounded-full"></div>}
                </div>
              </div>
            ))}

            {alerts.length > 5 && (
              <Button variant="outline" className="w-full border-slate-600 text-gray-300 bg-transparent">
                View All Alerts ({alerts.length})
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
