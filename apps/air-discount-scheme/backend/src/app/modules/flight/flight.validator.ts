import { IsString, Length, IsUUID } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class GetFlightParams {
  @IsUUID()
  @ApiProperty()
  readonly flightId: string
}

export class DeleteFlightParams {
  @IsUUID()
  @ApiProperty()
  readonly flightId: string
}

export class CreateFlightParams {
  @IsString()
  @Length(8, 8)
  @ApiProperty()
  readonly discountCode: string
}

export class GetFlightLegFundsParams {
  @IsString()
  @Length(10, 10)
  @ApiProperty()
  readonly nationalId: string
}

export class GetUserFlightsParams {
  @IsString()
  @Length(10, 10)
  @ApiProperty()
  readonly nationalId: string
}
