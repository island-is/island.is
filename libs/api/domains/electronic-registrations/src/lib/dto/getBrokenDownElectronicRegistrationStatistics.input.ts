import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class GetBrokenDownElectronicRegistrationStatisticsInput {
  @Field(() => Date)
  dateFrom?: Date
  @Field(() => Date)
  dateTo?: Date
}
