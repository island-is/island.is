import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class UpdateApiKeyInput {
  @Allow()
  @Field()
  readonly id!: string

  @Allow()
  @Field()
  readonly name!: string
}
