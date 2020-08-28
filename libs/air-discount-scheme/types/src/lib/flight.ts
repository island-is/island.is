export type FlightLegFund = {
  nationalId: string
  unused: number
  total: number
}

export type FlightLeg = {
  id: string
  flightId: string
  destination: string
  origin: string
  originalPrice: number
  discountPrice: number
  flight: Flight
  date: Date
  created: Date
  modified: Date
}

export type Flight = {
  id: string
  nationalId: string
  airline: string
  invalid: boolean
  bookingDate: Date
  flightLegs: FlightLeg[]
  created: Date
  modified: Date
}
