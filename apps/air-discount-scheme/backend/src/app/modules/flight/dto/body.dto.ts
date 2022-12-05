import {
  IsOptional,
  IsObject,
  IsEnum,
  IsArray,
  ArrayMinSize,
  ValidateNested,
  IsString,
  IsNumber,
  IsISO8601,
  IsBoolean,
} from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

import { Airlines, States } from '@island.is/air-discount-scheme/consts'
import { Gender } from '@island.is/air-discount-scheme/types'
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
export class GetFlightLegsBody {
  @IsOptional()
  @IsEnum(Object.keys(Airlines))
  airline?: string

  @IsOptional()
  @IsObject()
  flightLeg?: Travel

  @IsOptional()
  @IsObject()
  period?: PeriodInput

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @IsEnum(States)
  state?: string[]

  @IsOptional()
  @IsObject()
  age?: RangeInput

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender

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
