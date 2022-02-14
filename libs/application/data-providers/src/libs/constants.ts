export const YES = 'yes'
export const NO = 'no'

type YesOrNo = 'yes' | 'no'

export interface DataProviderFakeData {
  useFakeData?: YesOrNo
  qualityPhoto?: YesOrNo
}
