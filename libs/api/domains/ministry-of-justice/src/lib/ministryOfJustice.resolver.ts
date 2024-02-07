import type { User } from '@island.is/auth-nest-tools'
import { CurrentUser, IdsUserGuard, Scopes } from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'
import { Audit } from '@island.is/nest/audit'
import { UseGuards } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { MinistryOfJusticeService } from './ministryOfJustice.service'
import {
  AdvertsInput,
  QueryParams,
  TypeQueryParams,
} from './models/advert.input'
import {
  AdvertCategoryResponse,
  AdvertResponse,
  AdvertTypeResponse,
} from './models/advert.response'

@UseGuards(IdsUserGuard)
@Scopes(ApiScope.internal)
@Resolver()
export class MinistryOfJusticeResolver {
  constructor(private readonly mojService: MinistryOfJusticeService) {}

  @Query(() => AdvertResponse, {
    name: 'ministryOfJusticeAdverts',
  })
  @Audit()
  adverts(@CurrentUser() user: User, @Args('input') input: AdvertsInput) {
    return this.mojService.adverts(user, {
      search: input.search,
    })
  }

  @Query(() => AdvertTypeResponse, {
    name: 'ministryOfJusticeTypes',
  })
  @Audit()
  types(@CurrentUser() user: User, @Args('params') params: TypeQueryParams) {
    return this.mojService.types(user, params)
  }

  @Query(() => AdvertCategoryResponse, {
    name: 'ministryOfJusticeCategories',
  })
  @Audit()
  categories(@CurrentUser() user: User, @Args('params') params: QueryParams) {
    return this.mojService.categories(user, params)
  }
}
