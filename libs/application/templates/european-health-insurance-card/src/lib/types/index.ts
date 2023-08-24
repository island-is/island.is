export interface Person {
  name: string
  nationalId: string
}

export interface Address {
  streetAddress: string
  locality: string
  municipalityCode: string
  postalCode: string
  city?: string
}

export interface NationalRegistry {
  address: Address
  nationalId: string
  fullName: string
}

export interface Answer {
  delimitations: CardAnswer
}

export interface CardAnswer {
  applyForPlastic: string[]
  addForPDF: string[]
}

export interface NationalRegistrySpouse {
  name: string
  nationalId: string
}

export enum States {
  PREREQUISITES = 'prerequisites',
  DRAFT = 'draft',
  COMPLETED = 'completed',
  DECLINED = 'declined',
  NOAPPLICANTS = 'noapplicants',
}

export interface CardInfo {
  cardNumber?: string | null
  expiryDate?: Date
  issued?: Date
  sent?: Date
  resent?: Date
  cardType?: string | null
  sentStatus?: string | null
  comment?: string | null
  isPlastic: boolean
  isTemp: boolean
}

export interface CardResponse {
  applicantNationalId?: string | null
  isInsured?: boolean | null
  canApply?: boolean | null
  canApplyForPDF?: boolean | null
  cards?: Array<CardInfo> | null
}

export interface NridName {
  nrid: string
  name: string
}

export interface LabelValue {
  value: string
  label?: string
}

export interface TempData {
  contentType: string
  data: string
  fileName: string
}
