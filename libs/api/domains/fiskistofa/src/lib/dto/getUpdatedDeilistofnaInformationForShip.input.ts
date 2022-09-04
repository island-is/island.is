import { Field, InputType } from '@nestjs/graphql'
import { CategoryChanges } from './getUpdatedAflamarkInformationForShip.input'

@InputType()
export class GetUpdatedDeilistofnaInformationForShipInput {
  @Field()
  shipNumber!: number

  @Field()
  year!: string

  @Field()
  changes!: CategoryChanges
}
