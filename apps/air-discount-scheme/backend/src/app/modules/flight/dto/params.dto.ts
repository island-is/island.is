import { IsISO8601, IsString, IsUUID, Length } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class GetFlightParams {
  @IsUUID()
  @ApiProperty()
  readonly flightId!: string
}

export class DeleteFlightParams {
  @IsUUID()
  @ApiProperty()
  readonly flightId!: string
}

export class CreateFlightParams {
  @IsString()
  @Length(8, 8)
  @ApiProperty()
  readonly discountCode!: string
}

export class CheckFlightParams {
  @IsString()
  @Length(8, 8)
  @ApiProperty()
  readonly discountCode!: string

  @IsString()
  @ApiProperty()
  readonly origin!: string

  @IsString()
  @ApiProperty()
  readonly destination!: string

  @IsISO8601()
  @ApiProperty()
  readonly date!: string
}

export class GetUserFlightsParams {
  @IsString()
  @Length(10, 10)
  @ApiProperty()
  readonly nationalId!: string
}

export class DeleteFlightLegParams {
  @IsUUID()
  @ApiProperty()
  readonly flightId!: string

  @IsUUID()
  @ApiProperty()
  readonly flightLegId!: string
}
