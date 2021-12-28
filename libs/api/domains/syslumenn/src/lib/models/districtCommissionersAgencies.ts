import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class DistrictCommissionersAgenciesResponse {
  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  place?: string

  @Field({ nullable: true })
  address?: string

  @Field({ nullable: true })
  id?: string
}
