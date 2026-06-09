import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType('ShipRegistryRank')
export class ShipRegistryRank {
  @Field(() => ID)
  id!: string

  @Field()
  name!: string

  @Field({ nullable: true })
  nameEn?: string
}
