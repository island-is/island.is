import { Field, InputType } from '@nestjs/graphql'
import { Allow } from 'class-validator'

@InputType()
export class ApplicationInput {
  @Allow()
  @Field()
  readonly id!: string
}
