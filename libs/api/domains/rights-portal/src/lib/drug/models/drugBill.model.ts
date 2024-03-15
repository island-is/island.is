import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType('RightsPortalDrugBill')
export class DrugBill {
  @Field(() => ID, { nullable: true })
  id?: number | null

  @Field(() => Date, { nullable: true })
  date?: Date | null

  @Field(() => String, { nullable: true })
  description?: string | null

  @Field(() => Number, { nullable: true })
  totalCopaymentAmount?: number | null

  @Field(() => Number, { nullable: true })
  totalCustomerAmount?: number | null

  @Field(() => Number, { nullable: true })
  totalInsuranceAmount?: number | null

  @Field(() => Number, { nullable: true })
  totalExcessAmount?: number | null

  @Field(() => Number, { nullable: true })
  totalCalculatedForPaymentStepAmount?: number | null
}
