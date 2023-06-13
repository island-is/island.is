import { Injectable } from '@nestjs/common'
import { MajorDetailsResponse, MajorResponse } from './model'
import { UgReykjavikUniversityClient } from '@island.is/clients/university-gateway/reykjavik-university'
import { DegreeType, PaginateInput, Season } from './types'

//TODOx connect with new university DB

@Injectable()
export class MajorService {
  constructor(
    private readonly ugReykjavikUniversityClient: UgReykjavikUniversityClient,
  ) {}

  async getMajors(
    { after, before, limit }: PaginateInput,
    active: boolean,
    year: number,
    season: Season,
    universityId: string,
    degreeType: DegreeType,
  ): Promise<MajorResponse> {
    throw Error('Not ready')
  }

  async getMajorDetails(id: string): Promise<MajorDetailsResponse> {
    throw Error('Not ready')
  }
}
