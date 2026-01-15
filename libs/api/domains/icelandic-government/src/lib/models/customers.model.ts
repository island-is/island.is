import { ObjectType } from '@nestjs/graphql'
import { PaginatedResponse } from '@island.is/nest/pagination'
import { Entity } from './entity.model'

@ObjectType('IcelandicGovernmentCustomers')
export class Customers extends PaginatedResponse(Entity) {}
