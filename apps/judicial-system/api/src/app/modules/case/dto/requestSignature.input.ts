import { Allow } from 'class-validator'

import { Field, ID, InputType } from '@nestjs/graphql'

@InputType()
export class RequestSignatureInput {
  @Allow()
  @Field(() => ID)
  readonly caseId!: string
}
