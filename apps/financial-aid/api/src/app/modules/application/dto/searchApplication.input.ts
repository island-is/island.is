import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class SearchApplicationInput {
  @Allow()
  @Field()
  readonly nationalId!: string
}
