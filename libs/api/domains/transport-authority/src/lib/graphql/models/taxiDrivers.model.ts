import { CacheField } from '@island.is/nest/graphql'
import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class TaxiDriver {
  @Field(() => Int)
  id!: number

  @Field()
  name!: string

  @Field()
  stationName!: string

  @Field(() => Int)
  stationId!: number

  @Field(() => String, { nullable: true })
  representativeName?: string | null
}

@ObjectType()
export class TaxiDriversResponse {
  @CacheField(() => [TaxiDriver])
  drivers!: TaxiDriver[]
}
