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
