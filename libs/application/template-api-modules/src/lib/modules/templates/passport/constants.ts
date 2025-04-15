export enum PassportChargeCodes {
  REGULAR = 'AY105',
  EXPRESS = 'AY106',
  DISCOUNT_REGULAR = 'AY107',
  DISCOUNT_EXPRESS = 'AY108',
}

export type DiscountCheck = {
  hasDiscount: boolean
}

export type DistrictCommissionerAgencies = {
  name: string
  place: string
  address: string
  key: string
}
