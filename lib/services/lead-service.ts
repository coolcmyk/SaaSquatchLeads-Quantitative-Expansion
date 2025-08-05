import { DatabaseService } from "./database-service"
import { RealTimeDataService } from "./realtime-data-service"
import { MLScoringService } from "../ml-scoring-service"

export class LeadService {
  private dbService: DatabaseService
  private realTimeService: RealTimeDataService
  private mlService: MLScoringService

  constructor() {
    this.dbService = new DatabaseService()
    this.realTimeService = new RealTimeDataService()
    this.mlService = new MLScoringService()
  }

  async getLeads(options: any) {
    return this.dbService.getLeads(options)
  }

  async createLead(leadData: any) {
    const lead = await this.dbService.createLead(leadData)

    // Automatically score new leads
    if (lead.company && lead.industry) {
      try {
        const score = await this.mlService.predictLeadScore({
          company: lead.company,
          website: lead.website || "",
          employees: lead.employees || "",
          revenue: lead.revenue || "",
          industry: lead.industry,
          techStack: "",
        })

        await this.dbService.saveLeadScore({
          leadId: lead.id,
          score,
          timestamp: new Date().toISOString(),
        })
      } catch (error) {
        console.error("Auto-scoring failed:", error)
      }
    }

    return lead
  }

  async updateLead(id: string, updates: any) {
    return this.dbService.updateLead(id, updates)
  }

  async deleteLead(id: string) {
    return this.dbService.deleteLead(id)
  }

  async searchLeads(query: string) {
    return this.dbService.searchLeads(query)
  }

  async scrapeLeads(searchParams: any) {
    const leads = await this.realTimeService.scrapeLeads(searchParams)

    // Save scraped leads to database
    const savedLeads = []
    for (const leadData of leads) {
      try {
        const saved = await this.createLead({
          company: leadData.company,
          website: leadData.website,
          industry: leadData.industry,
          location: leadData.location,
          employees: leadData.employees,
          revenue: leadData.revenue,
          status: "new",
        })
        savedLeads.push(saved)
      } catch (error) {
        console.error("Failed to save scraped lead:", error)
      }
    }

    return savedLeads
  }
}
