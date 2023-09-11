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
import { UniversityGatewayApi } from '../universityGateway.service'
import { GetProgramByIdInput, GetProgramsInput, ProgramsPaginated } from './dto'
import { ProgramDetails } from './models'

export
@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
@Scopes(ApiScope.internal) //TODOx hvaða scope
class MainResolver {
  constructor(private readonly universityGatewayApi: UniversityGatewayApi) {}

  @Query(() => ProgramsPaginated)
  universityGatewayPrograms(
    @CurrentUser() user: User,
    @Args('input') input: GetProgramsInput,
  ) {
    return this.universityGatewayApi.getPrograms(user, input)
  }

  @Query(() => ProgramDetails)
  universityGatewayProgramById(
    @CurrentUser() user: User,
    @Args('input') input: GetProgramByIdInput,
  ) {
    return this.universityGatewayApi.getProgramById(user, input)
  }
}
