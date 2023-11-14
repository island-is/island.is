import { Args, Query, Resolver } from '@nestjs/graphql'
import { UniversityGatewayApi } from '../universityGateway.service'
import {
  UniversityGatewayGetPogramInput,
  UniversityGatewayProgramsPaginated,
} from './dto'
import {
  UniversityGatewayProgramDetails,
  UniversityGatewayProgramFilter,
} from './models'

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
}
