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
  getAdvertById(@Args('params') params: AdvertSingleParams) {
    return this.ojoiService.getAdvertById(params)
  }

  @Query(() => AdvertsResponse, {
    name: 'officialJournalOfIcelandAdverts',
  })
  getAdverts(@Args('input') input: AdvertsInput) {
    return this.ojoiService.getAdverts(input)
  }

  @Query(() => AdvertDepartmentResponse, {
    name: 'officialJournalOfIcelandDepartment',
  })
  getDepartmentById(@Args('params') params: AdvertSingleParams) {
    return this.ojoiService.getDepartmentById(params)
  }

  @Query(() => AdvertDepartmentsResponse, {
    name: 'officialJournalOfIcelandDepartments',
  })
  getDepartments(@Args('params') params: QueryParams) {
    return this.ojoiService.getDepartments(params)
  }

  @Query(() => AdvertTypeResponse, {
    name: 'officialJournalOfIcelandType',
  })
  getAdvertTypeById(@Args('params') params: AdvertSingleParams) {
    return this.ojoiService.getAdvertTypeById(params)
  }

  @Query(() => AdvertTypesResponse, {
    name: 'officialJournalOfIcelandTypes',
  })
  getAdvertTypes(@Args('params') params: TypeQueryParams) {
    return this.ojoiService.getAdvertTypes(params)
  }

  @Query(() => AdvertMainCategoriesResponse, {
    name: 'officialJournalOfIcelandMainCategories',
  })
  getMainCategories(@Args('params') params: QueryParams) {
    return this.ojoiService.getMainCategories(params)
  }

  @Query(() => AdvertCategoryResponse, {
    name: 'officialJournalOfIcelandCategories',
  })
  getCategories(@Args('params') params: QueryParams) {
    return this.ojoiService.getCategories(params)
  }

  @Query(() => AdvertInstitutionsResponse, {
    name: 'officialJournalOfIcelandInstitutions',
  })
  getInstitutions(@Args('params') params: QueryParams) {
    return this.ojoiService.getInstitutions(params)
  }
}
