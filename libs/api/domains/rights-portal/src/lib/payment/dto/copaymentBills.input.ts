import { Field, InputType } from '@nestjs/graphql'

@InputType('RightsPortalCopaymentBillsInput')
export class CopaymentBillsInput {
  @Field(() => Number)
  periodId!: number
}
