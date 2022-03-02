import { Field, ObjectType, ID } from '@nestjs/graphql'

import {
  ApplicationModelHomeCircumstancesEnum,
  ApplicationModelEmploymentEnum,
  ApplicationModelStateEnum,
  ApplicationFileModel,
  ApplicationEventModel,
  AmountModel,
  ApplicationModelFamilyStatusEnum,
} from '@island.is/clients/municipalities-financial-aid'

@ObjectType()
export class Application {
  @Field(() => ID)
  readonly id!: string

  @Field()
  readonly created!: Date

  @Field()
  readonly modified!: Date

  @Field()
  readonly nationalId!: string

  @Field()
  readonly name!: string

  @Field({ nullable: true })
  readonly phoneNumber?: string

  @Field()
  readonly email!: string

  @Field(() => String)
  readonly homeCircumstances!: ApplicationModelHomeCircumstancesEnum

  @Field({ nullable: true })
  readonly homeCircumstancesCustom?: string

  @Field()
  readonly student!: boolean

  @Field({ nullable: true })
  readonly studentCustom?: string

  @Field(() => String)
  readonly employment!: ApplicationModelEmploymentEnum

  @Field({ nullable: true })
  readonly employmentCustom?: string

  @Field()
  readonly hasIncome!: boolean

  @Field()
  readonly usePersonalTaxCredit!: boolean

  @Field({ nullable: true })
  readonly bankNumber?: string

  @Field({ nullable: true })
  readonly ledger?: string

  @Field({ nullable: true })
  readonly accountNumber?: string

  @Field({ nullable: true })
  readonly interview?: boolean

  @Field({ nullable: true })
  readonly formComment?: string

  @Field({ nullable: true })
  readonly spouseFormComment?: string

  @Field(() => String)
  readonly state!: ApplicationModelStateEnum

  @Field(() => Array)
  readonly files?: ApplicationFileModel[]

  @Field({ nullable: true })
  readonly rejection?: string

  @Field(() => Array, { nullable: true })
  readonly applicationEvents?: ApplicationEventModel[]

  @Field({ nullable: true })
  readonly amount?: AmountModel | null

  @Field({ nullable: true })
  readonly spouseName?: string

  @Field({ nullable: true })
  readonly spouseNationalId?: string

  @Field({ nullable: true })
  readonly spouseEmail?: string

  @Field({ nullable: true })
  readonly spousePhoneNumber?: string

  @Field(() => String)
  readonly familyStatus!: ApplicationModelFamilyStatusEnum

  @Field({ nullable: true })
  readonly streetName?: string

  @Field({ nullable: true })
  readonly postalCode?: string

  @Field({ nullable: true })
  readonly city?: string

  @Field({ nullable: true })
  readonly municipalityCode?: string
}
