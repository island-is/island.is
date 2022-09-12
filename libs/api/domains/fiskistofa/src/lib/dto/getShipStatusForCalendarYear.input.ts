import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class GetShipStatusForCalendarYear {
  @Field()
  shipNumber!: number

  @Field()
  year!: string
}
