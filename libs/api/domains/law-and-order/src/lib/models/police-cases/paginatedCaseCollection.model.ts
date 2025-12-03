import { ObjectType } from '@nestjs/graphql'
import { Case } from './case.model'
import { PaginatedResponse } from '@island.is/nest/pagination'

@ObjectType('LawAndOrderPolicePaginatedCaseCollection')
export class PaginatedCaseCollection extends PaginatedResponse(Case) {}
