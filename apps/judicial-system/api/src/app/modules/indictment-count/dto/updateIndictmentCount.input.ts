import {
  Allow,
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator'

import { Field, ID, InputType, Int } from '@nestjs/graphql'

import { IndictmentSubtype } from '@island.is/judicial-system/types'

@InputType()
export class UpdateIndictmentCountInput {
  @Allow()
  @Field(() => ID)
  readonly caseId!: string

  @Allow()
  @Field(() => ID)
  readonly indictmentCountId!: string

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly policeCaseNumber?: string

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly vehicleRegistrationNumber?: string

  @Allow()
  @IsOptional()
  @IsArray()
  @Field(() => [[Number, Number]], { nullable: true })
  readonly lawsBroken?: [number, number][]

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly incidentDescription?: string

  @Allow()
  @IsOptional()
  @Field(() => String, { nullable: true })
  readonly legalArguments?: string

  @Allow()
  @IsOptional()
  @IsArray()
  @IsEnum(IndictmentSubtype, { each: true })
  @Field(() => [IndictmentSubtype], { nullable: true })
  readonly policeCaseNumberSubtypes?: IndictmentSubtype[]

  @Allow()
  @IsOptional()
  @IsArray()
  @IsEnum(IndictmentSubtype, { each: true })
  @Field(() => [IndictmentSubtype], { nullable: true })
  readonly indictmentCountSubtypes?: IndictmentSubtype[]

  @Allow()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Field(() => Int, { nullable: true })
  readonly recordedSpeed?: number

  @Allow()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Field(() => Int, { nullable: true })
  readonly speedLimit?: number
}
