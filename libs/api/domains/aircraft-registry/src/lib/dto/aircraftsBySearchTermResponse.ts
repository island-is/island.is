import { ObjectType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'
import { Aircraft } from '../models/aircraft.model'

@ObjectType('AircraftRegistryAircraftsBySearchTermResponse')
export class AircraftsBySearchTermResponse {
  @CacheField(() => [Aircraft], { nullable: true })
  aircrafts?: Aircraft[] | null
}
