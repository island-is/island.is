import { Allow } from 'class-validator'

import { Field, ID, InputType } from '@nestjs/graphql'

@InputType()
export class CreatePresignedPostInput {
  @Allow()
  @Field(() => ID)
  readonly caseId!: string

  @Allow()
  @Field(() => String)
  readonly fileName!: string

  @Allow()
  @Field(() => String)
  readonly type!: string
}
