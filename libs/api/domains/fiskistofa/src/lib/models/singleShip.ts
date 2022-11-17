import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
class FiskistofaSingleShip {
  @Field({ nullable: true })
  shipNumber?: number

  @Field()
  name!: string

  @Field()
  ownerName!: string

  @Field()
  ownerSsn!: string

  @Field()
  operatorName!: string

  @Field()
  operatorSsn!: string

  @Field()
  operatingCategory!: string

  @Field({ nullable: true })
  grossTons?: number
}

@ObjectType()
export class FiskistofaSingleShipResponse {
  @Field(() => FiskistofaSingleShip, { nullable: true })
  fiskistofaSingleShip?: FiskistofaSingleShip | null
}
