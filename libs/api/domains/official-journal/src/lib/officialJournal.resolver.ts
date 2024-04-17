import { Scopes } from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'

import { Args, Query, Resolver } from '@nestjs/graphql'
import { OfficialJournalService } from './officialJournal.service'
import {
  AdvertQueryParams,
  AdvertsInput,
  QueryParams,
  TypeQueryParams,
} from './models/advert.input'
import {
  AdvertCategoryResponse,
  AdvertDepartmentResponse,
  AdvertInstitutionsResponse,
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
export class OfficialJournalResolver {
  constructor(private readonly ojService: OfficialJournalService) {}

  @Query(() => AdvertResponse, {
    name: 'officialJournalAdvert',
  })
  advert(@Args('params') params: AdvertQueryParams) {
    return this.ojService.advert(params)
  }

  @Query(() => AdvertsResponse, {
    name: 'officialJournalAdverts',
  })
  adverts(@Args('input') input: AdvertsInput) {
    return this.ojService.adverts({
      search: input.search,
    })
  }

  @Query(() => AdvertDepartmentResponse, {
    name: 'officialJournalDepartments',
  })
  departments(@Args('params') params: QueryParams) {
    return this.ojService.departments(params)
  }

  @Query(() => AdvertTypeResponse, {
    name: 'officialJournalTypes',
  })
  types(@Args('params') params: TypeQueryParams) {
    return this.ojService.types(params)
  }

  @Query(() => AdvertMainCategoriesResponse, {
    name: 'officialJournalMainCategories',
  })
  mainCategories(@Args('params') params: QueryParams) {
    return this.ojService.mainCategories(params)
  }

  @Query(() => AdvertCategoryResponse, {
    name: 'officialJournalCategories',
  })
  categories(@Args('params') params: QueryParams) {
    return this.ojService.categories(params)
  }

  @Query(() => AdvertInstitutionsResponse, {
    name: 'officialJournalInstitutions',
  })
  institutions(@Args('params') params: QueryParams) {
    return this.ojService.institutions(params)
  }
}
