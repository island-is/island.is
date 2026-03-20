import { Allow } from 'class-validator'

import { Field, ID, InputType } from '@nestjs/graphql'

@InputType()
export class PoliceCaseUnitsQueryInput {
  @Allow()
  @Field(() => ID)
  readonly caseId!: string

  @Allow()
  @Field(() => [String], {
    description: 'National IDs of defendants to fetch case units for',
  })
  readonly nationalIds!: string[]
}
