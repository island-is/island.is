import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('ShipRegistryIdentification')
export class ShipRegistryIdentification {
  @Field()
  regionAcronym!: string

  @Field({ nullable: true })
  regionName?: string

  @Field({ nullable: true })
  homeHarbor?: string
}
