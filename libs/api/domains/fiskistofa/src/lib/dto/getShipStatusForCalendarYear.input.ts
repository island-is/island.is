import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class FiskistofaGetShipStatusForCalendarYearInput {
  @Field()
  shipNumber!: number

  @Field()
  year!: string
}
