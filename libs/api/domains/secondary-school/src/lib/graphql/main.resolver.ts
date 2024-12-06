import { Args, Query, Resolver } from '@nestjs/graphql'
import { SecondarySchoolApi } from '../secondarySchool.service'
import { SecondarySchoolProgram } from './models'

@Resolver()
export class MainResolver {
  constructor(private readonly secondarySchoolApi: SecondarySchoolApi) {}

  @Query(() => [SecondarySchoolProgram])
  async secondarySchoolProgramsBySchoolId(
    @Args('schoolId', { type: () => String }) schoolId: string,
  ) {
    return await this.secondarySchoolApi.getProgramsBySchoolId(schoolId)
  }
}
