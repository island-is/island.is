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

export interface Person {
  nationalId: string
  fullName: string
  address: Address
}

export interface Child {
  nationalId: string
  livesWithApplicant: boolean
  livesWithBothParents: boolean
  fullName: string
  otherParent: Person
  custodyParents?: string[]
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
  livesWithBothParents: 'yes' | undefined
  otherParent: number
}

export interface MockData {
  applicant: Person
  parents: Person[]
  children: MockChildren[]
}
