import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class CreateApiKeyInput {
  @Allow()
  @Field()
  readonly name!: string

  @Allow()
  @Field()
  readonly municipalityCode!: string

  @Allow()
  @Field()
  readonly apiKey!: string
}
