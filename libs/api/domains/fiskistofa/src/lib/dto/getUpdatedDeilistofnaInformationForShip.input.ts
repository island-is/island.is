import { Field, InputType } from '@nestjs/graphql'
import { CategoryChange } from './getUpdatedAflamarkInformationForShip.input'

@InputType()
export class GetUpdatedDeilistofnaInformationForShipInput {
  @Field()
  shipNumber!: number

  @Field()
  year!: string

  @Field(() => [CategoryChange])
  changes!: CategoryChange[]
}
