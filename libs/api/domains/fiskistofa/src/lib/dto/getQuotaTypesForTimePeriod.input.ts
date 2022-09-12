import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class GetQuotaTypesForTimePeriod {
  @Field()
  shipNumber!: number

  @Field()
  timePeriod!: string
}
