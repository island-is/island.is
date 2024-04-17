export enum PASSPORT_CHARGE_CODES {
  REGULAR = 'AY105',
  EXPRESS = 'AY106',
  DISCOUNT_REGULAR = 'AY107',
  DISCOUNT_EXPRESS = 'AY108',
}

export const YES = 'yes'
export const NO = 'no'
export type YesOrNo = 'yes' | 'no'

export type DiscountCheck = {
  hasDiscount: boolean
}

export type DistrictCommissionerAgencies = {
  name: string
  place: string
  address: string
  key: string
}
