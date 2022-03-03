import { Field, InputType } from '@nestjs/graphql'
import { Allow } from 'class-validator'

@InputType()
export class UserQueryInput {
  @Allow()
  @Field()
  readonly id!: string
}
