import { FlightLegFund } from './flight'

export interface Discount {
  discountCode: string
  nationalId: string
  expires: Date
  flightLegFund: FlightLegFund
}
