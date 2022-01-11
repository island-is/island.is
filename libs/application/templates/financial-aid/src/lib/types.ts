import { Application, FieldBaseProps } from '@island.is/application/core'
import { answersSchema } from './dataSchema'

export enum DataProviderTypes {
  NationalRegistry = 'NationalRegistryProvider',
}

export enum ApproveOptions {
  Yes = 'Yes',
  No = 'No',
}

type Override<T1, T2> = Omit<T1, keyof T2> & T2

type ErrorSchema = NestedType<answersSchema>

export interface ExternalData {
  nationalRegistry: {
    data: Applicant
    date: string
  }
}

export type NestedType<T> = {
  [K in keyof T]: T[K] extends Record<string, unknown>
    ? NestedType<T[K]>
    : string
}

export type FAApplication = Override<
  Application,
  { answers: answersSchema; externalData: ExternalData }
>

export type FAFieldBaseProps = Override<
  FieldBaseProps,
  { application: FAApplication; errors: ErrorSchema }
>

export interface Applicant {
  nationalId: string
  fullName: string
  address: Address
  spouse?: Spouse
}

export interface Address {
  streetName: string
  postalCode: string
  city: string
  municipalityCode: string
}

export interface Spouse {
  nationalId: string
  maritalStatus: string
  name: string
}
