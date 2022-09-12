import { Field, InputType } from '@nestjs/graphql'
import { CategoryChange } from './getUpdatedShipStatusForTimePeriod.input'

@InputType()
export class GetUpdatedShipStatusForCalendarYearInput {
  @Field()
  shipNumber!: number

  @Field()
  year!: string

  @Field(() => [CategoryChange])
  changes!: CategoryChange[]
}
