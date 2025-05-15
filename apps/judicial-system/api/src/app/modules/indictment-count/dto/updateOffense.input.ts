import { Allow, IsOptional } from 'class-validator'
import { GraphQLJSONObject } from 'graphql-type-json'

import { Field, ID, InputType } from '@nestjs/graphql'

import type { SubstanceMap } from '@island.is/judicial-system/types'

@InputType()
export class UpdateOffenseInput {
  @Allow()
  @Field(() => ID)
  readonly offenseId!: string

  @Allow()
  @Field(() => ID)
  readonly caseId!: string

  @Allow()
  @Field(() => ID)
  readonly indictmentCountId!: string

  @Allow()
  @IsOptional()
  @Field(() => GraphQLJSONObject, { nullable: true })
  readonly substances?: SubstanceMap
}
