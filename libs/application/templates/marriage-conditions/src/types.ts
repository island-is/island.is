import { dataSchema } from './lib/dataSchema'
import { z } from 'zod'

export type Individual = {
  person: {
    name: string
    nationalId: string
  }
  phone: string
  email: string
}

export const YES = 'yes'
export const NO = 'no'

type YesOrNo = 'yes' | 'no'

export interface MarriageConditionsFakeData {
  useFakeData?: YesOrNo
  maritalStatus: string
  genderCode: string
}

export type PersonalInfo = {
  address: string
  citizenship: string
  maritalStatus: string
}

export type Ceremony = {
  hasDate: string
  withDate: {
    date: string
    ceremonyPlace: string
    office: string
    society: string
  }
  withPeriod: {
    dateFrom: string
    dateTil: string
  }
}

export type MarriageConditionsAnswers = z.infer<typeof dataSchema>
