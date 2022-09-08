import { SearchSearchStringGetRequest } from './gen/fetch'
export type SearchRequest = SearchSearchStringGetRequest

export enum CompanyAddressType {
  address = 'Póstfang',
  legalDomicile = 'Lögheimili',
}

export interface CompanySearchResults {
  hasMore: boolean
  limit: number
  offset: number
  count: number
  items: CompanyInfo[]
}

export interface CompanyInfo {
  nationalId: string
  name: string
  dateOfRegistration?: Date
  status: string
  vatNumber?: string
  lastUpdated?: Date
}

export interface CompanyExtendedInfo extends CompanyInfo {
  formOfOperation: CompanyFormOfOperation[]
  addresses: CompanyAddress[]
  address?: CompanyAddress
  legalDomicile?: CompanyAddress
  relatedParty: CompanyRelatedParty[]
  vat: CompanyVat[]
}

export interface CompanyFormOfOperation {
  type: string
  name: string
}

export interface CompanyAddress {
  type: CompanyAddressType
  streetAddress: string
  postalCode: string
  locality: string
  municipalityNumber: string
  country: string
  isPostbox: boolean
  region: string
}

export interface CompanyRelatedParty {
  type: string
  nationalId: string
  name: string
}

export interface CompanyVat {
  vatNumber?: string
  dateOfRegistration?: Date
  status?: string
  dateOfDeregistration?: Date
  classification?: CompanyClassification[]
}

export interface CompanyClassification {
  type: string
  classificationSystem: string
  number: string
  name: string
}
