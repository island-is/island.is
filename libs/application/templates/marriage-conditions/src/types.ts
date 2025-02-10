import { YesOrNo } from '@island.is/application/core'
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
  date: string
  period: {
    dateFrom: string
    dateTo: string
  }
  place: {
    ceremonyPlace: string
    office: string
    society: string
  }
}

export type MarriageConditionsAnswers = z.infer<typeof dataSchema>
