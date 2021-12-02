import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class ApplicationSearchInput {
  @Allow()
  @Field()
  readonly nationalId!: string
}
