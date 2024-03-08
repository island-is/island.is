import type { User } from '@island.is/auth-nest-tools'
import { CurrentUser, IdsUserGuard, Scopes } from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'
import { Audit } from '@island.is/nest/audit'
import { UseGuards } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { MinistryOfJusticeService } from './ministryOfJustice.service'
import {
  AdvertQueryParams,
  AdvertsInput,
  QueryParams,
  TypeQueryParams,
} from './models/advert.input'
import {
  AdvertCategoryResponse,
  AdvertDepartmentResponse,
  AdvertResponse,
  AdvertsResponse,
  AdvertTypeResponse,
} from './models/advert.response'
import { Features } from '@island.is/feature-flags'
import { FeatureFlag } from '@island.is/nest/feature-flags'

@UseGuards(IdsUserGuard)
@Scopes(ApiScope.internal)
@FeatureFlag(Features.officialJournalOfIceland)
@Resolver()
export class MinistryOfJusticeResolver {
  constructor(private readonly mojService: MinistryOfJusticeService) {}

  @Query(() => AdvertResponse, {
    name: 'ministryOfJusticeAdvert',
  })
  @Audit()
  advert(@CurrentUser() user: User, @Args('params') params: AdvertQueryParams) {
    return this.mojService.advert(user, params)
  }

  @Query(() => AdvertsResponse, {
    name: 'ministryOfJusticeAdverts',
  })
  @Audit()
  adverts(@CurrentUser() user: User, @Args('input') input: AdvertsInput) {
    return this.mojService.adverts(user, {
      search: input.search,
    })
  }

  @Query(() => AdvertDepartmentResponse, {
    name: 'ministryOfJusticeDepartments',
  })
  @Audit()
  departments(@CurrentUser() user: User, @Args('params') params: QueryParams) {
    return this.mojService.departments(user, params)
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
