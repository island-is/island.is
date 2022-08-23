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
