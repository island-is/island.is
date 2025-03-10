import { DefaultEvents } from '@island.is/application/types'

export type Events =
  | { type: DefaultEvents.ASSIGN }
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.PAYMENT }

export enum States {
  DRAFT = 'draft',
  DONE = 'done',
}
export enum Roles {
  APPLICANT = 'applicant',
  ASSIGNEE = 'assignee', //second guardian
}

export enum ApiActions {
  submitApplication = 'submitApplication',
}

export enum PassportStatus {
  LOST = 'lost',
  STOLEN = 'stolen',
}

export type SubmitResponse = {
  success: boolean
  orderId?: string[]
}

export type Passport = {
  userPassport: string
  childPassport: string
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
  numberWithType: string
  productionRequestID: string
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
