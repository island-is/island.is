import { Application, FieldBaseProps } from '@island.is/application/core'
import { answersSchema } from '../lib/dataSchema'

export type Override<T1, T2> = Omit<T1, keyof T2> & T2

export interface Address {
  streetName: string
  postalCode: string
  city: string
}

interface OtherParent {
  nationalId: string
  fullName: string
  address: Address
}

export interface Child {
  nationalId: string
  livesWithApplicant: boolean
  fullName: string
  otherParent: OtherParent
}

export interface NationalRegistry {
  nationalId: string
  fullName: string
  address: Address
  children: Child[]
}

export interface PersonResidenceChange {
  nationalId: string
  fullName: string
  address: Address
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
  }
  userProfile: {
    data: UserInfo
  }
}

interface MockChildren extends PersonResidenceChange {
  livesWithApplicant: 'yes' | undefined
  otherParent: number
}
interface MockData {
  parents: PersonResidenceChange[]
  children: MockChildren[]
}

// We are using mockData that is not defined in the zod schema
export interface Answers extends answersSchema {
  mockData: MockData
}

export type CRCApplication = Override<
  Application,
  { answers: Answers; externalData: ExternalData }
>

export type CRCFieldBaseProps = Override<
  FieldBaseProps,
  { application: CRCApplication }
>

export enum DataProviderTypes {
  MOCK_NationalRegistry = 'MockNationalRegistryProvider',
  NationalRegistry = 'NationalRegistryProvider',
  UserProfile = 'UserProfileProvider',
}
