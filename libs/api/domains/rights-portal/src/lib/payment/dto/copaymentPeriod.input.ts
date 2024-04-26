import { Field, InputType } from '@nestjs/graphql'

@InputType('RightsPortalCopaymentPeriodInput')
export class CopaymentPeriodInput {
  @Field(() => Date)
  dateFrom!: Date

  @Field(() => Date)
  dateTo!: Date
}
