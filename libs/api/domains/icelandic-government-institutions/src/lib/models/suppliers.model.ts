import { ObjectType } from '@nestjs/graphql'
import { PaginatedResponse } from '@island.is/nest/pagination'
import { Supplier } from './supplier.model'

@ObjectType('IcelandicGovernmentInstitutionsSuppliers')
export class Suppliers extends PaginatedResponse(Supplier) {}
