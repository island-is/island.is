import { Field, ID, InputType } from '@nestjs/graphql'

@InputType('RightsPortalDrugsBillLineInput')
export class DrugBillLineInput {
  @Field(() => ID)
  billId!: number
  @Field(() => ID)
  paymentPeriodId!: number
}
