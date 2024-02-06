import type { User } from '@island.is/auth-nest-tools'
import { CurrentUser, IdsUserGuard, Scopes } from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'
import { Audit } from '@island.is/nest/audit'
import { UseGuards } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { MinistryOfJusticeService } from './ministryOfJustice.service'
import { AdvertsResponse } from './models/responses'
import { AdvertsInput, TypesInput } from './models/adverts.input'
import { AdvertsTypeResponse } from './models/adverts.response'

@UseGuards(IdsUserGuard)
@Scopes(ApiScope.internal)
@Resolver()
export class MinistryOfJusticeResolver {
  constructor(private readonly mojService: MinistryOfJusticeService) {}

  @Query(() => AdvertsResponse, {
    name: 'ministryOfJusticeAdverts',
  })
  @Audit()
  adverts(@CurrentUser() user: User, @Args('input') input: AdvertsInput) {
    return this.mojService.adverts(user, {
      search: input.search,
    })
  }

  @Query(() => AdvertsTypeResponse, {
    name: 'ministryOfJusticeTypes',
  })
  @Audit()
  types(@CurrentUser() user: User, @Args('params') params: TypesInput) {
    return this.mojService.types(user, params)
  }
}
