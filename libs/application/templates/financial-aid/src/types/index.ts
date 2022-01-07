import { Application, FieldBaseProps } from '@island.is/application/core'
import { answersSchema } from '../lib/dataSchema'

export enum DataProviderTypes {
  NationalRegistry = 'NationalRegistryProvider',
}
export type Override<T1, T2> = Omit<T1, keyof T2> & T2
export type NestedType<T> = {
  [K in keyof T]: T[K] extends Record<string, unknown>
    ? NestedType<T[K]>
    : string
}

export interface Address {
  streetName: string
  postalCode: string
  city: string
}
export interface Spouse {
  nationalId: string
  maritalStatus: string
  name: string
}
export interface NationalRegistry {
  nationalId: string
  fullName: string
  address: Address
  spouse: Spouse
}

export interface ExternalData {
  nationalRegistry: {
    data: NationalRegistry
    date: string
  }
}
export interface MockData {
  applicant: NationalRegistry
}
export interface Answers extends answersSchema {
  mockData: MockData
}

type ErrorSchema = NestedType<answersSchema>

export type CRCApplication = Override<
  Application,
  { answers: Answers; externalData: ExternalData }
>

export type CRCFieldBaseProps = Override<
  FieldBaseProps,
  { application: CRCApplication; errors: ErrorSchema }
>
