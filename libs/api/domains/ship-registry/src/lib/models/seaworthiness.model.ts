import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('ShipRegistrySeaworthiness')
export class ShipRegistrySeaworthiness {
  @Field()
  isValid!: boolean

  @Field()
  validTo!: string
}
