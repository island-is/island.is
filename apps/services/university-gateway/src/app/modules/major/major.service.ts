import { Injectable } from '@nestjs/common'
import { MajorDetails, MajorDetailsResponse, MajorResponse } from './model'
import { UgReykjavikUniversityClient } from '@island.is/clients/university-gateway/reykjavik-university'
import { DegreeType, PaginateInput, Season } from './types'
import { CreateMajorDto, UpdateMajorDto } from './dto'

//TODOx connect with new university DB

@Injectable()
export class MajorService {
  constructor(
    private readonly ugReykjavikUniversityClient: UgReykjavikUniversityClient,
  ) {}

  async getMajors(
    { after, before, limit }: PaginateInput,
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

  async createMajor(majorDto: CreateMajorDto): Promise<MajorDetails> {
    throw Error('Not ready')
  }

  async updateMajor(
    id: string,
    majorDto: UpdateMajorDto,
  ): Promise<MajorDetails> {
    throw Error('Not ready')
  }

  async deleteMajor(id: string): Promise<number> {
    throw Error('Not ready')
  }
}
