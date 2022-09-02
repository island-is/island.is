import { MarriageTermination } from './lib/constants'

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
  maritalStatus?: string
}

export type PersonalInfo = {
  address: string
  citizenship: string
  maritalStatus: string
  previousMarriageTermination: MarriageTermination
}

export type Ceremony = {
  date: string
  ceremonyPlace: string
  office: string
  society: string
}
