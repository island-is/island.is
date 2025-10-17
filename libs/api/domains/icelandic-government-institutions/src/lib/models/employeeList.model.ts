import { ObjectType } from '@nestjs/graphql'
import { Employee } from './employee.model'
import { PaginatedResponse } from '@island.is/nest/pagination'

@ObjectType('IcelandicGovernmentInstitutionsEmployees')
export class EmployeeList extends PaginatedResponse(Employee) {}
