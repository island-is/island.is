import { Injectable } from '@nestjs/common'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { ProgramApi } from '@island.is/clients/university-gateway-api'
import { GetProgramByIdInput, ProgramsPaginated } from './graphql/dto'
import { GetProgramsInput } from './graphql/dto/getPrograms.input'
import { ProgramDetails } from './graphql/models'
import { DegreeType, Season } from '@island.is/university-gateway-types'

export
@Injectable()
class UniversityGatewayApi {
  constructor(private readonly programApi: ProgramApi) {}

  private programApiWithAuth(auth: Auth) {
    return this.programApi.withMiddleware(new AuthMiddleware(auth))
  }

  async getPrograms(
    user: User,
    input: GetProgramsInput,
  ): Promise<ProgramsPaginated> {
    const res = await this.programApiWithAuth(
      user,
    ).programControllerGetPrograms({
      limit: input.limit,
      before: input.before,
      after: input.after,
      active: input.active,
      year: input.year,
      season: input.season,
      universityId: input.universityId,
      degreeType: input.degreeType,
    })

    return {
      ...res,
      data: res.data.map((item) => ({
        ...item,
        startingSemesterSeason:
          item.startingSemesterSeason as unknown as Season, //TODO
        degreeType: item.degreeType as unknown as DegreeType, //TODO
      })),
    }
  }

  async getProgramById(
    user: User,
    input: GetProgramByIdInput,
  ): Promise<ProgramDetails> {
    const res = await this.programApiWithAuth(
      user,
    ).programControllerGetProgramDetails({
      id: input.id,
    })

    const item = res.data

    return {
      ...item,
      startingSemesterSeason: item.startingSemesterSeason as unknown as Season, //TODO
      degreeType: item.degreeType as unknown as DegreeType, //TODO
    }
  }
}
