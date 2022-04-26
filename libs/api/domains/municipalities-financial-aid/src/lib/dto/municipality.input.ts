import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

@InputType('MunicipalitiesFinancialAidMunicipalityInput')
export class MunicipalityInput {
  @Allow()
  @Field()
  readonly id!: string
}
