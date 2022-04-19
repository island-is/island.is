import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

import {
  HomeCircumstances,
  Employment,
  ApplicationState,
  FamilyStatus,
} from '@island.is/financial-aid/shared/lib'
import { CreateApplicationFileInput, DirectTaxPaymentInput } from '.'

@InputType()
export class CreateMunicipalitiesApplicationInput {
  @Allow()
  @Field()
  readonly name!: string

  @Allow()
  @Field()
  readonly nationalId!: string

  @Allow()
  @Field({ nullable: true })
  readonly phoneNumber!: string

  @Allow()
  @Field()
  readonly email!: string

  @Allow()
  @Field(() => String)
  readonly homeCircumstances!: HomeCircumstances

  @Allow()
  @Field({ nullable: true })
  readonly homeCircumstancesCustom!: string

  @Allow()
  @Field()
  readonly student!: boolean

  @Allow()
  @Field({ nullable: true })
  readonly studentCustom!: string

  @Allow()
  @Field(() => String)
  readonly employment!: Employment

  @Allow()
  @Field({ nullable: true })
  readonly employmentCustom!: string

  @Allow()
  @Field()
  readonly hasIncome!: boolean

  @Allow()
  @Field()
  readonly usePersonalTaxCredit!: boolean

  @Allow()
  @Field({ nullable: true })
  readonly bankNumber!: string

  @Allow()
  @Field({ nullable: true })
  readonly ledger!: string

  @Allow()
  @Field({ nullable: true })
  readonly accountNumber!: string

  @Allow()
  @Field({ nullable: true })
  readonly interview!: boolean

  @Allow()
  @Field({ nullable: true })
  readonly formComment!: string

  @Allow()
  @Field(() => String)
  readonly state!: ApplicationState

  @Allow()
  @Field(() => [CreateApplicationFileInput])
  readonly files!: string[]

  @Allow()
  @Field({ nullable: true })
  readonly amount!: number

  @Allow()
  @Field({ nullable: true })
  readonly spouseName!: string

  @Allow()
  @Field({ nullable: true })
  readonly spouseNationalId!: string

  @Allow()
  @Field({ nullable: true })
  readonly spouseEmail!: string

  @Allow()
  @Field({ nullable: true })
  readonly spousePhoneNumber!: string

  @Allow()
  @Field({ nullable: true })
  readonly spouseFormComment!: string

  @Allow()
  @Field(() => String)
  readonly familyStatus!: FamilyStatus

  @Allow()
  @Field({ nullable: true })
  readonly city!: string

  @Allow()
  @Field({ nullable: true })
  readonly streetName!: string

  @Allow()
  @Field({ nullable: true })
  readonly municipalityCode!: string

  @Allow()
  @Field({ nullable: true })
  readonly postalCode!: string

  @Allow()
  @Field(() => [DirectTaxPaymentInput])
  readonly directTaxPayments!: string[]

  @Allow()
  @Field({ nullable: true })
  readonly applicationSystemId!: string
}
