import { z } from 'zod'
import { DefaultEvents } from '@island.is/application/types'
import {
  ParticipantSchema,
  PaymentArrangementSchema,
  SeminarAnswersSchema,
} from '../lib/dataSchema'
import { MessageDescriptor } from 'react-intl'

export type SeminarAnswersSchema = z.TypeOf<typeof SeminarAnswersSchema>
export type PaymentArrangementType = z.TypeOf<typeof PaymentArrangementSchema>
export type Participant = z.TypeOf<typeof ParticipantSchema>

export interface CSVError {
  items: Array<number>
  error: MessageDescriptor
}

export interface ParticipantWithValidation extends Participant {
  errorMessage: string
  errorMessageEn: string
}

export interface IndexableObject {
  [index: number]: Array<string>
}

export type Events = { type: DefaultEvents.SUBMIT | DefaultEvents.ABORT }

export enum States {
  PREREQUISITES = 'prerequisites',
  DRAFT = 'draft',
  SUBMIT = 'submit',
  PAYMENT = 'payment',
  COMPLETED = 'completed',
}

export enum Roles {
  APPLICANT = 'applicant',
}

export enum ApiActions {
  submitApplication = 'submitApplication',
  getSeminars = 'getSeminars',
  getIndividualValidity = 'checkIndividual',
}

export enum IndividualOrCompany {
  individual = 'individual',
  company = 'company',
}

export enum PaymentOptions {
  cashOnDelivery = 'cashOnDelivery',
  putIntoAccount = 'putIntoAccount',
}

export enum RegisterNumber {
  one = 'one',
  many = 'many',
}
