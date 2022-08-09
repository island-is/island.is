import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class GetBrokwnDownRegistrationStatisticsInput {
  @Field(() => Date)
  dateFrom?: Date
  @Field(() => Date)
  dateTo?: Date
}
