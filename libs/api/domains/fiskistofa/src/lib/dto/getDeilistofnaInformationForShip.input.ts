import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class GetDeilistofnaInformationForShipInput {
  @Field()
  shipNumber!: number

  @Field()
  year!: string
}
