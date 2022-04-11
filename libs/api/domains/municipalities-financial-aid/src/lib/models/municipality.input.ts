import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class FinancialAidMunicipalityInput {
  @Allow()
  @Field()
  readonly id!: string
}
