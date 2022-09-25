import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class FiskistofaGetQuotaTypesForTimePeriodInput {
  @Field()
  timePeriod!: string
}
