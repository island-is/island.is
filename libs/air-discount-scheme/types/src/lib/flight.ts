export type FlightLeg = {
  id: string
  flightId: string
  airline: string
  destination: string
  origin: string
  originalPrice: number
  discountPrice: number
  financialState: string
  flight: Flight
  date: Date
  created: Date
  modified: Date
}

export type UserInfo = {
  age: number
  gender: 'kk' | 'kvk'
  postalCode: number
}

export type Flight = {
  id: string
  nationalId: string
  userInfo: UserInfo
  bookingDate: Date
  flightLegs: FlightLeg[]
  created: Date
  modified: Date
}

export type Travel = {
  from?: string
  to?: string
}

export type PeriodInput = {
  from: Date
  to: Date
}

export type RangeInput = {
  from?: number
  to?: number
}

export type FlightLegsInput = {
  airline?: string
  flightLeg?: Travel
  period: PeriodInput
  state?: string[]
  age?: RangeInput
  gender?: 'kk' | 'kvk'
  postalCode?: number
}
