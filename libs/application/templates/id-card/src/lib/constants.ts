import { DefaultEvents } from '@island.is/application/types'
import { Services } from '../shared/types'

export type Events =
  | { type: DefaultEvents.ASSIGN }
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.PAYMENT }
  | { type: DefaultEvents.REJECT }

export enum Routes {
  APPLICATIONINFORMATION = 'applicationInformation',
  FIRSTGUARDIANINFORMATION = 'firstGuardianInformation',
  SECONDGUARDIANINFORMATION = 'secondGuardianInformation',
  TYPEOFID = 'typeOfId',
  CHOSENAPPLICANTS = 'chosenApplicants',
  APPLICANTSINFORMATION = 'applicantInformation',
  PRICELIST = 'priceList',
  REVIEW = 'review',
  CONDITIONINFORMATION = 'conditionInformation',
}

export enum States {
  PARENT_B_CONFIRM = 'parentBConfirm',
  PREREQUISITES = 'prerequisites',
  DRAFT = 'draft',
  PAYMENT = 'payment',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
}
export enum Roles {
  APPLICANT = 'applicant',
  ASSIGNEE = 'assignee', //second guardian
}

export enum ApiActions {
  assignParentB = 'assignParentB',
  submitApplication = 'submitApplication',
  createCharge = 'createCharge',
  submitPassportApplication = 'submitPassportApplication',
  checkForDiscount = 'checkForDiscount',
  rejectApplication = 'rejectApplication',
}

export const EXPIRATION_LIMIT_MONTHS = 9

export type PaymentItem = {
  chargeType: string
  priceAmount: number
  chargeItemCode: string
}

export type Service = {
  type: Services
  dropLocation: string
  authentication: string
}

export type DistrictCommissionerAgencies = {
  name: string
  street: string
  city: string
  zip: string
  key: string
}

export type SubmitResponse = {
  success: boolean
  orderId?: string[]
}

export type Passport = {
  userPassport: string
  childPassport: string
}

export type Guardian = {
  name: string
  nationalId: string
  email: string
  phoneNumber: string
}

export type PersonalInfo = {
  name: string
  nationalId: string
  email: string
  phoneNumber: string
  disabilityCheckbox: string[]
  hasDisabilityLicense: boolean
}

export type ChildsPersonalInfo = {
  name: string
  nationalId: string
  disabilityCheckbox: Array<string>
  guardian1: Guardian
  guardian2: Guardian
}

export type Gender = 'F' | 'M' | 'X'

export type ExpiryStatus = 'EXPIRED' | 'LOST'

export type IdentityDocument = {
  number?: string | null
  type?: string | null
  verboseType?: string | null
  subType?: string | null
  status?: string | null
  issuingDate?: Date | null
  expirationDate?: Date | null
  displayFirstName?: string | null
  displayLastName?: string | null
  mrzFirstName?: string | null
  mrzLastName?: string | null
  sex?: Gender | null
  numberWithType?: string
  expiryStatus?: ExpiryStatus
  expiresWithinNoticeTime?: boolean
}

export interface IdentityDocumentChild {
  childNationalId?: string | null
  secondParent?: string | null
  secondParentName?: string | null
  childName?: string | null
  passports?: IdentityDocument[]
  citizenship?: Citizenship | null
}

export interface IdentityDocumentData {
  userPassport: IdentityDocument
  childPassports: IdentityDocumentChild[]
}

export interface Citizenship {
  kodi?: string | null
  land?: string | null
}

export interface CombinedApplicantInformation {
  name?: string
  age?: number
  nationalId?: string
  passport?: IdentityDocument
  children?: Array<IdentityDocumentChild>
}

export const twoDays = 24 * 3600 * 1000 * 2
export const sixtyDays = 24 * 3600 * 1000 * 60
export const sevenDays = 24 * 3600 * 1000 * 7
