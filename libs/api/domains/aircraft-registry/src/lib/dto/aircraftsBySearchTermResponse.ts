import { Field, ObjectType } from '@nestjs/graphql'
import { Aircraft } from '../models/aircraft.model'

@ObjectType('AircraftRegistryAircraftsBySearchTermResponse')
export class AircraftsBySearchTermResponse {
  @Field(() => [Aircraft], { nullable: true })
  aircrafts?: Aircraft[] | null
}
