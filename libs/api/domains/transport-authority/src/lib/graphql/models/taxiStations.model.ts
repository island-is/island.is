import { CacheField } from '@island.is/nest/graphql'
import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class TaxiStation {
  @Field(() => Int)
  id!: number

  @Field()
  name!: string

  @Field()
  persidno!: string

  @Field()
  emailAddress!: string

  @Field()
  licenceNumber!: string

  @Field(() => Date)
  validFrom!: Date

  @Field(() => Date)
  validTo!: Date

  @Field(() => Int)
  driverCount!: number
}

@ObjectType()
export class TaxiStationsResponse {
  @CacheField(() => [TaxiStation])
  stations!: TaxiStation[]
}
