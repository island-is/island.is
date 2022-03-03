import { Field, InputType } from '@nestjs/graphql'
import { Allow } from 'class-validator'

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
