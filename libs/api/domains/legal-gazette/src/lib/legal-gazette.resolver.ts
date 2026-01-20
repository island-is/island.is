import { CurrentUser, Scopes, IdsUserGuard } from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'
import type { User } from '@island.is/auth-nest-tools'

import { Query, Resolver, Args } from '@nestjs/graphql'
import {
  LegalGazetteCategoriesInput,
  LegalGazetteCategoriesResponse,
} from './models/categories'
import { LegalGazetteService } from './legal-gazette.service'
import { UseGuards } from '@nestjs/common'

@UseGuards(IdsUserGuard)
@Scopes(ApiScope.internal)
@Resolver()
export class LegalGazetteResolver {
  constructor(private readonly legalGazetteService: LegalGazetteService) {}

  @Query(() => LegalGazetteCategoriesResponse, {
    name: 'legalGazetteCategories',
  })
  getCategories(
    @Args('input') input: LegalGazetteCategoriesInput,
    @CurrentUser() user: User,
  ) {
    return this.legalGazetteService.getCategories(input, user)
  }
}
