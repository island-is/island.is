export type ConnectionDiscountCodes = {
  code: string
  flightId: string
  flightDesc: string
  validUntil: string
}[]
export interface Discount {
  discountCode: string
  connectionDiscountCodes: ConnectionDiscountCodes
  nationalId: string
  expiresIn: number
}
