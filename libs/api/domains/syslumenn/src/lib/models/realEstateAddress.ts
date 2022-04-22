import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class RealEstateAddress {
  @Field()
  address!: string
}
