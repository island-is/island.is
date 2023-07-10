import { Field, InputType } from '@nestjs/graphql'

@InputType('HealthCenterHistoryInput')
export class GetHealthCenterHistoryInput {
  @Field(() => Date, { nullable: true })
  dateFrom?: Date

  @Field(() => Date, { nullable: true })
  dateTo?: Date
}
