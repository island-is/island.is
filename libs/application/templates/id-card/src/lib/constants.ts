import { DefaultEvents } from '@island.is/application/types'

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

export enum Services {
  REGULAR = 'regular',
  EXPRESS = 'express',
  REGULAR_DISCOUNT = 'regularDiscount',
  EXPRESS_DISCOUNT = 'expressDiscount',
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

export type IdentityDocument = {
  number: string
  type: string
  verboseType: string
  subType: string
  status: string
  issuingDate: string
  expirationDate: string
  displayFirstName: string
  displayLastName: string
  mrzFirstName: string
  mrzLastName: string
  sex: string
}

export interface IdentityDocumentChild {
  childNationalId: string
  secondParent: string
  secondParentName: string
  childName: string
  passports?: IdentityDocument[]
}

export interface IdentityDocumentData {
  userPassport: IdentityDocument
  childPassports: IdentityDocumentChild[]
}

export const twoDays = 24 * 3600 * 1000 * 2
export const sixtyDays = 24 * 3600 * 1000 * 60
export const sevenDays = 24 * 3600 * 1000 * 7
