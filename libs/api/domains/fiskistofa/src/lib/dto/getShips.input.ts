import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class GetShipsInput {
  @Field()
  shipName!: string
}
