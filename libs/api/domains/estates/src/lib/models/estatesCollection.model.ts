import { ObjectType } from '@nestjs/graphql'
import { PaginatedResponse } from '@island.is/nest/pagination'
import { EstatesEstate } from './estate.model'

@ObjectType('EstatesEstates')
export class EstatesEstatesCollection extends PaginatedResponse(EstatesEstate) {}
