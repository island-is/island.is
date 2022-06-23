import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

import {
  UpdateApplication,
  ApplicationState,
  ApplicationEventType,
} from '@island.is/financial-aid/shared/lib'
import { CreateAmountInput } from '../../amount'
import { DirectTaxPaymentInput } from './directTaxPayment.input'

@InputType()
export class UpdateApplicationInput implements UpdateApplication {
  @Allow()
  @Field()
  readonly id!: string

  @Allow()
  @Field(() => String, { nullable: true })
  readonly state?: ApplicationState

  @Allow()
  @Field(() => String)
  readonly event!: ApplicationEventType

  @Allow()
  @Field({ nullable: true })
  readonly rejection?: string

  @Allow()
  @Field({ nullable: true })
  readonly comment?: string

  @Allow()
  @Field({ nullable: true })
  readonly staffId?: string

  @Allow()
  @Field({ nullable: true })
  readonly spouseEmail?: string

  @Allow()
  @Field({ nullable: true })
  readonly spousePhoneNumber?: string

  @Allow()
  @Field({ nullable: true })
  readonly spouseName?: string

  @Allow()
  @Field({ nullable: true })
  readonly spouseFormComment?: string

  @Allow()
  @Field({ nullable: true })
  readonly amount?: CreateAmountInput

  @Allow()
  @Field({ nullable: true })
  readonly spouseHasFetchedDirectTaxPayment!: boolean

  @Allow()
  @Field(() => [DirectTaxPaymentInput], { nullable: true })
  readonly directTaxPayments?: DirectTaxPaymentInput[]
}
