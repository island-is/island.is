export type ConnectionDiscountCode = {
  code: string
  flightId: string
  flightDesc: string
  validUntil: string
}

export interface Discount {
  discountCode: string
  connectionDiscountCodes: ConnectionDiscountCode[]
  nationalId: string
  expiresIn: number
}
