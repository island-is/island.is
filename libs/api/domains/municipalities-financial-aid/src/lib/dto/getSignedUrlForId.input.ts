import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

@InputType('MunicipalitiesFinancialAidGetSignedUrlInput')
export class GetSignedUrlInput {
  @Allow()
  @Field()
  readonly id!: string
}
