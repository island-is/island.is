import { Field, InputType } from '@nestjs/graphql'

@InputType('AircraftRegistryAllAircraftsInput')
export class AllAircraftsInput {
  @Field(() => Number)
  pageNumber!: number

  @Field(() => Number)
  pageSize!: number

  @Field(() => String, { nullable: true })
  searchTerm?: string
}
