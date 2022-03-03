import { Field, InputType } from '@nestjs/graphql'
import { Allow } from 'class-validator'

@InputType()
export class StaffInput {
  @Allow()
  @Field()
  readonly id!: string
}
