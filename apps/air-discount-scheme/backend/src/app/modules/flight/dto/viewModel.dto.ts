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
export class CheckFlightViewModel {
  constructor(status: string) {
    if (status === '200') {
      this.message = 'OK'
      this.statusCode = status
    } else {
      // Should not end here, CheckFlight should throw an exception instead
      this.message = 'Something went wrong'
      this.statusCode = '500'
    }
  }

  @ApiProperty()
  readonly message: string
  readonly statusCode: string
}
export class FlightViewModel {
  constructor(flight: Flight) {
    this.id = flight.id
    this.nationalId = FlightViewModel.maskNationalId(flight.nationalId)
    this.bookingDate = flight.bookingDate
    this.flightLegs = flight.flightLegs.map(
      (flightLeg) => new FlightLegViewModel(flightLeg),
    )
  }

  private static maskNationalId(nationalId: string): string {
    return `${nationalId.slice(0, 6)}xxx${nationalId.slice(-1)}`
  }

  @ApiProperty()
  readonly id: string

  @ApiProperty()
  readonly nationalId: string

  @ApiProperty()
  readonly bookingDate: Date

  @ApiProperty({ type: [FlightLegViewModel] })
  readonly flightLegs: FlightLegViewModel[]
}
