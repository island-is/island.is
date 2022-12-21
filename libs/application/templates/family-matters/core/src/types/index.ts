import {
  ApplicantChildCustodyInformation,
  NationalRegistryIndividual,
} from '@island.is/application/types'

export type Override<T1, T2> = Omit<T1, keyof T2> & T2

export type NestedType<T> = {
  [K in keyof T]: T[K] extends Record<string, unknown>
    ? NestedType<T[K]>
    : string
}

export interface UserInfo {
  email: string
  emailVerified: boolean
  mobilePhoneNumber: string
  mobilePhoneNumberVerified: boolean
}

export interface ExternalData {
  nationalRegistry: {
    data: NationalRegistryIndividual
    date: string
  }
  childrenCustodyInformation: {
    data: ApplicantChildCustodyInformation[]
    date: string
  }
  userProfile: {
    data: UserInfo
    date: string
  }
}

interface MockChildren extends NationalRegistryIndividual {
  livesWithApplicant: 'yes' | undefined
  livesWithBothParents: 'yes' | undefined
  applicantSoleCustody: 'yes' | undefined
  otherParent: number
}

export interface MockData {
  applicant: NationalRegistryIndividual
  parents: NationalRegistryIndividual[]
  children: MockChildren[]
}
