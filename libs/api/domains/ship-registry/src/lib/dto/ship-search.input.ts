import { Field, InputType } from '@nestjs/graphql'

@InputType('ShipRegistryShipSearchInput')
export class ShipSearchInput {
  @Field(() => String)
  qs!: string
}
