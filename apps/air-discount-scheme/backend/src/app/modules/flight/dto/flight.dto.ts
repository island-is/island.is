import {
  ArrayMinSize,
  ValidateNested,
  IsString,
  IsNumber,
  IsISO8601,
  IsEnum,
  IsObject,
  IsOptional,
  IsUUID,
  Length,
} from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

import { States, Airlines } from '@island.is/air-discount-scheme/consts'

export class FlightLegDto {
  @IsString()
  @ApiProperty()
  readonly origin: string

  @IsString()
  @ApiProperty()
  readonly destination: string

  @IsNumber()
  @ApiProperty()
  readonly originalPrice: number

  @IsNumber()
  @ApiProperty()
  readonly discountPrice: number

  @IsISO8601()
  @ApiProperty()
  readonly date: Date
}

export class FlightDto {
  @IsISO8601()
  @ApiProperty()
  readonly bookingDate: Date

  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => FlightLegDto)
  @ApiProperty({ type: [FlightLegDto] })
  readonly flightLegs: FlightLegDto[]
}

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

export class GetUserFlightsParams {
  @IsString()
  @Length(10, 10)
  @ApiProperty()
  readonly nationalId: string
}

export class DeleteFlightLegParams {
  @IsUUID()
  @ApiProperty()
  readonly flightId: string

  @IsUUID()
  @ApiProperty()
  readonly flightLegId: string
}

type FlightLeg = {
  from: string
  to: string
}

type Period = {
  from: Date
  to: Date
}

type Range = {
  from: number
  to: number
}

export class GetFlightsBody {
  @IsOptional()
  @IsEnum(Object.keys(Airlines))
  airline: string

  @IsOptional()
  @IsObject()
  flightLeg: FlightLeg

  @IsOptional()
  @IsObject()
  period: Period

  @IsOptional()
  @IsEnum(Object.values(States))
  state: string

  @IsOptional()
  @IsObject()
  age: Range

  @IsOptional()
  @IsEnum(['kk', 'kvk'])
  gender: string

  @IsOptional()
  @IsNumber()
  postalCode: number
}
