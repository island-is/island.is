import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('ShipRegistryFishery')
export class ShipRegistryFishery {
  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  address?: string

  @Field({ nullable: true })
  postalCode?: string
}
