import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('ShipRegistryIdentification')
export class ShipRegistryIdentification {
  @Field()
  regionAcronym!: string

  @Field()
  regionName!: string

  @Field({ nullable: true })
  homeHarbor?: string
}
