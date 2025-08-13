import { YesOrNo } from '@island.is/application/core'

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
}

export type PersonalInfo = {
  address: string
  citizenship: string
  maritalStatus: string
}

export type Ceremony = {
  date: string
  ceremonyPlace: string
  office: string
  society: string
}

export enum PersonTypes {
  APPLICANT = 0,
  SPOUSE = 1,
  WITNESS = 2,
}

export type Person = {
  name: string
  ssn: string
  phoneNumber?: string
  email?: string
  homeAddress: string
  postalCode: string
  city: string
  signed: boolean
  type: number
}

const married = 'Gift/ur'

export const maritalStatuses: {
  [key: string]: string
} = {
  '1': 'Ógift/ur',
  '3': married,
  '4': 'Ekkja/Ekkill',
  '5': 'Skilin/nn/ð að borði og sæng',
  '6': 'Fráskilin/nn/ð',
  '7': married,
  '8': married,
  '9': 'Óupplýst',
  '0': married,
  L: married,
}

export const ALLOWED_MARITAL_STATUSES = ['1', '6', '4']
