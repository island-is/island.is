import { Field, InputType } from '@nestjs/graphql'
import { Allow } from 'class-validator'

@InputType()
export class MunicipalityActivityInput {
  @Allow()
  @Field()
  readonly id!: string

  @Allow()
  @Field()
  readonly active!: boolean
}
