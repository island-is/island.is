import { CaseSubscriptionType, SortOptions, SubscriptionType } from './enums'

export interface Case {
  id?: number
  caseNumber?: string
  name?: string
  adviceCount?: number
  shortDescription?: string
  detailedDescription?: string
  statusName?: string
  institutionName?: string
  oldInstitutionName?: string
  typeName?: string
  policyAreaName?: string
  processBegins?: string
  processEnds?: string
  announcementText?: string
  created?: string
  changed?: string
  summaryDate?: string
  summaryText?: string
  contactName?: string
  contactEmail?: string
  documents?: Array<Document>
  additionalDocuments?: Array<Document>
  stakeholders?: Array<Stakeholder>
}

export interface Document {
  id?: string
  fileName?: string
  fileType?: string
  size?: number
}

export interface Stakeholder {
  name?: string
  email?: string
}

export interface AdviceDocuments {
  id?: string
  fileName?: string
  fileType?: string
  size?: number
}

export interface UserAdvice {
  id: string
  caseId: number
  participantName: string
  participantEmail: string
  content: string
  created: string
  _case: Case
  adviceDocuments: Array<AdviceDocuments>
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

// export interface SubscriptionArray {
//   caseIds: Array<SubscriptionItem>
//   institutionIds: Array<SubscriptionItem>
//   policyAreaIds: Array<SubscriptionItem>
//   generalSubscription: string
// }

export interface SubscriptionItem {
  id: number
  subscriptionType: string
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

export type FilterInputItem = {
  checked: boolean
  value: string
  label: string
  count?: number | unknown
}

export interface FilterInputItems {
  items: Array<FilterInputItem>
  isOpen?: boolean
}

export type PeriodInput = {
  from?: Date
  to?: Date
}

export interface CaseFilter {
  caseStatuses?: FilterInputItems
  caseTypes?: FilterInputItems
  period?: PeriodInput
  institutions?: Array<number>
  sorting?: FilterInputItems
  pageNumber?: number
  pageSize?: number
  policyAreas?: Array<number>
  searchQuery?: string
}

export interface FetchCasesInput {
  caseStatuses: Array<number>
  caseTypes: Array<number>
  orderBy: string
  searchQuery: string
  policyAreas: Array<number>
  institutions: Array<number>
  dateFrom: Date
  dateTo: Date
  pageSize: number
  pageNumber: number
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

export interface User {
  name?: string
  email?: string
  image?: string
}

export interface TypeForSubscriptions {
  id: string
  type: string
  name: string
  nr: any
}

export interface AdviceFilter {
  oldestFirst?: boolean
  pageNumber?: number
  pageSize?: number
  searchQuery?: string
}

export interface CasesSubscription {
  id?: number
  subscriptionType?: CaseSubscriptionType
}

export interface CasesSubscriptionData {
  id?: number | string
  caseNumber?: string
  institutionName?: string
  name?: string
  policyAreaName?: string
  key?: string
  checked?: boolean
  subscriptionType?: SubscriptionType
}

export interface InstitutionsSubscription {
  id?: number
  subscriptionType?: SubscriptionType
}

export interface InstitutionsSubscriptionData {
  name?: string
  id?: string
  subscriptionType?: SubscriptionType
  checked?: boolean
  key?: string
}

export interface PolicyAreasSubscription {
  id?: number
  subscriptionType?: SubscriptionType
}

export interface PolicyAreasSubscriptionData {
  name?: string
  id?: string
  subscriptionType?: SubscriptionType
  checked?: boolean
  key?: string
}

export interface GeneralSubscriptionData {
  name?: string
  key?: string
  checked?: boolean
  subscriptionType?: SubscriptionType
}

export interface SubscriptionArray {
  cases?: Array<CasesSubscriptionData>
  institutions?: Array<InstitutionsSubscriptionData>
  policyAreas?: Array<PolicyAreasSubscriptionData>
  subscribedToAllNewObj?: GeneralSubscriptionData
  subscribedToAllChangesObj?: GeneralSubscriptionData
}

export interface SubscriptionArrayForValue {
  case?: CasesSubscriptionData
  institution?: InstitutionsSubscriptionData
  policyArea?: PolicyAreasSubscriptionData
  subscribedToAllNewObj?: GeneralSubscriptionData
  subscribedToAllChangesObj?: GeneralSubscriptionData
}

export interface SubscriptionTableItem extends CasesSubscriptionData {
  subscriptionType?: SubscriptionType
}

export interface Subscription {
  subscribedToAll?: boolean
  subscribedToAllType?: SubscriptionType
  cases?: Array<CasesSubscription>
  institutions?: Array<InstitutionsSubscription>
  policyAreas?: Array<PolicyAreasSubscription>
}
