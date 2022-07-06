import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class DistrictCommissionerAgencies {
  @Field()
  name!: string

  @Field()
  place!: string

  @Field()
  address!: string

  @Field()
  id!: string
}
