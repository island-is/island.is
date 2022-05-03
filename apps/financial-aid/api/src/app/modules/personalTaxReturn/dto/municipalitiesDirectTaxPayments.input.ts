import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

import { UserType } from '@island.is/financial-aid/shared/lib'

@InputType()
export class MunicipalitiesDirectTaxPaymentsInput {
  @Allow()
  @Field(() => String)
  readonly userType!: UserType
}
