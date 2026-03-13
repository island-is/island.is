import { Injectable } from '@nestjs/common'
import { writeFileSync } from 'fs'
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
    const result = await this.programmesApi.v1ProgrammesGet()
    writeFileSync('./programmes.json', JSON.stringify(result, null, 2))
    return result
  }

  async getFilterOptions(): Promise<ProgrammeFilterOptionsDto> {
    return this.programmesApi.v1ProgrammesFilterOptionsGet()
  }

  async getProgrammeById(id: string): Promise<ProgrammeReturnDto> {
    return this.programmesApi.v1ProgrammesProgrammeIdGet({ programmeId: id })
  }
}
