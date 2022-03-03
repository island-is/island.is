import { Field, InputType } from '@nestjs/graphql'
import { Allow } from 'class-validator'

@InputType()
export class ApplicationSearchInput {
  @Allow()
  @Field()
  readonly nationalId!: string
}
