import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class FiskistofaGetShipsInput {
  @Field()
  shipName!: string
}
