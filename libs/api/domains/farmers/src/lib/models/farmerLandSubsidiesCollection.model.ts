import { Field, ObjectType } from '@nestjs/graphql'
import { PaginatedResponse } from '@island.is/nest/pagination'
import { FarmerLandSubsidy } from './farmerLandSubsidy.model'
import { FarmerLandSubsidyFilterOptions } from './farmerLandSubsidyFilterOptions.model'

@ObjectType('FarmerLandSubsidies')
export class FarmerLandSubsidiesCollection extends PaginatedResponse(
  FarmerLandSubsidy,
) {
  @Field(() => FarmerLandSubsidyFilterOptions, { nullable: true })
  filterOptions?: FarmerLandSubsidyFilterOptions
}
