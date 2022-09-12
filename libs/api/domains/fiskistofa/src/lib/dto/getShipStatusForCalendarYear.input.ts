import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class GetShipStatusForCalendarYearInput {
  @Field()
  shipNumber!: number

  @Field()
  year!: string
}
