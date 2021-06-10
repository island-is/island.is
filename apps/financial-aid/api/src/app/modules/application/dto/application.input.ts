import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class ApplicationInput {
  @Allow()
  @Field()
  readonly id!: string
}
