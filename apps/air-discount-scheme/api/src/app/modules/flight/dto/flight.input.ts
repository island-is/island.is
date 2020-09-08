import { Field, InputType } from '@nestjs/graphql'
import {
  IsEnum,
  IsString,
  IsOptional,
  IsObject,
  IsNumber,
  IsDate,
} from 'class-validator'

import { States } from '@island.is/air-discount-scheme/consts'

@InputType()
class FlightLeg {
  @Field()
  @IsString()
  from: string

  @Field()
  @IsString()
  to: string
}

@InputType()
class Period {
  @Field()
  @IsDate()
  from: Date

  @Field()
  @IsDate()
  to: Date
}

@InputType()
class Range {
  @Field()
  @IsNumber()
  from: number

  @Field()
  @IsNumber()
  to: number
}

@InputType()
export class FlightsInput {
  @Field((_) => String, { nullable: true })
  @IsOptional()
  @IsEnum(['ernir', 'norlandair', 'icelandair'])
  airline: string

  @Field((_) => FlightLeg, { nullable: true })
  @IsOptional()
  @IsObject()
  flightLeg: FlightLeg

  @Field((_) => Period, { nullable: true })
  @IsOptional()
  @IsObject()
  period: Period

  @Field((_) => String, { nullable: true })
  @IsOptional()
  @IsEnum(Object.values(States))
  state: string

  @Field((_) => Range, { nullable: true })
  @IsOptional()
  @IsObject()
  age: Range

  @Field((_) => String, { nullable: true })
  @IsOptional()
  @IsEnum(['kk', 'kvk'])
  gender: string

  @Field((_) => Number, { nullable: true })
  @IsOptional()
  @IsNumber()
  postalCode: number
}
