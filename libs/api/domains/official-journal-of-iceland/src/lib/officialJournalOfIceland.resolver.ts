import { Scopes } from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'

import { Args, Query, Resolver } from '@nestjs/graphql'
import { OfficialJournalOfIcelandService } from './officialJournalOfIceland.service'
import {
  AdvertSingleParams,
  AdvertsInput,
  QueryParams,
  TypeQueryParams,
} from './models/advert.input'
import {
  AdvertCategoryResponse,
  AdvertDepartmentResponse,
  AdvertDepartmentsResponse,
  AdvertInstitutionsResponse,
  AdvertMainCategoriesResponse,
  AdvertResponse,
  AdvertsResponse,
  AdvertTypeResponse,
  AdvertTypesResponse,
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
  advert(@Args('params') params: AdvertSingleParams) {
    return this.ojoiService.advert(params)
  }

  @Query(() => AdvertsResponse, {
    name: 'officialJournalOfIcelandAdverts',
  })
  adverts(@Args('input') input: AdvertsInput) {
    return this.ojoiService.adverts(input)
  }

  @Query(() => AdvertDepartmentResponse, {
    name: 'officialJournalOfIcelandDepartment',
  })
  department(@Args('params') params: AdvertSingleParams) {
    return this.ojoiService.department(params)
  }

  @Query(() => AdvertDepartmentsResponse, {
    name: 'officialJournalOfIcelandDepartments',
  })
  departments(@Args('params') params: QueryParams) {
    return this.ojoiService.departments(params)
  }

  @Query(() => AdvertTypeResponse, {
    name: 'officialJournalOfIcelandType',
  })
  type(@Args('params') params: AdvertSingleParams) {
    return this.ojoiService.type(params)
  }

  @Query(() => AdvertTypesResponse, {
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
