import { Allow } from 'class-validator'

import { Field, ID, InputType } from '@nestjs/graphql'

@InputType()
export class UploadPoliceCaseFileInput {
  @Allow()
  @Field(() => ID)
  readonly caseId!: string

  @Allow()
  @Field(() => ID)
  readonly id!: string

  @Allow()
  @Field(() => String)
  readonly name!: string
}
