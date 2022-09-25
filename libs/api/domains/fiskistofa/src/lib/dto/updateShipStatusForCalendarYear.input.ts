import { Field, InputType } from '@nestjs/graphql'
import { FiskistofaCategoryChange } from './updateShipStatusForTimePeriod.input'

@InputType()
export class FiskistofaUpdateShipStatusForCalendarYearInput {
  @Field()
  shipNumber!: number

  @Field()
  year!: string

  @Field(() => [FiskistofaCategoryChange])
  changes!: FiskistofaCategoryChange[]
}
