import { Field, Float, Int, ObjectType } from '@nestjs/graphql'
import { Dispensation } from './dispensations.model'
import {
  PrescribedItemCategoryEnum,
  PrescribedItemRenewalBlockedReasonEnum,
  PrescribedItemRenewalStatusEnum,
} from './enums'

@ObjectType('HealthDirectoratePrescription')
export class Prescription {
  @Field(() => Int)
  prescribedItemId!: number

  @Field(() => Int)
  prescriptionId!: number

  @Field()
  prescriberId!: string

  @Field({ nullable: true })
  prescriberName?: string

  @Field(() => Date)
  issueDate!: Date

  @Field(() => Date)
  expiryDate!: Date

  @Field()
  productId!: string

  @Field({ nullable: true })
  productName?: string

  @Field({ nullable: true })
  productType?: string

  @Field({ nullable: true })
  productForm?: string

  @Field({ nullable: true })
  productUrl?: string

  @Field({ nullable: true })
  productStrength?: string

  @Field(() => Float, { nullable: true })
  productQuantity?: number

  @Field(() => PrescribedItemCategoryEnum, { nullable: true })
  category?: PrescribedItemCategoryEnum

  @Field({ nullable: true })
  dosageInstructions?: string

  @Field({ nullable: true })
  indication?: string

  @Field(() => Float, { nullable: true })
  totalPrescribedAmount?: number

  @Field({ nullable: true })
  totalPrescribedAmountDisplay?: string

  @Field(() => Boolean, { nullable: true })
  isRegiment?: boolean

  @Field(() => Boolean)
  isRenewable!: boolean

  @Field(() => PrescribedItemRenewalBlockedReasonEnum, { nullable: true })
  renewalBlockedReason?: PrescribedItemRenewalBlockedReasonEnum

  @Field(() => PrescribedItemRenewalStatusEnum, { nullable: true })
  renewalStatus?: PrescribedItemRenewalStatusEnum

  @Field(() => Float, { nullable: true })
  amountRemaining?: number

  @Field({ nullable: true })
  amountRemainingUnit?: string

  @Field({ nullable: true })
  amountRemainingDisplay?: string

  @Field(() => Float, { nullable: true })
  percentageRemaining?: number

  @Field(() => Boolean)
  isFullyDispensed!: boolean

  @Field(() => [Dispensation])
  dispensations!: Dispensation[]
}

@ObjectType('HealthDirectoratePrescriptions')
export class Prescriptions {
  @Field(() => [Prescription])
  prescriptions!: Prescription[]
}
