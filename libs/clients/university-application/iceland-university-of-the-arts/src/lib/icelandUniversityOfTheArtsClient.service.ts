import { Injectable } from '@nestjs/common'
import { ProgramsApi } from '../../gen/fetch/apis'
import { IProgram } from '@island.is/university-gateway'
import { logger } from '@island.is/logging'
import { mapUglaPrograms } from '@island.is/clients/university-application/university-of-iceland'

@Injectable()
export class IcelandUniversityOfTheArtsApplicationClient {
  constructor(private readonly programsApi: ProgramsApi) {}

  async getPrograms(): Promise<IProgram[]> {
    const res = await this.programsApi.activeProgramsGet()

    return mapUglaPrograms(res, 'iceland-university-of-the-arts')
  }
}
