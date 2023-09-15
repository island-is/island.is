import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class MunicipalitiesPersonalTaxReturnIdInput {
  @Allow()
  @Field()
  readonly id!: string
}
