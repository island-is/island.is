import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql'

@ObjectType('ShipRegistrySeaworthiness')
export class ShipRegistrySeaworthiness {
  @Field()
  isValid!: boolean

  @Field(() => GraphQLISODateTime)
  validTo!: Date
}
