import { Field, InputType, Int } from '@nestjs/graphql'

@InputType('RightsPortalCopaymentBillsInput')
export class CopaymentBillsInput {
  @Field(() => Int)
  periodId!: number
}
