import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class GetSingleShipInput {
  @Field()
  shipNumber!: number
}
