import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class GetShipStatusForTimePeriodInput {
  @Field()
  shipNumber!: number

  @Field()
  timePeriod!: string
}
