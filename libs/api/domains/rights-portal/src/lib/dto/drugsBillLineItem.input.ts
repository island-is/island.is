import { Field, ID, InputType } from '@nestjs/graphql'

@InputType('RightsPortalDrugsBillLineItemInput')
export class DrugBillLineItemInput {
  @Field(() => ID, { nullable: true })
  billId!: number
  @Field(() => ID, { nullable: true })
  paymentPeriodId!: number
}
