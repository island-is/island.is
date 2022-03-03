import { Field, InputType } from '@nestjs/graphql'
import { Allow } from 'class-validator'

@InputType()
export class DeleteDefendantInput {
  @Allow()
  @Field()
  readonly caseId!: string

  @Allow()
  @Field()
  readonly defendantId!: string
}
