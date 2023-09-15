import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class FiskistofaGetShipStatusForTimePeriodInput {
  @Field()
  shipNumber!: number

  @Field()
  timePeriod!: string
}
