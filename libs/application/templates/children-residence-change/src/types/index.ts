// import { NationalRegistryUser } from '@island.is/api/schema'
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

interface Child {
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
  id: string
  name: string
  ssn: string
  postalCode: string
  address: string
  city: string
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
  parentNationalRegistry: {
    data: PersonResidenceChange
  }
  childrenNationalRegistry: {
    data: PersonResidenceChange[]
  }
  userProfile: {
    data: UserInfo
  }
}

interface Person {
  nationalId: string
  fullName: string
  address: Address
}

interface MockChildren extends Person {
  livesWithApplicant: 'yes' | undefined
  otherParent: number
}
interface MockData {
  parents: Person[]
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
  ChildrenNationalRegistry = 'ChildrenNationalRegistryProvider',
  ParentNationalRegistry = 'ParentNationalRegistryProvider',
  MOCK_NationalRegistry = 'MockNationalRegistryProvider',
  NationalRegistry = 'NationalRegistryProvider',
  UserProfile = 'UserProfileProvider',
}
