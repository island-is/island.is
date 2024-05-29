import { Scopes } from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'

import { Args, Query, Resolver } from '@nestjs/graphql'
import { OfficialJournalOfIcelandService } from './officialJournalOfIceland.service'
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
export class OfficialJournalOfIcelandResolver {
  constructor(private readonly ojoiService: OfficialJournalOfIcelandService) {}

  @Query(() => AdvertResponse, {
    name: 'officialJournalOfIcelandAdvert',
  })
  advert(@Args('params') params: AdvertQueryParams) {
    return this.ojoiService.advert(params)
  }

  @Query(() => AdvertsResponse, {
    name: 'officialJournalOfIcelandAdverts',
  })
  adverts(@Args('input') input: AdvertsInput) {
    return this.ojoiService.adverts({
      search: input.search,
    })
  }

  @Query(() => AdvertDepartmentResponse, {
    name: 'officialJournalOfIcelandDepartments',
  })
  departments(@Args('params') params: QueryParams) {
    return this.ojoiService.departments(params)
  }

  @Query(() => AdvertTypeResponse, {
    name: 'officialJournalOfIcelandTypes',
  })
  types(@Args('params') params: TypeQueryParams) {
    return this.ojoiService.types(params)
  }

  @Query(() => AdvertMainCategoriesResponse, {
    name: 'officialJournalOfIcelandMainCategories',
  })
  mainCategories(@Args('params') params: QueryParams) {
    return this.ojoiService.mainCategories(params)
  }

  @Query(() => AdvertCategoryResponse, {
    name: 'officialJournalOfIcelandCategories',
  })
  categories(@Args('params') params: QueryParams) {
    return this.ojoiService.categories(params)
  }

  @Query(() => AdvertInstitutionsResponse, {
    name: 'officialJournalOfIcelandInstitutions',
  })
  institutions(@Args('params') params: QueryParams) {
    return this.ojoiService.institutions(params)
  }
}
