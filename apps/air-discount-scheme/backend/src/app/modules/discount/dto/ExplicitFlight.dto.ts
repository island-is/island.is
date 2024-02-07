export type ExplicitFlightLeg = {
  origin: string
  destination: string
  date: Date
}

export type ExplicitFlight = {
  connectable: boolean
  id: string
  flightLegs: Array<ExplicitFlightLeg>
}
