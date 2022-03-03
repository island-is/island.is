import { Field, InputType } from '@nestjs/graphql'
import { Allow } from 'class-validator'

@InputType()
export class RequestSignatureInput {
  @Allow()
  @Field()
  readonly caseId!: string
}
