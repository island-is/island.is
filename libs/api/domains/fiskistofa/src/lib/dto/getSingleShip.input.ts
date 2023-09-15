import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class FiskistofaGetSingleShipInput {
  @Field()
  shipNumber!: number
}
