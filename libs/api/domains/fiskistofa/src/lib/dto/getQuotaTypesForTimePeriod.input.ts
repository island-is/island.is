import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class GetQuotaTypesForTimePeriodInput {
  @Field()
  timePeriod!: string
}
