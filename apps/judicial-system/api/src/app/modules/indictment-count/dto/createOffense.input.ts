import { Allow, IsEnum } from 'class-validator'

import { Field, ID, InputType } from '@nestjs/graphql'

import { IndictmentCountOffense } from '@island.is/judicial-system/types'

@InputType()
export class CreateOffenseInput {
  @Allow()
  @Field(() => ID)
  readonly caseId!: string

  @Allow()
  @Field(() => ID)
  readonly indictmentCountId!: string

  @Allow()
  @IsEnum(IndictmentCountOffense)
  @Field(() => IndictmentCountOffense)
  readonly offense!: IndictmentCountOffense
}
