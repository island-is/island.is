import { Field, ID, InputType } from '@nestjs/graphql'

@InputType('RightsPortalDrugsBillsInput')
export class DrugsBillsInput {
  @Field(() => ID, { nullable: true })
  paymentPeriodId!: number
}
