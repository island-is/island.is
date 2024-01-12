import { ObjectType } from '@nestjs/graphql'
import { Case } from './case.model'
import { PaginatedResponse } from '@island.is/nest/pagination'

@ObjectType('MinistryOfJusticePaginatedSearchCaseTemplateResponse')
export class PaginatedSearchCaseTemplateResponse extends PaginatedResponse(
  Case,
) {}
