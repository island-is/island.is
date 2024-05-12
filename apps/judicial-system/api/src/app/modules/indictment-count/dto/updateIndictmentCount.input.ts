import { Allow } from 'class-validator'
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
  @Field(() => String, { nullable: true })
  readonly policeCaseNumber?: string

  @Allow()
  @Field(() => String, { nullable: true })
  readonly vehicleRegistrationNumber?: string

  @Allow()
  @Field(() => [IndictmentCountOffense], { nullable: true })
  readonly offenses?: IndictmentCountOffense[]

  @Allow()
  @Field(() => GraphQLJSONObject, { nullable: true })
  readonly substances?: SubstanceMap

  @Allow()
  @Field(() => [[Number, Number]], { nullable: true })
  readonly lawsBroken?: [number, number][]

  @Allow()
  @Field(() => String, { nullable: true })
  readonly incidentDescription?: string

  @Allow()
  @Field(() => String, { nullable: true })
  readonly legalArguments?: string
}
