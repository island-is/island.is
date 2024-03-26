import { Scopes } from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'

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
  AdvertInvolvedPartiesResponse,
  AdvertMainCategoriesResponse,
  AdvertResponse,
  AdvertsResponse,
  AdvertTypeResponse,
} from './models/advert.response'
import { Features } from '@island.is/feature-flags'
import { FeatureFlag } from '@island.is/nest/feature-flags'

@Scopes(ApiScope.internal)
@FeatureFlag(Features.officialJournalOfIceland)
@Resolver()
export class MinistryOfJusticeResolver {
  constructor(private readonly mojService: MinistryOfJusticeService) {}

  @Query(() => AdvertResponse, {
    name: 'ministryOfJusticeAdvert',
  })
  advert(@Args('params') params: AdvertQueryParams) {
    return this.mojService.advert(params)
  }

  @Query(() => AdvertsResponse, {
    name: 'ministryOfJusticeAdverts',
  })
  adverts(@Args('input') input: AdvertsInput) {
    return this.mojService.adverts({
      search: input.search,
    })
  }

  @Query(() => AdvertDepartmentResponse, {
    name: 'ministryOfJusticeDepartments',
  })
  departments(@Args('params') params: QueryParams) {
    return this.mojService.departments(params)
  }

  @Query(() => AdvertTypeResponse, {
    name: 'ministryOfJusticeTypes',
  })
  types(@Args('params') params: TypeQueryParams) {
    return this.mojService.types(params)
  }

  @Query(() => AdvertMainCategoriesResponse, {
    name: 'ministryOfJusticeMainCategories',
  })
  mainCategories(@Args('params') params: QueryParams) {
    return this.mojService.mainCategories(params)
  }

  @Query(() => AdvertCategoryResponse, {
    name: 'ministryOfJusticeCategories',
  })
  categories(@Args('params') params: QueryParams) {
    return this.mojService.categories(params)
  }

  @Query(() => AdvertInvolvedPartiesResponse, {
    name: 'ministryOfJusticeInvolvedParties',
  })
  involvedParties(@Args('params') params: QueryParams) {
    return this.mojService.involvedParties(params)
  }
}
