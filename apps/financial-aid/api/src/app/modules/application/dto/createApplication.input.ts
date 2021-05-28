import { Allow } from 'class-validator'

import { Field, InputType } from '@nestjs/graphql'

import {
  CreateApplication,
  HomeCircumstances,
  Employment,
} from '@island.is/financial-aid/shared'

@InputType()
export class CreateApplicationInput implements CreateApplication {
  @Allow()
  @Field()
  readonly nationalId!: string

  @Allow()
  @Field()
  readonly name!: string

  @Allow()
  @Field()
  readonly phoneNumber!: string

  @Allow()
  @Field()
  readonly email!: string

  @Allow()
  @Field(() => String)
  readonly homeCircumstances!: HomeCircumstances

  @Allow()
  @Field({ nullable: true })
  readonly homeCircumstancesCustom?: string

  @Allow()
  @Field()
  readonly student!: boolean

  @Allow()
  @Field(() => String)
  readonly employment!: Employment

  @Allow()
  @Field({ nullable: true })
  readonly employmentCustom?: string

  @Allow()
  @Field()
  readonly hasIncome!: boolean

  @Allow()
  @Field()
  readonly usePersonalTaxCredit!: boolean

  @Allow()
  @Field({ nullable: true })
  readonly bankNumber?: string

  @Allow()
  @Field({ nullable: true })
  readonly ledger?: string

  @Allow()
  @Field({ nullable: true })
  readonly accountNumber?: string

  @Allow()
  @Field({ nullable: true })
  readonly interview?: boolean
}
