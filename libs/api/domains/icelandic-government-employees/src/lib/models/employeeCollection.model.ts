import { ObjectType } from '@nestjs/graphql'
import { PaginatedResponse } from '@island.is/nest/pagination'
import { Employee } from './employee.model'

@ObjectType('IcelandicGovernmentEmployees')
export class EmployeeCollection extends PaginatedResponse(Employee) {}
