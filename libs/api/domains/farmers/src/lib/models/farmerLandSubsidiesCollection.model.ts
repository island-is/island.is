import { ObjectType } from '@nestjs/graphql'
import { PaginatedResponse } from '@island.is/nest/pagination'
import { FarmerLandSubsidy } from './farmerLandSubsidy.model'

@ObjectType('FarmerLandSubsidies')
export class FarmerLandSubsidiesCollection extends PaginatedResponse(
  FarmerLandSubsidy,
) {}
