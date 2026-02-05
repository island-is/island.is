import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType('ShipRegistryUserShip')
export class UserShip {
  @Field(() => ID)
  id!: string

  @Field()
  name!: string
}
