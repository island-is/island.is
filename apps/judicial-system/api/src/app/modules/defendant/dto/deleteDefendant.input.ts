import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class DeleteDefendantInput {
  @Allow()
  @Field()
  readonly caseId!: string

  @Allow()
  @Field()
  readonly defendantId!: string
}
