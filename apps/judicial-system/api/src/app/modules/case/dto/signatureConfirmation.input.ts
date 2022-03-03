import { Field, InputType } from '@nestjs/graphql'
import { Allow } from 'class-validator'

@InputType()
export class SignatureConfirmationQueryInput {
  @Allow()
  @Field()
  readonly caseId!: string

  @Allow()
  @Field()
  documentToken!: string
}
