import { ObjectType } from '@nestjs/graphql'
import { PaginatedResponse } from '@island.is/nest/pagination'
import { Customer } from './customer.model'

@ObjectType('IcelandicGovernmentInstitutionsCustomers')
export class Customers extends PaginatedResponse(Customer) {}
