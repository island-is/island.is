import { Field, ObjectType } from '@nestjs/graphql'
import { Aircraft } from '../models/aircraft.model'
import { CacheField } from '@island.is/nest/graphql'

@ObjectType('AircraftRegistryAllAircraftsResponse')
export class AllAircraftsResponse {
  @CacheField(() => [Aircraft], { nullable: true })
  aircrafts?: Aircraft[] | null

  @Field(() => Number, { nullable: true })
  pageNumber?: number | null

  @Field(() => Number, { nullable: true })
  pageSize?: number | null

  @Field(() => Number, { nullable: true })
  totalCount?: number | null
}
