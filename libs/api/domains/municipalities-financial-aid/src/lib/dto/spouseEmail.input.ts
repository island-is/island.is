import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

@InputType('MunicipalitiesFinancialAidSpouseEmailInput')
export class SpouseEmailInput {
  @Allow()
  @Field()
  readonly name!: string

  @Allow()
  @Field()
  readonly email!: string

  @Allow()
  @Field()
  readonly spouseName!: string

  @Allow()
  @Field()
  readonly spouseEmail!: string

  @Allow()
  @Field()
  readonly municipalityCode!: string

  @Allow()
  @Field()
  readonly created!: Date

  @Allow()
  @Field()
  readonly applicationSystemId!: string
}
