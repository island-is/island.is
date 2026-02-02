import { Field, InputType } from '@nestjs/graphql'

@InputType('ShipRegistryUserShipInput')
export class UserShipInput {
  @Field()
  id!: string
}
