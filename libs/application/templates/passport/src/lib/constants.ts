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

export enum ApiActions {
  assignParentB = 'assignParentB',
  submitApplication = 'submitApplication',
  createCharge = 'createCharge',
  submitPassportApplication = 'submitPassportApplication',
  checkForDiscount = 'checkForDiscount',
}

export const YES = 'yes'
export const NO = 'no'

export const SYSLUMADUR_NATIONAL_ID = '6509142520'

export type Service = {
  type: Services
  dropLocation: string
  authentication: string
}

export type DistrictCommissionerAgencies = {
  name: string
  place: string
  address: string
  id: string
}

export type SubmitResponse = {
  success: boolean
  orderId?: string
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

export type ChildsPersonalInfo = {
  name: string
  nationalId: string
  hasDisabilityDiscount: Array<string>
  guardian1: Guardian
  guardian2: Guardian
}

export type IdentityDocument = {
  number: string
  expirationDate: Date
}

export const twoDays = 24 * 3600 * 1000 * 2
export const sixtyDays = 24 * 3600 * 1000 * 60

export const IdentityDocumentProviderMock = {
  productionRequestID: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
  number: 'A1234567',
  type: 'P',
  verboseType: 'Vegabréf: Almennt',
  subType: 'A',
  status: 'ISSUED',
  issuingDate: new Date('2012-10-02'),
  expirationDate: new Date('2022-10-02'),
  displayFirstName: 'Gervimaður',
  displayLastName: 'Mock',
  mrzFirstName: 'GERVIMAÐUR',
  mrzLastName: 'MOCK',
  sex: 'X',
}
