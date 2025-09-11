import { NO, YES } from '@island.is/application/core'
import { OnBehalf } from '@island.is/application/templates/data-protection-complaint'

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
  messages: ApplicationMessages
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
  contactName: string
  contactEmail: string
}

export interface ApplicationMessages {
  externalData: ExternalDataMessages
  information: Information
}

export interface Information {
  title: string
  bullets: Bullets
}

export interface Bullets {
  bulletOne: Bullet
  bulletTwo: Bullet
  bulletThree: Bullet
  bulletFour: Bullet
  bulletFive: Bullet
  bulletSix: Bullet
  bulletSeven: Bullet
  bulletEight: Bullet
}

export interface Bullet {
  bullet: string
  link: string
  linkText: string
}

export interface ExternalDataMessages {
  title: string
  subtitle: string
  description: string
  nationalRegistryTitle: string
  nationalRegistryDescription: string
  userProfileTitle: string
  userProfileDescription: string
  checkboxText: string
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
