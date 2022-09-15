export interface Case {
  caseNumber: string
  name: string
  shortDescription: string
  detailedDescription: string
  contactName: string
  contactEmail: string
  status: string
  institution: string
  type: string
  policyArea: string
  processBegins: string
  processEnds: string
  announcementText: string
  summaryDate: string
  summaryText: string
  adviceCount: number
  created: string
  changed: string
  oldInstitutionName: string
}

export interface Advice {
  id: string
  number: number
  participantName: string
  participantEmail: string
  content: string
  created: string
}
