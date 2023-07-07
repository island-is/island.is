import { Injectable } from '@nestjs/common'
import {
  Program,
  ProgramDetailsResponse,
  ProgramResponse,
  ProgramTag,
  Tag,
  TagResponse,
} from './model'
import { UgReykjavikUniversityClient } from '@island.is/clients/university-gateway/reykjavik-university'
import { DegreeType, PaginateInput, Season } from './types'
import { InjectModel } from '@nestjs/sequelize'
import { paginate } from '@island.is/nest/pagination'

@Injectable()
export class ProgramService {
  constructor(
    private readonly ugReykjavikUniversityClient: UgReykjavikUniversityClient,

    @InjectModel(Program)
    private programModel: typeof Program,

    @InjectModel(ProgramTag)
    private programTagModel: typeof ProgramTag,

    @InjectModel(Tag)
    private tagModel: typeof Tag,
  ) {}

  //TODOx smaller object when returning list
  async getPrograms(
    { after, before, limit }: PaginateInput,
    active?: boolean,
    year?: number,
    season?: Season,
    universityId?: string,
    degreeType?: DegreeType,
  ): Promise<ProgramResponse> {
    const where: {
      active?: boolean
      startingSemesterYear?: number
      startingSemesterSeason?: Season
      universityId?: string
      degreeType?: DegreeType
    } = {}
    if (active !== undefined) where.active = active
    if (year !== undefined) where.startingSemesterYear = year
    if (season !== undefined) where.startingSemesterSeason = season
    if (universityId !== undefined) where.universityId = universityId
    if (degreeType !== undefined) where.degreeType = degreeType

    return await paginate({
      Model: this.programModel,
      limit: limit,
      after: after,
      before: before,
      primaryKeyField: 'id',
      orderOption: [['id', 'ASC']],
      where: where,
    })

    //TODOx tags
    //TODOx courses
    //TODOx modeOfDelivery
    //TODOx extraApplicationFields
  }

  async getProgramDetails(id: string): Promise<ProgramDetailsResponse> {
    const program = await this.programModel.findOne({ where: { id: id } })

    if (!program) {
      throw Error('Not found')
    }

    return { data: program }
  }

  async getTags(): Promise<TagResponse> {
    const tags = await this.tagModel.findAll()
    return { data: tags }
  }
}
