import { Field, InputType } from '@nestjs/graphql'

@InputType('RightsPortalCopaymentPeriodInput')
export class CopaymentPeriodInput {
  @Field(() => String)
  dateFrom!: string

  @Field(() => String)
  dateTo!: string
}
