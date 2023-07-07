import { Field, ObjectType } from '@nestjs/graphql'
import { Aircraft } from '../models/aircraft.model'

@ObjectType('AircraftRegistryAllAircraftsResponse')
export class AllAircraftsResponse {
  @Field(() => [Aircraft], { nullable: true })
  aircrafts?: Aircraft[] | null

  @Field(() => Number, { nullable: true })
  pageNumber?: number | null

  @Field(() => Number, { nullable: true })
  pageSize?: number | null

  @Field(() => Number, { nullable: true })
  totalCount?: number | null
}
