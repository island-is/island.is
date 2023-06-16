import { Injectable } from '@nestjs/common'
import { ProgramDetailsResponse, ProgramResponse } from './model'
import { UgReykjavikUniversityClient } from '@island.is/clients/university-gateway/reykjavik-university'
import { DegreeType, PaginateInput, Season } from './types'

//TODOx connect with new university DB

@Injectable()
export class ProgramService {
  constructor(
    private readonly ugReykjavikUniversityClient: UgReykjavikUniversityClient,
  ) {}

  async getPrograms(
    { after, before, limit }: PaginateInput,
    active: boolean,
    year: number,
    season: Season,
    universityId: string,
    degreeType: DegreeType,
  ): Promise<ProgramResponse> {
    throw Error('Not ready')
  }

  async getProgramDetails(id: string): Promise<ProgramDetailsResponse> {
    throw Error('Not ready')
  }
}
