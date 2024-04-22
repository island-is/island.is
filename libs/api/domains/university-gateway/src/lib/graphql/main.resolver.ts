import { Args, Query, Resolver } from '@nestjs/graphql'
import { CurrentUser } from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { CacheControl, CacheControlOptions } from '@island.is/nest/graphql'
import { UniversityGatewayApi } from '../universityGateway.service'
import {
  UniversityGatewayGetPogramInput,
  UniversityGatewayProgramsPaginated,
} from './dto'
import {
  UniversityGatewayProgramDetails,
  UniversityGatewayProgramFilter,
  UniversityGatewayApplication,
} from './models'
import { UNIVERSITY_GATEWAY_CACHE_CONTROL_MAX_AGE } from '../cacheControl'

const defaultCache: CacheControlOptions = {
  maxAge: UNIVERSITY_GATEWAY_CACHE_CONTROL_MAX_AGE,
}

@Resolver()
export class MainResolver {
  constructor(private readonly universityGatewayApi: UniversityGatewayApi) {}

  @CacheControl(defaultCache)
  @Query(() => UniversityGatewayProgramsPaginated)
  universityGatewayPrograms() {
    return this.universityGatewayApi.getActivePrograms()
  }

  @CacheControl(defaultCache)
  @Query(() => UniversityGatewayProgramDetails)
  universityGatewayProgram(
    @Args('input') input: UniversityGatewayGetPogramInput,
  ) {
    return this.universityGatewayApi.getProgramById(input)
  }

  @CacheControl(defaultCache)
  @Query(() => [UniversityGatewayProgramFilter])
  universityGatewayProgramFilters() {
    return this.universityGatewayApi.getProgramFilters()
  }

  @CacheControl(defaultCache)
  @Query(() => [UniversityGatewayApplication])
  universityGatewayApplicationById(
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user: User,
  ) {
    return this.universityGatewayApi.getUniversityApplicationById(user, id)
  }
}
