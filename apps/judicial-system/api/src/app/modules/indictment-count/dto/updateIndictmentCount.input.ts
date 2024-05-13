import { Allow, IsArray, IsEnum, IsOptional } from 'class-validator'
import { GraphQLJSONObject } from 'graphql-type-json'

import { Field, ID, InputType } from '@nestjs/graphql'

import type { SubstanceMap } from '@island.is/judicial-system/types'
import { IndictmentCountOffense } from '@island.is/judicial-system/types'

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
  @IsEnum(IndictmentCountOffense, { each: true })
  @Field(() => [IndictmentCountOffense], { nullable: true })
  readonly offenses?: IndictmentCountOffense[]

  @Allow()
  @IsOptional()
  @Field(() => GraphQLJSONObject, { nullable: true })
  readonly substances?: SubstanceMap

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
}
