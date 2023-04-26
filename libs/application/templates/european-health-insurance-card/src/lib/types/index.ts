export interface Person {
  name: string
  nationalId: string
}

export interface Address {
  address: {
    locality: string
    municipalityCode: string
    postalCode: string
    streetAddress: string
  }
}

export interface NationalRegistry {
  address: any
  nationalId: string
  fullName: string
  name: string
  ssn: string
  length: number
  data: any
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
