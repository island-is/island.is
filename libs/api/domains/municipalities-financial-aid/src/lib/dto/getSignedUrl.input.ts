import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class FinancialAidMunicipalitiesCreateSignedUrlInput {
  @Allow()
  @Field()
  readonly fileName!: string

  @Allow()
  @Field()
  readonly folder!: string
}
