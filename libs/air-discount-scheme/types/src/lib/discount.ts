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

export interface ExplicitCode {
  id: string
  code: string
  employeeId: string
  customerId: string
  flightId?: string
  comment: string
  created: Date
  modified: Date
}
