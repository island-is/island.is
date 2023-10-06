import { Field, ID, InputType } from '@nestjs/graphql'

@InputType('RightsPortalDrugsBillLineInput')
export class DrugBillLineInput {
  @Field(() => ID, { nullable: true })
  billId!: number
  @Field(() => ID, { nullable: true })
  paymentPeriodId!: number
}
