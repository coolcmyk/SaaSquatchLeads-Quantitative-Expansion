"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Mail, Wand2, Copy, Send, Loader2 } from "lucide-react"

export default function EmailGeneratorTool() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedEmail, setGeneratedEmail] = useState("")
  const [emailParams, setEmailParams] = useState({
    recipientName: "",
    recipientCompany: "",
    senderName: "",
    senderCompany: "",
    emailType: "",
    painPoint: "",
    valueProposition: "",
  })

  const emailTemplates = {
    cold_outreach: "Cold Outreach",
    follow_up: "Follow-up",
    introduction: "Introduction",
    demo_request: "Demo Request",
    partnership: "Partnership Inquiry",
  }

  const generateEmail = async () => {
    setIsGenerating(true)

    // Simulate AI email generation
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const mockEmail = `Subject: Quick question about ${emailParams.recipientCompany}'s ${emailParams.painPoint}

Hi ${emailParams.recipientName},

I hope this email finds you well. I came across ${emailParams.recipientCompany} and was impressed by your work in the industry.

I noticed that many companies like yours often struggle with ${emailParams.painPoint}. At ${emailParams.senderCompany}, we've helped similar organizations ${emailParams.valueProposition}.

Would you be open to a brief 15-minute conversation to discuss how we might be able to help ${emailParams.recipientCompany} achieve similar results?

I'd be happy to share some specific examples of how we've helped companies in your space.

Best regards,
${emailParams.senderName}
${emailParams.senderCompany}

P.S. If this isn't the right time, I completely understand. Feel free to let me know when might be better.`

    setGeneratedEmail(mockEmail)
    setIsGenerating(false)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedEmail)
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Mail className="h-5 w-5 text-orange-400" />
          AI Email Generator
        </CardTitle>
        <CardDescription className="text-gray-300">
          Generate personalized outreach emails using AI-powered templates
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Email Parameters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="recipientName" className="text-gray-300">
              Recipient Name
            </Label>
            <Input
              id="recipientName"
              placeholder="John Smith"
              value={emailParams.recipientName}
              onChange={(e) => setEmailParams((prev) => ({ ...prev, recipientName: e.target.value }))}
              className="bg-slate-700 border-slate-600 text-white placeholder-gray-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="recipientCompany" className="text-gray-300">
              Recipient Company
            </Label>
            <Input
              id="recipientCompany"
              placeholder="TechCorp Inc."
              value={emailParams.recipientCompany}
              onChange={(e) => setEmailParams((prev) => ({ ...prev, recipientCompany: e.target.value }))}
              className="bg-slate-700 border-slate-600 text-white placeholder-gray-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="senderName" className="text-gray-300">
              Your Name
            </Label>
            <Input
              id="senderName"
              placeholder="Jane Doe"
              value={emailParams.senderName}
              onChange={(e) => setEmailParams((prev) => ({ ...prev, senderName: e.target.value }))}
              className="bg-slate-700 border-slate-600 text-white placeholder-gray-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="senderCompany" className="text-gray-300">
              Your Company
            </Label>
            <Input
              id="senderCompany"
              placeholder="SaaSquatch Solutions"
              value={emailParams.senderCompany}
              onChange={(e) => setEmailParams((prev) => ({ ...prev, senderCompany: e.target.value }))}
              className="bg-slate-700 border-slate-600 text-white placeholder-gray-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="emailType" className="text-gray-300">
              Email Type
            </Label>
            <Select
              value={emailParams.emailType}
              onValueChange={(value) => setEmailParams((prev) => ({ ...prev, emailType: value }))}
            >
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Select email type" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                {Object.entries(emailTemplates).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="painPoint" className="text-gray-300">
              Pain Point
            </Label>
            <Input
              id="painPoint"
              placeholder="lead generation challenges"
              value={emailParams.painPoint}
              onChange={(e) => setEmailParams((prev) => ({ ...prev, painPoint: e.target.value }))}
              className="bg-slate-700 border-slate-600 text-white placeholder-gray-400"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="valueProposition" className="text-gray-300">
            Value Proposition
          </Label>
          <Textarea
            id="valueProposition"
            placeholder="increase qualified leads by 300% while reducing acquisition costs"
            value={emailParams.valueProposition}
            onChange={(e) => setEmailParams((prev) => ({ ...prev, valueProposition: e.target.value }))}
            className="bg-slate-700 border-slate-600 text-white placeholder-gray-400"
            rows={3}
          />
        </div>

        <Button
          onClick={generateEmail}
          disabled={isGenerating || !emailParams.recipientName || !emailParams.recipientCompany}
          className="w-full bg-orange-600 hover:bg-orange-700"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Email...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-4 w-4" />
              Generate Personalized Email
            </>
          )}
        </Button>

        {/* Generated Email */}
        {generatedEmail && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Generated Email</h3>
              <div className="flex gap-2">
                <Badge variant="secondary" className="bg-green-500/20 text-green-300">
                  AI Generated
                </Badge>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={copyToClipboard}
                  className="border-slate-600 text-gray-300 bg-transparent"
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </Button>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Send className="h-4 w-4 mr-1" />
                  Send
                </Button>
              </div>
            </div>

            <Card className="bg-slate-700/50 border-slate-600">
              <CardContent className="p-4">
                <pre className="whitespace-pre-wrap text-sm text-gray-300 font-mono">{generatedEmail}</pre>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
