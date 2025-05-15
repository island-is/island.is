import { Field, ObjectType } from '@nestjs/graphql'
import { Dispensation } from './dispensations.model'
import {
  PrescribedItemCategoryEnum,
  PrescribedItemRenewalBlockedReasonEnum,
  PrescribedItemRenewalStatusEnum,
} from './enums'

@ObjectType('HealthDirectoratePrescription')
export class Prescription {
  @Field()
  id!: string

  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  type?: string

  @Field({ nullable: true })
  form?: string

  @Field({ nullable: true })
  url?: string

  @Field({ nullable: true })
  quantity?: string

  @Field(() => PrescribedItemCategoryEnum, { nullable: true })
  category?: PrescribedItemCategoryEnum

  @Field({ nullable: true })
  prescriberName?: string

  @Field(() => Date)
  issueDate!: Date

  @Field(() => Date)
  expiryDate!: Date

  @Field({ nullable: true })
  dosageInstructions?: string

  @Field({ nullable: true })
  indication?: string

  @Field({ nullable: true })
  totalPrescribedAmount?: string

  @Field(() => Boolean)
  isRenewable!: boolean

  @Field(() => PrescribedItemRenewalBlockedReasonEnum, { nullable: true })
  renewalBlockedReason?: PrescribedItemRenewalBlockedReasonEnum

  @Field(() => PrescribedItemRenewalStatusEnum, { nullable: true })
  renewalStatus?: PrescribedItemRenewalStatusEnum

  @Field({ nullable: true })
  amountRemaining?: string

  @Field(() => [Dispensation])
  dispensations!: Dispensation[]
}

@ObjectType('HealthDirectoratePrescriptions')
export class Prescriptions {
  @Field(() => [Prescription])
  prescriptions!: Prescription[]
}
