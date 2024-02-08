import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import {
  NewDiscount,
  DiscountedFlight,
  DiscountedFlightLeg,
  AirDiscount,
} from '../newDiscount.model'
import { User } from '../../user/user.model'

export class AirDiscountViewModel {
  constructor(airdiscount: AirDiscount) {
    this.id = airdiscount.id
    this.code = airdiscount.code
    this.comment = airdiscount.comment
    this.explicit = airdiscount.explicit
    this.employeeId = airdiscount.employeeId
    this.active = airdiscount.active
    this.isConnectionCode = airdiscount.isConnectionCode
    this.validUntil = airdiscount.validUntil
    this.usedAt = airdiscount.usedAt
    this.hasReturnFlight = airdiscount.hasReturnFlight
  }

  @ApiProperty()
  readonly id: string

  @ApiProperty()
  readonly code: string

  @ApiPropertyOptional()
  readonly comment?: string

  @ApiProperty()
  readonly explicit: boolean

  @ApiPropertyOptional()
  readonly employeeId?: string

  @ApiProperty()
  readonly active: boolean

  @ApiProperty()
  readonly isConnectionCode: boolean

  @ApiProperty()
  readonly validUntil: string

  @ApiPropertyOptional()
  readonly usedAt?: string

  @ApiProperty()
  readonly hasReturnFlight: boolean
}

export class DiscountedFlightLegViewModel {
  constructor(flightLeg: DiscountedFlightLeg) {
    this.id = flightLeg.id
    this.origin = flightLeg.origin
    this.destination = flightLeg.destination
  }

  @ApiProperty()
  readonly id: string

  @ApiProperty()
  readonly origin: string

  @ApiProperty()
  readonly destination: string
}

export class DiscountedFlightViewModel {
  constructor(flight: DiscountedFlight) {
    this.id = flight.id
    this.flightLegs = (flight.flightLegs ?? []).map(
      (flightLeg) => new DiscountedFlightLegViewModel(flightLeg),
    )
    this.isConnectionFlight = flight.isConnectionFlight
    this.discount = flight.discount
  }

  @ApiProperty()
  readonly id: string

  @ApiProperty()
  readonly isConnectionFlight: boolean

  @ApiProperty()
  readonly discount: AirDiscountViewModel

  @ApiProperty({ type: [DiscountedFlightLegViewModel] })
  readonly flightLegs: DiscountedFlightLegViewModel[]
}

export class NewDiscountViewModel {
  constructor(discount: NewDiscount) {
    this.id = discount.id
    this.nationalId = discount.nationalId
    this.discountedFlights = (discount.discountedFlights ?? []).map(
      (flight) => new DiscountedFlightViewModel(flight),
    )
    this.active = discount.active
    this.usedAt = discount.usedAt
    this.user = discount.user
  }

  @ApiProperty()
  readonly id: string

  @ApiProperty()
  user: User

  @ApiProperty()
  readonly nationalId: string

  @ApiProperty()
  readonly active: boolean

  @ApiPropertyOptional()
  readonly usedAt?: string

  @ApiProperty({ type: [DiscountedFlightViewModel] })
  readonly discountedFlights: DiscountedFlightViewModel[]
}
