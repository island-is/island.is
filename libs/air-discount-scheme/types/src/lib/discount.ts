export interface Discount {
  discountCode: string
  connectionDiscountCodes: {
    code: string
    flightId: string
    validUntil: string
  }[]
  nationalId: string
  expiresIn: number
}
