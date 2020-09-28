import { ApiProperty } from '@nestjs/swagger'

import { Flight, FlightLeg } from '../flight.model'

export class FlightLegViewModel {
  constructor(flightLeg: FlightLeg) {
    this.id = flightLeg.id
    this.origin = flightLeg.origin
    this.destination = flightLeg.destination
    this.originalPrice = flightLeg.originalPrice
    this.discountPrice = flightLeg.discountPrice
    this.date = flightLeg.date
  }

  @ApiProperty()
  readonly id: string

  @ApiProperty()
  readonly origin: string

  @ApiProperty()
  readonly destination: string

  @ApiProperty()
  readonly originalPrice: number

  @ApiProperty()
  readonly discountPrice: number

  @ApiProperty()
  readonly date: Date
}

export class FlightViewModel {
  constructor(flight: Flight) {
    this.id = flight.id
    this.bookingDate = flight.bookingDate
    this.flightLegs = flight.flightLegs.map(
      (flightLeg) => new FlightLegViewModel(flightLeg),
    )
  }

  @ApiProperty()
  readonly id: string

  @ApiProperty()
  readonly bookingDate: Date

  @ApiProperty({ type: [FlightLegViewModel] })
  readonly flightLegs: FlightLegViewModel[]
}
