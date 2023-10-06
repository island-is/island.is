import { Field, ID, InputType } from '@nestjs/graphql'

@InputType('RightsPortalDrugBillInput')
export class DrugBillInput {
  @Field(() => ID, { nullable: true })
  paymentPeriodId!: number
}
