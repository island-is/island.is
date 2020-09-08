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

import { environment } from '../../../../environments'
import { States } from '@island.is/air-discount-scheme/consts'

class FlightLegDto {
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
