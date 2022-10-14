export type ConnectionDiscountCode = {
  code: string
  flightId: string
  flightDesc: string
  validUntil: string
  explicitBy: string
}

export interface Discount {
  discountCode: string
  connectionDiscountCodes: ConnectionDiscountCode[]
  nationalId: string
  expiresIn: number
  explicitBy: string
}
