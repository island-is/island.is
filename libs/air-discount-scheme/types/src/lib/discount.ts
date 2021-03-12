export interface Discount {
  discountCode: string
  connectionDiscountCodes: {code: string, flightId: string}[]
  nationalId: string
  expiresIn: number
}
