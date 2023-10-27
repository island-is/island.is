import { ObjectType } from '@nestjs/graphql'
import { PaginatedResponse } from '@island.is/nest/pagination'
import { UniversityGatewayProgram } from '../models/program.model'

@ObjectType('UniversityGatewayProgramsPaginated')
export class UniversityGatewayProgramsPaginated extends PaginatedResponse(
  UniversityGatewayProgram,
) {}
