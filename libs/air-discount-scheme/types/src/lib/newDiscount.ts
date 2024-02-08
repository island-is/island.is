import { User } from './user'

export interface DiscountedFlightLeg {
  id: string
  discountFlightId?: string
  origin: string
  destination: string
}

export interface AirDiscount {
  id: string
  code: string
  discountFlightId?: string
  comment?: string
  explicit: boolean
  employeeId?: string
  active: boolean
  isConnectionCode: boolean
  validUntil: string
  usedAt?: string
  hasReturnFlight: boolean
}

export interface DiscountedFlight {
  id: string
  flightLegs: DiscountedFlightLeg[]
  isConnectionFlight: boolean
  discount: AirDiscount
}

export interface NewDiscount {
  id: string
  user: User
  nationalId: string
  discountedFlights: DiscountedFlight[]
  active: boolean
  usedAt?: string
}
