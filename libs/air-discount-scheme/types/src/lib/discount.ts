import { FlightLegsLeft } from './flight'

export interface Discount {
  discountCode: string
  nationalId: string
  expires: Date
  flightLegsLeft: FlightLegsLeft
}
