import { Args, Query, Resolver } from '@nestjs/graphql'
import { UniversityGatewayApi } from '../universityGateway.service'
import { GetProgramByIdInput, ProgramsPaginated } from './dto'
import { ProgramDetails, ProgramFilter, University } from './models'

export
@Resolver()
class MainResolver {
  constructor(private readonly universityGatewayApi: UniversityGatewayApi) {}

  @Query(() => ProgramsPaginated)
  universityGatewayActivePrograms() {
    return this.universityGatewayApi.getActivePrograms()
  }

  @Query(() => ProgramDetails)
  universityGatewayProgramById(@Args('input') input: GetProgramByIdInput) {
    return this.universityGatewayApi.getProgramById(input)
  }

  @Query(() => [University])
  universityGatewayUniversities() {
    return this.universityGatewayApi.getUniversities()
  }

  @Query(() => [ProgramFilter])
  universityGatewayProgramFilters() {
    return this.universityGatewayApi.getProgramFilters()
  }
}
