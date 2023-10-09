import { Injectable } from '@nestjs/common'
import {
  ProgramCourse,
  ProgramDetailsResponse,
  ProgramExtraApplicationField,
  ProgramMinor,
  ProgramModeOfDelivery,
  ProgramResponse,
  ProgramTable,
  ProgramTag,
  Tag,
  TagResponse,
} from './model'
import { Course } from '../course/model'
import { University } from '../university/model'
import { PaginateInput } from './types'
import { InjectModel } from '@nestjs/sequelize'
import { paginate } from '@island.is/nest/pagination'
import { DegreeType, Season } from '@island.is/university-gateway-lib'
import { logger } from '@island.is/logging'

export
@Injectable()
class ProgramService {
  constructor(
    @InjectModel(ProgramTable)
    private programModel: typeof ProgramTable,

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

    return await paginate({
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
          'minors',
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
    const program = await this.programModel.findOne({
      where: { id: id },
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
        {
          model: ProgramMinor,
        },
      ],
    })

    if (!program) {
      const errorMsg = `Program with id ${id} found`
      logger.error(`Failed to get application, reason:`, errorMsg)
      throw new Error(errorMsg)
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
