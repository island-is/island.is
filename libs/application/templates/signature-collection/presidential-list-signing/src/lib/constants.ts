import { DefaultEvents } from '@island.is/application/types'

export type Events = { type: DefaultEvents.SUBMIT }

export enum States {
  PREREQUISITES = 'prerequisites',
  DRAFT = 'draft',
  DONE = 'done',
}
export enum Roles {
  APPLICANT = 'applicant',
}

export type SubmitResponse = {
  success: boolean
  orderId?: string[]
}

export enum ApiActions {
  submitApplication = 'signList',
  onEntry = 'getList',
}
export interface UserBase {
  nationalId: string
  name: string
}
export interface Area {
  id: string
  name: string
  min: number
  max?: number
}

export interface List {
  id: string
  title: string
  owner: UserBase
  area: Area
  active: boolean
  startTime: Date
  endTime: Date
  collectionId: string
  collectors?: UserBase[]
  numberOfSignatures: number
  link?: string
}
