import { RealTimeDataService } from "./realtime-data-service"
import { DatabaseService } from "./database-service"

export class EnrichmentService {
  private realTimeService: RealTimeDataService
  private dbService: DatabaseService

  constructor() {
    this.realTimeService = new RealTimeDataService()
    this.dbService = new DatabaseService()
  }

  async enrichCompany(input: { company: string; website: string }) {
    try {
      // Check if we have recent enriched data
      const existingData = await this.dbService.getEnrichedData(input.company)

      if (existingData && this.isDataFresh(existingData.timestamp)) {
        return existingData.data
      }

      // Get fresh enrichment data
      const enrichedData = await this.realTimeService.enrichCompanyData(input)

      // Save to database
      await this.saveEnrichedData(enrichedData)

      return enrichedData
    } catch (error) {
      console.error("Enrichment failed:", error)
      throw error
    }
  }

  async saveEnrichedData(data: any) {
    return this.dbService.saveEnrichedData(data)
  }

  private isDataFresh(timestamp: string): boolean {
    const dataAge = Date.now() - new Date(timestamp).getTime()
    const maxAge = 24 * 60 * 60 * 1000 // 24 hours
    return dataAge < maxAge
  }
}
