import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType('RightsPortalDrugsBills')
export class DrugsBills {
  @Field(() => ID, { nullable: true })
  id?: number | null

  @Field(() => Date, { nullable: true })
  date?: Date | null

  @Field(() => String, { nullable: true })
  description?: string | null

  @Field(() => Number, { nullable: true })
  copaymentAmount?: number | null

  @Field(() => Number, { nullable: true })
  customerAmount?: number | null

  @Field(() => Number, { nullable: true })
  insuranceAmount?: number | null

  @Field(() => Number, { nullable: true })
  calculatedForPaymentStepAmount?: number | null
}
