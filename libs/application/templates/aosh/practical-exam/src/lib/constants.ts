import { DefaultEvents } from '@island.is/application/types'
import { IndexableObject } from '../utils/type'

export type Events = {
  type: DefaultEvents.SUBMIT | DefaultEvents.ABORT
}

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

export const FILE_SIZE_LIMIT = 10000000

export const predefinedHeaders: IndexableObject = {
  0: ['nafn', 'name'],
  1: ['kennitala', 'ssn'],
  2: ['netfang', 'email'],
  3: ['simi', 'phone'],
  4: ['okuskirteini', 'licenseNumber'],
  5: ['utgafuland', 'countryOfIssuer'],
}

export enum ApiActions {
  getExamCategories = 'getExamCategories',
  submitApplication = 'submitApplication',
}
