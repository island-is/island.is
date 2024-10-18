import { Field, ID, ObjectType } from '@nestjs/graphql'

import {
  ApplicationState,
  FamilyStatus,
} from '@island.is/financial-aid/shared/lib'

import {
  AmountModel,
  ApplicationFileModel,
  ChildrenModel,
  DirectTaxPaymentModel,
  StaffModel,
} from './index'

@ObjectType()
export class ApplicationModel {
  @Field(() => ID)
  readonly id!: string

  @Field()
  readonly created!: string

  @Field()
  readonly modified!: string

  @Field()
  readonly nationalId!: string

  @Field()
  readonly name!: string

  @Field({ nullable: true })
  readonly phoneNumber?: string

  @Field()
  readonly email!: string

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
  readonly formComment?: string

  @Field({ nullable: true })
  readonly spouseFormComment?: string

  @Field(() => String)
  readonly state!: ApplicationState

  @Field(() => [ApplicationFileModel], { nullable: true })
  readonly files?: ApplicationFileModel[]

  @Field({ nullable: true })
  readonly rejection?: string

  @Field({ nullable: true })
  readonly staff?: StaffModel

  @Field({ nullable: true })
  readonly amount?: AmountModel

  @Field({ nullable: true })
  readonly spouseName?: string

  @Field({ nullable: true })
  readonly spouseNationalId?: string

  @Field({ nullable: true })
  readonly spouseEmail?: string

  @Field({ nullable: true })
  readonly spousePhoneNumber?: string

  @Field(() => String)
  readonly familyStatus!: FamilyStatus

  @Field({ nullable: true })
  readonly streetName?: string

  @Field({ nullable: true })
  readonly postalCode?: string

  @Field({ nullable: true })
  readonly city?: string

  @Field()
  readonly municipalityCode!: string

  @Field(() => [DirectTaxPaymentModel])
  readonly directTaxPayments!: DirectTaxPaymentModel[]

  @Field({ nullable: true })
  readonly hasFetchedDirectTaxPayment?: boolean

  @Field({ nullable: true })
  readonly spouseHasFetchedDirectTaxPayment?: boolean

  @Field({ nullable: true })
  readonly navSuccess?: boolean

  @Field({ nullable: true })
  readonly childrenComment?: string

  @Field(() => [ChildrenModel])
  readonly children?: ChildrenModel[]
}
