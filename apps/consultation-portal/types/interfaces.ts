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
  query?: string
}
