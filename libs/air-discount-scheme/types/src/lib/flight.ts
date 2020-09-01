export type FlightLeg = {
  id: string
  flightId: string
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

export type Flight = {
  id: string
  nationalId: string
  airline: string
  bookingDate: Date
  flightLegs: FlightLeg[]
  created: Date
  modified: Date
}
