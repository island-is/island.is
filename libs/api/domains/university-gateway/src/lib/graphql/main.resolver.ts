import { Args, Query, Resolver } from '@nestjs/graphql'
import { UniversityGatewayApi } from '../universityGateway.service'
import {
  UniversityGatewayGetProgramByIdInput,
  UniversityGatewayProgramsPaginated,
} from './dto'
import {
  UniversityGatewayProgramDetails,
  UniversityGatewayProgramFilter,
  UniversityGatewayUniversity,
} from './models'

@Resolver()
export class MainResolver {
  constructor(private readonly universityGatewayApi: UniversityGatewayApi) {}

  @Query(() => UniversityGatewayProgramsPaginated)
  universityGatewayActivePrograms() {
    return this.universityGatewayApi.getActivePrograms()
  }

  @Query(() => UniversityGatewayProgramDetails)
  universityGatewayProgramById(
    @Args('input') input: UniversityGatewayGetProgramByIdInput,
  ) {
    return this.universityGatewayApi.getProgramById(input)
  }

  @Query(() => [UniversityGatewayUniversity])
  universityGatewayUniversities() {
    return this.universityGatewayApi.getUniversities()
  }

  @Query(() => [UniversityGatewayProgramFilter])
  universityGatewayProgramFilters() {
    return this.universityGatewayApi.getProgramFilters()
  }
}
