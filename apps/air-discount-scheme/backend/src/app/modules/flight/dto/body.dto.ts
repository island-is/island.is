import {
  IsOptional,
  IsEnum,
  ArrayMinSize,
  ValidateNested,
  IsString,
  IsNumber,
  IsISO8601,
  IsBoolean,
  IsDate,
} from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { Airlines, States } from '@island.is/air-discount-scheme/consts'
import type {
  Travel,
  RangeInput,
  PeriodInput,
  FlightLegsInput,
} from '@island.is/air-discount-scheme/types'

export class CreateFlightLegBody {
  @IsString()
  @ApiProperty()
  readonly origin!: string

  @IsString()
  @ApiProperty()
  readonly destination!: string

  @IsNumber()
  @ApiProperty()
  readonly originalPrice!: number

  @IsNumber()
  @ApiProperty()
  readonly discountPrice!: number

  @IsISO8601()
  @ApiProperty()
  readonly date!: Date

  @IsOptional()
  @IsEnum([Airlines.norlandair])
  @ApiProperty({ enum: [Airlines.norlandair] })
  readonly cooperation?: string
}
export class CheckFlightLegBody {
  @IsString()
  @ApiProperty()
  readonly origin!: string

  @IsString()
  @ApiProperty()
  readonly destination!: string

  @IsISO8601()
  @ApiProperty()
  readonly date!: Date
}

export class CreateFlightBody {
  @IsISO8601()
  @ApiProperty()
  readonly bookingDate!: Date

  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateFlightLegBody)
  @ApiProperty({ type: [CreateFlightLegBody] })
  readonly flightLegs!: CreateFlightLegBody[]
}

export class FlightLegTravel implements Travel {
  @IsString()
  @ApiPropertyOptional()
  readonly from?: string

  @IsString()
  @ApiPropertyOptional()
  readonly to?: string
}

export class FlightLegPeriod implements PeriodInput {
  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  readonly from!: Date

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  readonly to!: Date
}

export class FlightLegRange implements RangeInput {
  @ApiProperty()
  @IsNumber()
  readonly from!: number

  @ApiProperty()
  @IsNumber()
  readonly to!: number
}

export class GetFlightLegsBody implements FlightLegsInput {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  nationalId?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(Object.keys(Airlines))
  airline?: string

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => FlightLegTravel)
  @ValidateNested()
  flightLeg?: FlightLegTravel

  @ApiProperty()
  @Type(() => FlightLegPeriod)
  @ValidateNested()
  period!: FlightLegPeriod

  @ApiPropertyOptional({
    enum: States,
    enumName: 'FlightLegState',
    isArray: true,
  })
  @IsOptional()
  @IsEnum(States, { each: true })
  state?: string[]

  @ApiProperty()
  @Type(() => FlightLegRange)
  @ValidateNested()
  age!: FlightLegRange

  @ApiPropertyOptional({
    enum: ['kk', 'kvk', 'hvk'],
    enumName: 'FlightLegGender',
  })
  @IsOptional()
  @IsEnum(['kk', 'kvk', 'hvk'])
  gender?: 'kk' | 'kvk' | 'hvk'

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  postalCode?: number

  @IsOptional()
  @IsBoolean()
  isExplicit?: boolean
}

export class CheckFlightBody {
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CheckFlightLegBody)
  @ApiProperty({ type: [CheckFlightLegBody] })
  readonly flightLegs!: CheckFlightLegBody[]
}

export class ConfirmInvoiceBody extends GetFlightLegsBody {}
