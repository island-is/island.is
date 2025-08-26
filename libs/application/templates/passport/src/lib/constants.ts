import { DefaultEvents } from '@island.is/application/types'

export type Events =
  | { type: DefaultEvents.ASSIGN }
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.PAYMENT }

export enum States {
  DRAFT = 'draft',
  DONE = 'done',
  PARENT_B_CONFIRM = 'parentBConfirm',
  PAYMENT = 'payment',
}
export enum Roles {
  APPLICANT = 'applicant',
  ASSIGNEE = 'assignee', //second guardian
}

export enum Services {
  REGULAR = 'regular',
  EXPRESS = 'express',
}

export enum PassportChargeCodes {
  REGULAR = 'AY105',
  EXPRESS = 'AY106',
  DISCOUNT_REGULAR = 'AY107',
  DISCOUNT_EXPRESS = 'AY108',
}

export enum ApiActions {
  assignParentB = 'assignParentB',
  submitApplication = 'submitApplication',
  createCharge = 'createCharge',
  submitPassportApplication = 'submitPassportApplication',
  checkForDiscount = 'checkForDiscount',
}

export type Service = {
  type: Services
  authentication: string
}

export type Passport = {
  userPassport: string
  childPassport: string
}

export type PersonalInfo = {
  name: string
  nationalId: string
  email: string
  phoneNumber: string
  disabilityCheckbox: string[]
  hasDisabilityLicense: boolean
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
