import {
  NO,
  OnBehalf,
  YES,
} from '@island.is/application/templates/data-protection-complaint'

export interface ComplaintPDF {
  applicantInfo: {
    name: string
    nationalId: string
  }
  onBehalf: OnBehalf //"myself | myself and others | others | stofnanir og felagsamtok",
  agency: {
    persons: Agency[]
  } | null
  contactInfo: ContactInfo
  targetsOfComplaint: TargetOfComplaint[]
  complaintCategories: string[]
  somethingElse: string
  description: string
  submitDate: Date
  attachments: string[]
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
  nationalId?: string
  operatesWithinEurope: typeof YES | typeof NO
  countryOfOperation: string
}

export interface Agency {
  name: string
  nationalId: string
}

export enum ContactRole {
  COMPLAINTANT = 'Kvartandi',
  RESPONSIBLE = 'Ábyrgðaraðili',
  CLIENT = 'Umbjóðandi',
}
