import { CacheField } from '@island.is/nest/graphql'
import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class TaxiStation {
  @Field(() => Int)
  id!: number

  @Field()
  name!: string

  @Field(() => Int)
  driverCount!: number
}

@ObjectType()
export class TaxiStationsResponse {
  @CacheField(() => [TaxiStation])
  stations!: TaxiStation[]
}
