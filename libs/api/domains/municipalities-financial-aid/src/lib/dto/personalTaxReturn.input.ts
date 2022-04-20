import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

@InputType('MunicipalitiesFinancialAidPersonalTaxReturnInput')
export class PersonalTaxReturnInput {
  @Allow()
  @Field()
  readonly folderId!: string
}
