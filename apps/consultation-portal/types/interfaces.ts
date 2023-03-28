import { SortOptions } from './enums'

export interface Case {
  id: number
  caseNumber: string
  name: string
  adviceCount?: number
  shortDescription?: string
  statusName?: string
  institutionName?: string
  typeName?: string
  policyAreaName?: string
  processBegins?: string
  processEnds?: string
  created?: string
  summaryDate?: string
}

export interface UserAdvice {
  id: string
  number: string
  participantName: string
  participantEmail: string
  content: string
  created: string
}

export interface CaseForSubscriptions {
  id: number
  caseNumber: string
  name: string
  institutionName: string
  policyAreaName: string
}

export interface ArrOfIdAndName {
  id: string
  name: string
}

export interface ArrOfValueAndLabel {
  value: string
  label: string
}

export interface SubscriptionArray {
  caseIds: Array<number>
  institutionIds: Array<number>
  policyAreaIds: Array<number>
}

export interface SortTitle {
  Mál: SortOptions
  Stofnanir: SortOptions
  Málefnasvið: SortOptions
}

export interface ArrOfTypes {
  policyAreas: { [key: string]: string }
  institutions: { [key: string]: string }
  caseStatuses: { [key: string]: string }
  caseTypes: { [key: string]: string }
}

export interface ArrOfStatistics {
  casesInReview?: number
  totalAdvices?: number
  totalCases?: number
}

export interface ArrOfTypesForSubscriptions {
  policyAreas: { [key: string]: string }
  institutions: { [key: string]: string }
}

export type FilterInputItems = {
  checked: boolean
  value: string
  label: string
}

export interface FilterInputIsOpen {
  items: FilterInputItems
  isOpen: boolean
}

export type PeriodInput = {
  from?: Date
  to?: Date
}

export interface CaseFilter {
  caseStatuses?: any
  caseTypes?: any
  period?: PeriodInput
  institutions?: Array<number>
  sorting?: any
  pageNumber?: number
  pageSize?: number
  policyAreas?: Array<number>
  searchQuery?: string
}

export interface SEOProps {
  title: string
  url?: string
  image?: string
}

export interface FilterGroups {
  CaseTypes?: { [key: string]: string }
  Institutions?: { [key: string]: string }
  PolicyAreas?: { [key: string]: string }
  Statuses?: { [key: string]: string }
}

export interface ValueCountPair {
  value?: string
  count?: string
}

export interface AdviceFileRequest {
  filename?: string
  base64Document?: string
}

export interface AdviceRequest {
  content?: string
  adviceFiles?: AdviceFileRequest
}

export interface PostAdviceForm {
  caseId?: number
  adviceRequest?: AdviceRequest
}

export interface FileObject {
  name: string
  originalFileObj: File
  size?: number
  type?: string
}
