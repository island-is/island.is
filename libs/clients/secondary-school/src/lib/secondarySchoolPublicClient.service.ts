import { Injectable } from '@nestjs/common'
import { ProgrammesApi } from '../../gen/fetch/apis'
import {
  ProgrammeFilterOptionsDto,
  ProgrammeReturnDto,
  ProgrammeSimpleReturnDto,
} from '../../gen/fetch'

@Injectable()
export class SecondarySchoolPublicClient {
  constructor(private readonly programmesApi: ProgrammesApi) {}

  async getAllProgrammes(): Promise<ProgrammeSimpleReturnDto[]> {
    return this.programmesApi.v1ProgrammesGet()
  }

  async getFilterOptions(): Promise<ProgrammeFilterOptionsDto> {
    return this.programmesApi.v1ProgrammesFilterOptionsGet()
  }

  async getProgrammeById(id: string): Promise<ProgrammeReturnDto> {
    return this.programmesApi.v1ProgrammesProgrammeIdGet({ programmeId: id })
  }
}
