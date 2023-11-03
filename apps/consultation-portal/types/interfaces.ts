import { CaseSubscriptionType, SortOptions, SubscriptionType } from './enums'

export interface Case {
  id?: number
  caseNumber?: string
  name?: string
  adviceCount?: number
  advicePublishTypeId?: number
  advicePublishTypeName?: string
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
  summaryLink?: string
  summaryDocumentId?: string
  contactName?: string
  contactEmail?: string
  documents?: Array<Document>
  additionalDocuments?: Array<Document>
  stakeholders?: Array<Stakeholder>
  extraStakeholderList?: string
  allowUsersToSendPrivateAdvices?: boolean
  relatedCases?: Array<RelatedCase>
}

export interface RelatedCase {
  id?: number
  caseNumber?: string
  name?: string
}

export interface Document {
  id?: string
  description?: string
  link?: string
  fileName?: string
  fileType?: string
  size?: number
}

export interface Stakeholder {
  name?: string
  email?: string
}

export interface UserAdvice {
  id: string
  caseId: number
  participantName: string
  participantEmail: string
  content: string
  created: string
  _case: Case
  adviceDocuments: Array<Document>
  isPrivate?: boolean
  isHidden?: boolean
}

export interface AdviceResult {
  id: string
  number: number
  participantName?: string
  participantEmail?: string
  content?: string
  isPrivate?: boolean
  isHidden?: boolean
  created?: Date
  adviceDocuments?: Array<Document>
}

export interface CaseForSubscriptions {
  id: number
  caseNumber: string
  name: string
  institutionName: string
  policyAreaName: string
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

export type PeriodInput = {
  from?: Date
  to?: Date
}

interface FilterInputItems {
  items: Array<FilterInputItem>
  isOpen?: boolean
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

export interface SEOProps {
  title: string
  url?: string
  image?: string
  description?: string
  keywords?: string
}

export interface FilterGroups {
  CaseTypes?: { [key: string]: string }
  Institutions?: { [key: string]: string }
  PolicyAreas?: { [key: string]: string }
  Statuses?: { [key: string]: string }
}

export interface User {
  name?: string
  email?: string
  image?: string
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

export interface CaseExpressions {
  isDocumentsNotEmpty: boolean
  isAdditionalDocumentsNotEmpty: boolean
  isStatusNameNotPublished: boolean
  isStatusNameForReview: boolean
  isStakeholdersNotEmpty: boolean
  isRelatedCasesNotEmpty: boolean
  isStakeholdersBoxVisible: boolean
}
