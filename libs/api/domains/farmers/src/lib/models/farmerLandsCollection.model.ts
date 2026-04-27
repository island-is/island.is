import { ObjectType } from '@nestjs/graphql'
import { PaginatedResponse } from '@island.is/nest/pagination'
import { FarmerLand } from './farmerLand.model'

@ObjectType('FarmerLands')
export class LandsCollection extends PaginatedResponse(FarmerLand) {}
