import { Field, InputType } from '@nestjs/graphql'

@InputType('AircraftRegistryAircraftsBySearchTermInput')
export class AircraftsBySearchTermInput {
  @Field(() => String)
  searchTerm!: string
}
