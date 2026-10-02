import { ObjectType } from '@nestjs/graphql'
import { PaginatedResponse } from '@island.is/nest/pagination'
import { Estate } from './estate.model'

@ObjectType('Estates')
export class EstatesCollection extends PaginatedResponse(Estate) {}
