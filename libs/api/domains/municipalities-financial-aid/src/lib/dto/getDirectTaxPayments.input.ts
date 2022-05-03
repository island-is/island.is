import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

import { UserType } from '@island.is/financial-aid/shared/lib'

@InputType('MunicipalitiesGetDirectTaxPaymentsInput')
export class GetDirectTaxPaymentsInput {
  @Allow()
  @Field(() => String)
  readonly userType!: UserType
}
