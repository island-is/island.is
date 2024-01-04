import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class GetSignedUrlInput {
  @Allow()
  @Field()
  readonly id!: string

  @Allow()
  @Field()
  readonly caseId!: string
}
