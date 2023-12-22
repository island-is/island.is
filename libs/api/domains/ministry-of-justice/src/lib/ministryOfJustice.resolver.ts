import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsAuthGuard,
  IdsUserGuard,
  Scopes,
} from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'
import { Audit } from '@island.is/nest/audit'
import { UseGuards } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { MinistryOfJusticeService } from './ministryOfJustice.service'
import { SearchCaseTemplateInput } from './models/SearchCaseTemplate.input'
import { SearchCaseTemplateResponse } from './models/SearchCaseTemplate.response'

@UseGuards(IdsUserGuard, IdsAuthGuard)
@Scopes(ApiScope.internal)
@Resolver()
export class MinistryOfJusticeResolver {
  constructor(
    private readonly ministryOfJusticeService: MinistryOfJusticeService,
  ) {}

  @Query(() => SearchCaseTemplateResponse, {
    name: 'ministryOfJusticeSearchCaseTemplates',
  })
  @Audit()
  async searchCaseTemplates(
    @CurrentUser() user: User,
    @Args('input') input: SearchCaseTemplateInput,
  ) {
    return await this.ministryOfJusticeService.searchCaseTemplates(user, input)
  }
}
