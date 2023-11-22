import { Injectable } from '@nestjs/common'
import { Program } from './model/program'
import { ProgramModeOfDelivery } from './model/programModeOfDelivery'
import { ProgramCourse } from './model/programCourse'
import { ProgramExtraApplicationField } from './model/programExtraApplicationField'
import { ProgramsResponse } from './dto/programsResponse'
import { Course } from '../course/model/course'
import { University } from '../university/model/university'
import { InjectModel } from '@nestjs/sequelize'
import { paginate } from '@island.is/nest/pagination'
import { DegreeType, Season } from '@island.is/university-gateway'
import { NoContentException } from '@island.is/nest/problem'

@Injectable()
export class ProgramService {
  constructor(
    @InjectModel(Program)
    private programModel: typeof Program,
  ) {}

  async getPrograms(
    limit: number,
    after: string,
    before?: string,
    active?: boolean,
    year?: number,
    season?: Season,
    universityId?: string,
    degreeType?: DegreeType,
  ): Promise<ProgramsResponse> {
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
          'allowException',
          'allowThirdLevelQualification',
          'courses',
          'extraApplicationFields',
          //TODOx add all apiHideProperty fields
        ],
      },
      include: [
        {
          model: University,
        },
        {
          model: ProgramModeOfDelivery,
        },
      ],
    })
  }

  async getProgramById(id: string): Promise<Program> {
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

    return program
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
