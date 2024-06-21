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

export interface IdentityDocumentChild {
  childNationalId: string
  secondParent: string
  secondParentName: string
  childName: string
  passports?: IdentityDocument[]
}

export type IdentityDocument = {
  number: string
  type: string
  verboseType: string
  subType: string
  status: string
  issuingDate: string
  expirationDate: string
  displayFirstName: string
  displayLastName: string
  mrzFirstName: string
  mrzLastName: string
  sex: string
}
