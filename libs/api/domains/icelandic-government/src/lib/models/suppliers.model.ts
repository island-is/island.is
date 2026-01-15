import { ObjectType } from '@nestjs/graphql'
import { PaginatedResponse } from '@island.is/nest/pagination'
import { Entity } from './entity.model'

@ObjectType('IcelandicGovernmentSuppliers')
export class Suppliers extends PaginatedResponse(Entity) {}
