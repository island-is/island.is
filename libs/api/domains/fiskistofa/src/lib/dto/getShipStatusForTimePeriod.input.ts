import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class GetShipStatusForTimePeriod {
  @Field()
  shipNumber!: number

  @Field()
  timePeriod!: string
}
