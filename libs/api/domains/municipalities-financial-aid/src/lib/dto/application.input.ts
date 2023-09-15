import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

@InputType('MunicipalitiesFinancialAidApplicationInput')
export class ApplicationInput {
  @Allow()
  @Field()
  readonly id!: string
}
