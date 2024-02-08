import { Args, Query, Resolver } from '@nestjs/graphql'
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
import { CurrentUser, User } from '@island.is/auth-nest-tools'

@Resolver()
export class MainResolver {
  constructor(private readonly universityGatewayApi: UniversityGatewayApi) {}

  @Query(() => UniversityGatewayProgramsPaginated)
  universityGatewayPrograms() {
    return this.universityGatewayApi.getActivePrograms()
  }

  @Query(() => UniversityGatewayProgramDetails)
  universityGatewayProgram(
    @Args('input') input: UniversityGatewayGetPogramInput,
  ) {
    return this.universityGatewayApi.getProgramById(input)
  }

  @Query(() => [UniversityGatewayProgramFilter])
  universityGatewayProgramFilters() {
    return this.universityGatewayApi.getProgramFilters()
  }

  @Query(() => [UniversityGatewayApplication])
  universityGatewayApplicationById(
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() user: User,
  ) {
    return this.universityGatewayApi.getUniversityApplicationById(user, id)
  }
}
