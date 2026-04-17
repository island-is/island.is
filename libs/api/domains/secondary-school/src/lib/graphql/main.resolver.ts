import { Args, Query, Resolver } from '@nestjs/graphql'
import { ApiScope } from '@island.is/auth/scopes'
import { UseGuards } from '@nestjs/common'
import {
  BypassAuth,
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { SecondarySchoolApi } from '../secondarySchool.service'
import {
  SecondarySchoolProgram,
  SecondarySchoolProgrammeSimple,
  SecondarySchoolProgrammeFilterOptions,
  SecondarySchoolProgrammeDetail,
} from './models'
import { SECONDARY_SCHOOL_PUBLIC_CACHE_CONTROL_MAX_AGE } from '../cacheControl'
import { CacheControl, CacheControlOptions } from '@island.is/nest/graphql'

const defaultCache: CacheControlOptions = {
  maxAge: SECONDARY_SCHOOL_PUBLIC_CACHE_CONTROL_MAX_AGE,
}

@Resolver()
export class MainResolver {
  constructor(private readonly secondarySchoolApi: SecondarySchoolApi) {}

  @UseGuards(IdsUserGuard, ScopesGuard)
  @Scopes(ApiScope.menntamalastofnun)
  @Query(() => [SecondarySchoolProgram])
  secondarySchoolProgramsBySchoolId(
    @Args('schoolId', { type: () => String }) schoolId: string,
    @Args('isFreshman', { type: () => Boolean }) isFreshman: boolean,
    @CurrentUser() user: User,
  ) {
    return this.secondarySchoolApi.getProgramsBySchoolId(
      user,
      schoolId,
      isFreshman,
    )
  }

  @CacheControl(defaultCache)
  @BypassAuth()
  @Query(() => [SecondarySchoolProgrammeSimple])
  secondarySchoolAllProgrammes() {
    return this.secondarySchoolApi.getAllProgrammes()
  }

  @CacheControl(defaultCache)
  @BypassAuth()
  @Query(() => SecondarySchoolProgrammeFilterOptions)
  secondarySchoolProgrammeFilterOptions() {
    return this.secondarySchoolApi.getProgrammeFilterOptions()
  }

  @CacheControl(defaultCache)
  @BypassAuth()
  @Query(() => SecondarySchoolProgrammeDetail)
  secondarySchoolProgrammeById(@Args('id', { type: () => String }) id: string) {
    return this.secondarySchoolApi.getProgrammeById(id)
  }
}
