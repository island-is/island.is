import { Injectable } from '@nestjs/common'
import {
  ProgramDetailsResponse,
  ProgramResponse,
  ProgramTable,
} from './model/program'
import { ProgramTag } from './model/programTag'
import { Tag, TagResponse } from './model/tag'
import { ProgramModeOfDelivery } from './model/programModeOfDelivery'
import { ProgramCourse } from './model/programCourse'
import { ProgramExtraApplicationField } from './model/programExtraApplicationField'
import { Course } from '../course'
import { University } from '../university'
import { PaginateInput } from './types/paginateInput'
import { InjectModel } from '@nestjs/sequelize'
import { paginate } from '@island.is/nest/pagination'
import { DegreeType, Season } from '@island.is/university-gateway'
import { NoContentException } from '@island.is/nest/problem'

@Injectable()
export class ProgramService {
  constructor(
    @InjectModel(ProgramTable)
    private programModel: typeof ProgramTable,

    @InjectModel(ProgramTag)
    private programTagModel: typeof ProgramTag,

    @InjectModel(University)
    private universityModel: typeof University,

    @InjectModel(Tag)
    private tagModel: typeof Tag,
  ) {}

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

    return paginate({
      Model: this.programModel,
      limit: limit,
      after: after,
      before: before,
      primaryKeyField: 'id',
      orderOption: [['created', 'ASC']],
      where: where,
      attributes: {
        exclude: [
          'externalUrlIs',
          'externalUrlEn',
          'admissionRequirementsIs',
          'admissionRequirementsEn',
          'studyRequirementsIs',
          'studyRequirementsEn',
          'costInformationIs',
          'costInformationEn',
          'courses',
          'extraApplicationFields',
        ],
      },
      include: [
        {
          model: University,
        },
        {
          model: ProgramTag,
          include: [
            {
              model: Tag,
            },
          ],
        },
        {
          model: ProgramModeOfDelivery,
        },
      ],
    })
  }

  async getProgramDetails(id: string): Promise<ProgramDetailsResponse> {
    const program = await this.programModel.findByPk(id, {
      include: [
        {
          model: University,
        },
        {
          model: ProgramCourse,
          include: [
            {
              model: Course,
            },
          ],
        },
        {
          model: ProgramTag,
          include: [
            {
              model: Tag,
            },
          ],
        },
        {
          model: ProgramModeOfDelivery,
        },
        {
          model: ProgramExtraApplicationField,
        },
      ],
    })

    if (!program) {
      throw new NoContentException()
    }

    return { data: program }
  }

  async getTags(): Promise<TagResponse> {
    const tags = await this.tagModel.findAll()
    return { data: tags }
  }

  async getDurationInYears(): Promise<string[]> {
    const programs = await this.programModel.findAndCountAll({
      group: 'duration_in_years',
      attributes: ['durationInYears'],
      order: ['durationInYears'],
    })

    return programs.rows.map((x) => x.durationInYears.toString())
  }
}
