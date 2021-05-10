import { Application, FieldBaseProps } from '@island.is/application/core'
import { answersSchema } from '../lib/dataSchema'

export type Override<T1, T2> = Omit<T1, keyof T2> & T2

type NestedType<T> = {
  [K in keyof T]: T[K] extends Record<string, unknown>
    ? NestedType<T[K]>
    : string
}

export interface Address {
  streetName: string
  postalCode: string
  city: string
}

export interface Person {
  nationalId: string
  fullName: string
  address: Address
}

export interface Child {
  nationalId: string
  livesWithApplicant: boolean
  fullName: string
  otherParent: Person
}

export interface NationalRegistry extends Person {
  children: Child[]
}

export interface UserInfo {
  email: string
  emailVerified: boolean
  mobilePhoneNumber: string
  mobilePhoneNumberVerified: boolean
}

export interface ExternalData {
  nationalRegistry: {
    data: NationalRegistry
    date: string
  }
  userProfile: {
    data: UserInfo
    date: string
  }
}

interface MockChildren extends Person {
  livesWithApplicant: 'yes' | undefined
  otherParent: number
}
interface MockData {
  applicant: Person
  parents: Person[]
  children: MockChildren[]
}

// We are using mockData that is not defined in the zod schema
export interface Answers extends answersSchema {
  mockData: MockData
}

export type JCAApplication = Override<
  Application,
  { answers: Answers; externalData: ExternalData }
>

type ErrorSchema = NestedType<answersSchema>

export type JCAFieldBaseProps = Override<
  FieldBaseProps,
  { application: JCAApplication; errors: ErrorSchema }
>

export enum DataProviderTypes {
  MockNationalRegistry = 'MockNationalRegistryProvider',
  NationalRegistry = 'NationalRegistryProvider',
  UserProfile = 'UserProfileProvider',
}
