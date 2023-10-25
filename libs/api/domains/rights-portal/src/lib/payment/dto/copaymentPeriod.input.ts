import { InputType, Field } from '@nestjs/graphql'

@InputType('RightsPortalPeriodInput')
export class PeriodInput {
  @Field(() => String)
  dateTo!: string

  @Field(() => String)
  dateFrom!: string
}
