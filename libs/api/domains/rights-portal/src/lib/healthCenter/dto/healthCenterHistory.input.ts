import { Field, InputType } from '@nestjs/graphql'

@InputType('RightsPortalHealthCenterHistoryInput')
export class HealthCenterHistoryInput {
  @Field(() => Date, { nullable: true })
  dateFrom?: Date

  @Field(() => Date, { nullable: true })
  dateTo?: Date
}
