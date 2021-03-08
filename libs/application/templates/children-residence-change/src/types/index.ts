import { Application } from '@island.is/application/core'
import { answersSchema } from '../lib/dataSchema'

type Override<T1, T2> = Omit<T1, keyof T2> & T2

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
  parentNationalRegistry: {
    data: PersonResidenceChange
  }
  childrenNationalRegistry: {
    data: PersonResidenceChange
  }
  userProfile: {
    data: UserInfo
  }
}

// We are using mockData that is not defined in the zod schema
export interface Answers extends answersSchema {
  mockData: ExternalData
}

type CRCApplicationWithAnswers = {
  answers: Answers
}

export type CRCApplication = Override<Application, CRCApplicationWithAnswers>
