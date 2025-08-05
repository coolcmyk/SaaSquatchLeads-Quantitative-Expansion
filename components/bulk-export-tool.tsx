"use client"

import { useState } from "react"
import * as XLSX from "xlsx"
import jsPDF from "jspdf"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Download, FileText, Table, Loader2, CheckCircle } from "lucide-react"

interface ExportOptions {
  format: string
  fields: string[]
  filters: {
    scoreRange: string
    industry: string
    dateRange: string
  }
}

interface ExportJob {
  id: string
  status: "pending" | "processing" | "completed" | "failed"
  progress: number
  recordCount: number
  format: string
  createdAt: string
}

export default function BulkExportTool() {
  const [isExporting, setIsExporting] = useState(false)
  const [exportJobs, setExportJobs] = useState<ExportJob[]>([])
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: "",
    fields: [],
    filters: {
      scoreRange: "",
      industry: "",
      dateRange: "",
    },
  })

  const availableFields = [
    "Company Name",
    "Website",
    "Industry",
    "Employee Count",
    "Revenue",
    "Location",
    "Contact Name",
    "Contact Email",
    "Contact Phone",
    "LinkedIn Profile",
    "Lead Score",
    "Last Updated",
  ]

  const exportFormats = [
    { value: "csv", label: "CSV", icon: Table },
    { value: "xlsx", label: "Excel (XLSX)", icon: Table },
    { value: "json", label: "JSON", icon: FileText },
    { value: "pdf", label: "PDF Report", icon: FileText },
  ]

  const handleFieldToggle = (field: string) => {
    setExportOptions((prev) => ({
      ...prev,
      fields: prev.fields.includes(field) ? prev.fields.filter((f) => f !== field) : [...prev.fields, field],
    }))
  }

  const startExport = async () => {
    setIsExporting(true)

    const newJob: ExportJob = {
      id: `export_${Date.now()}`,
      status: "processing",
      progress: 0,
      recordCount: 1247,
      format: exportOptions.format.toUpperCase(),
      createdAt: new Date().toISOString(),
    }

    setExportJobs((prev) => [newJob, ...prev])

    // Simulate export progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 200))
      setExportJobs((prev) => prev.map((job) => (job.id === newJob.id ? { ...job, progress: i } : job)))
    }

    setExportJobs((prev) => prev.map((job) => (job.id === newJob.id ? { ...job, status: "completed" } : job)))

    // Simulate fetching data
    const fetchData = async () => {
      // In a real application, you would fetch data based on exportOptions.filters
      const dummyData = Array.from({ length: 1247 }, (_, i) => ({
        "Company Name": `Company ${i + 1}`,
        "Website": `company${i + 1}.com`,
        "Industry": ["Software", "Fintech", "Healthcare", "E-commerce"][i % 4],
        "Employee Count": Math.floor(Math.random() * 1000) + 10,
        "Revenue": Math.floor(Math.random() * 1000000) + 10000,
        "Location": `Location ${i + 1}`,
        "Contact Name": `Contact ${i + 1}`,
        "Contact Email": `contact${i + 1}@company.com`,
        "Contact Phone": `123-456-789${i % 10}`,
        "LinkedIn Profile": `linkedin.com/company/company${i + 1}`,
        "Lead Score": Math.floor(Math.random() * 41) + 60,
        "Last Updated": new Date().toISOString(),
      }));

      const filteredData = dummyData.map(item => {
        const filteredItem: { [key: string]: any } = {};
        exportOptions.fields.forEach(field => {
          filteredItem[field] = item[field as keyof typeof item];
        });
        return filteredItem;
      });

      if (exportOptions.format === 'csv' || exportOptions.format === 'xlsx') {
        const worksheet = XLSX.utils.json_to_sheet(filteredData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Leads');
        const fileData = XLSX.write(workbook, { bookType: exportOptions.format, type: 'array' });
        downloadFile(fileData, `leads.${exportOptions.format}`, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      } else if (exportOptions.format === 'pdf') {
        const doc = new jsPDF();
        doc.text('Leads Report', 10, 10);
        // This is a simplified PDF generation. A more complex implementation would be needed for a well-formatted report.
        doc.text(JSON.stringify(filteredData, null, 2), 10, 20);
        doc.save('leads.pdf');
      }
    };

    fetchData();

    setIsExporting(false)
  }

  const downloadFile = (data: any, fileName: string, fileType: string) => {
    const blob = new Blob([data], { type: fileType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "processing":
        return "bg-blue-500"
      case "failed":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return CheckCircle
      case "processing":
        return Loader2
      default:
        return Download
    }
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Download className="h-5 w-5 text-indigo-400" />
          Bulk Export Tool
        </CardTitle>
        <CardDescription className="text-gray-300">
          Export your leads in various formats with custom field selection and filtering
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Export Format Selection */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-300">Export Format</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {exportFormats.map((format) => {
              const Icon = format.icon
              return (
                <Card
                  key={format.value}
                  className={`cursor-pointer transition-all ${
                    exportOptions.format === format.value
                      ? "bg-indigo-600/20 border-indigo-500"
                      : "bg-slate-700/50 border-slate-600 hover:bg-slate-700"
                  }`}
                  onClick={() => setExportOptions((prev) => ({ ...prev, format: format.value }))}
                >
                  <CardContent className="p-4 text-center">
                    <Icon className="h-6 w-6 mx-auto mb-2 text-indigo-400" />
                    <p className="text-sm font-medium text-white">{format.label}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Field Selection */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-300">Select Fields to Export</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {availableFields.map((field) => (
              <div key={field} className="flex items-center space-x-2">
                <Checkbox
                  id={field}
                  checked={exportOptions.fields.includes(field)}
                  onCheckedChange={() => handleFieldToggle(field)}
                  className="border-slate-600"
                />
                <label htmlFor={field} className="text-sm text-gray-300 cursor-pointer">
                  {field}
                </label>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setExportOptions((prev) => ({ ...prev, fields: availableFields }))}
              className="border-slate-600 text-gray-300"
            >
              Select All
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setExportOptions((prev) => ({ ...prev, fields: [] }))}
              className="border-slate-600 text-gray-300"
            >
              Clear All
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-300">Export Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-xs text-gray-400">Lead Score Range</label>
              <Select
                value={exportOptions.filters.scoreRange}
                onValueChange={(value) =>
                  setExportOptions((prev) => ({
                    ...prev,
                    filters: { ...prev.filters, scoreRange: value },
                  }))
                }
              >
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="All scores" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="all">All Scores</SelectItem>
                  <SelectItem value="90-100">90-100 (Excellent)</SelectItem>
                  <SelectItem value="80-89">80-89 (Good)</SelectItem>
                  <SelectItem value="70-79">70-79 (Fair)</SelectItem>
                  <SelectItem value="60-69">60-69 (Poor)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-gray-400">Industry</label>
              <Select
                value={exportOptions.filters.industry}
                onValueChange={(value) =>
                  setExportOptions((prev) => ({
                    ...prev,
                    filters: { ...prev.filters, industry: value },
                  }))
                }
              >
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="All industries" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="all">All Industries</SelectItem>
                  <SelectItem value="software">Software Development</SelectItem>
                  <SelectItem value="fintech">Financial Services</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="ecommerce">E-commerce</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-gray-400">Date Range</label>
              <Select
                value={exportOptions.filters.dateRange}
                onValueChange={(value) =>
                  setExportOptions((prev) => ({
                    ...prev,
                    filters: { ...prev.filters, dateRange: value },
                  }))
                }
              >
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="All time" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Export Summary */}
        <Card className="bg-slate-700/50 border-slate-600">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-white">Export Summary</h4>
                <p className="text-sm text-gray-400">
                  {exportOptions.fields.length} fields selected • Estimated 1,247 records
                </p>
              </div>
              <Badge variant="outline" className="border-slate-600 text-gray-300">
                Ready to Export
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Export Button */}
        <Button
          onClick={startExport}
          disabled={isExporting || !exportOptions.format || exportOptions.fields.length === 0}
          className="w-full bg-indigo-600 hover:bg-indigo-700"
        >
          {isExporting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Start Export
            </>
          )}
        </Button>

        {/* Export History */}
        {exportJobs.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Export History</h3>
            <div className="space-y-3">
              {exportJobs.map((job) => {
                const StatusIcon = getStatusIcon(job.status)
                return (
                  <Card key={job.id} className="bg-slate-700/50 border-slate-600">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <StatusIcon
                            className={`h-5 w-5 ${job.status === "processing" ? "animate-spin" : ""} text-white`}
                          />
                          <div>
                            <h4 className="font-medium text-white">{job.format} Export</h4>
                            <p className="text-sm text-gray-400">
                              {job.recordCount.toLocaleString()} records • {new Date(job.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={`${getStatusColor(job.status)} text-white`}>
                            {job.status.toUpperCase()}
                          </Badge>
                          {job.status === "completed" && (
                            <Button size="sm" className="bg-green-600 hover:bg-green-700">
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                          )}
                        </div>
                      </div>
                      {job.status === "processing" && (
                        <div className="mt-3">
                          <Progress value={job.progress} className="h-2" />
                          <p className="text-xs text-gray-400 mt-1">{job.progress}% complete</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
