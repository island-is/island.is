import { ObjectType } from '@nestjs/graphql'
import { PaginatedResponse } from '@island.is/nest/pagination'
import { Program } from '../models/program.model'

export
@ObjectType('ProgramsPaginated')
class ProgramsPaginated extends PaginatedResponse(Program) {}
