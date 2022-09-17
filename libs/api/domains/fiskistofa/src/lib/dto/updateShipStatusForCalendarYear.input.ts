import { Field, InputType } from '@nestjs/graphql'
import { CategoryChange } from './updateShipStatusForTimePeriod.input'

@InputType()
export class UpdateShipStatusForCalendarYearInput {
  @Field()
  shipNumber!: number

  @Field()
  year!: string

  @Field(() => [CategoryChange])
  changes!: CategoryChange[]
}
