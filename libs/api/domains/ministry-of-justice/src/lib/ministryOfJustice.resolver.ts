import type { User } from '@island.is/auth-nest-tools'
import { CurrentUser, IdsUserGuard, Scopes } from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'
import { Audit } from '@island.is/nest/audit'
import { UseGuards } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { MinistryOfJusticeService } from './ministryOfJustice.service'
import { SearchCaseTemplateInput } from './models/searchCaseTemplate.input'
import { PaginatedSearchCaseTemplateResponse } from './models/searchCaseTemplate.response'

@UseGuards(IdsUserGuard)
@Scopes(ApiScope.internal)
@Resolver()
export class MinistryOfJusticeResolver {
  constructor(
    private readonly ministryOfJusticeService: MinistryOfJusticeService,
  ) {}

  @Query(() => PaginatedSearchCaseTemplateResponse, {
    name: 'ministryOfJusticeSearchCaseTemplates',
  })
  @Audit()
  searchCaseTemplates(
    @CurrentUser() user: User,
    @Args('input') input: SearchCaseTemplateInput,
  ) {
    return this.ministryOfJusticeService.searchCaseTemplates(user, input)
  }
}
