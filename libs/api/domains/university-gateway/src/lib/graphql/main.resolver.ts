import { Args, Query, Resolver } from '@nestjs/graphql'
import { UniversityGatewayApi } from '../universityGateway.service'
import { GetProgramByIdInput, GetProgramsInput, ProgramsPaginated } from './dto'
import { ProgramDetails } from './models'

export
@Resolver()
class MainResolver {
  constructor(private readonly universityGatewayApi: UniversityGatewayApi) {}

  @Query(() => ProgramsPaginated)
  universityGatewayPrograms(@Args('input') input: GetProgramsInput) {
    return this.universityGatewayApi.getPrograms(input)
  }

  @Query(() => ProgramDetails)
  universityGatewayProgramById(@Args('input') input: GetProgramByIdInput) {
    return this.universityGatewayApi.getProgramById(input)
  }
}
