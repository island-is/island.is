import {
  NO,
  YES,
} from '@island.is/application/templates/data-protection-complaint'

export interface ComplaintDto {
  applicantInfo: {
    name: string
    nationalId: string
  }
  onBehalf: string //"myself | myself and others | others | stofnanir og felagsamtok",
  agency: {
    files: string[]
    persons: Agency[]
  } | null
  contactInfo: ContactInfo
  targetsOfComplaint: TargetOfComplaint[]
  complaintCategories: string[]
  description: string
  attachments: []
  applicationPdf: string
}

export interface ContactInfo {
  name: string
  nationalId: string
  type: string //person | felag/samtok,
  address: string
  email: string
  phone: string
  postalCode: string
  city: string
}

export interface TargetOfComplaint {
  name: string
  address: string
  nationalId: string
  operatesWithinEurope: typeof YES | typeof NO
  countryOfOperation: string
}

export interface Agency {
  name: string
  nationalId: string
}
