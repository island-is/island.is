import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class UploadPoliceCaseFileInput {
  @Allow()
  @Field()
  readonly caseId!: string

  @Allow()
  @Field()
  readonly id!: string

  @Allow()
  @Field()
  readonly name!: string
}
