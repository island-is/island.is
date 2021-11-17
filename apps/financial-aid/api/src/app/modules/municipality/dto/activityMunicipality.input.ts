import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class ActivityMunicipalityInput {
  @Allow()
  @Field()
  readonly id!: string

  @Allow()
  @Field()
  readonly active!: boolean
}
