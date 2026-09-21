import { CacheField } from '@island.is/nest/graphql'
import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class TaxiDriver {
  @Field(() => Int)
  id!: number

  @Field()
  name!: string

  @Field()
  persidno!: string

  @Field()
  address!: string

  @Field()
  organisationName!: string

  @Field()
  stationName!: string

  @Field(() => Date)
  validFrom!: Date

  @Field(() => Date)
  validTo!: Date

  @Field()
  emailAddress!: string

  @Field(() => Int)
  organisationId!: number

  @Field(() => Int)
  stationId!: number

  @Field(() => String, { nullable: true })
  callNumber?: string | null

  @Field(() => String, { nullable: true })
  representativePersidno?: string | null

  @Field(() => String, { nullable: true })
  representativeName?: string | null
}

@ObjectType()
export class TaxiDriversResponse {
  @CacheField(() => [TaxiDriver])
  drivers!: TaxiDriver[]
}
