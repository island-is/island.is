import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

@InputType('MunicipalitiesFinancialAidCreateSignedUrlInput')
export class CreateSignedUrlInput {
  @Allow()
  @Field()
  readonly fileName!: string

  @Allow()
  @Field()
  readonly folder!: string
}
