import { Args, Query, Resolver } from '@nestjs/graphql'
import { ApiScope } from '@island.is/auth/scopes'
import { UseGuards } from '@nestjs/common'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { SecondarySchoolApi } from '../secondarySchool.service'
import { SecondarySchoolProgram } from './models'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class MainResolver {
  constructor(private readonly secondarySchoolApi: SecondarySchoolApi) {}

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
}
