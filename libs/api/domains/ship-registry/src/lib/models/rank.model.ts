import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ShipRegistryRank {
  @Field(() => ID)
  id!: string

  @Field()
  name!: string
}
