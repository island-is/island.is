import { Injectable } from '@nestjs/common'
import { ProgramsApi } from '../../gen/fetch/apis'
import { IProgram } from '@island.is/university-gateway'
import { mapUglaPrograms } from '@island.is/clients/university-application/university-of-iceland'

@Injectable()
export class BifrostUniversityApplicationClient {
  constructor(private readonly programsApi: ProgramsApi) {}

  async getPrograms(): Promise<IProgram[]> {
    const res = await this.programsApi.activeProgramsGet()

    return mapUglaPrograms(res, 'bifrost-university')
  }
}
