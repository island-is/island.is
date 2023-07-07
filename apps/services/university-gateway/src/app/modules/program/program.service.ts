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
import { University } from '../university/model'

@Injectable()
export class ProgramService {
  constructor(
    private readonly ugReykjavikUniversityClient: UgReykjavikUniversityClient,
    @InjectModel(Program)
    private programModel: typeof Program,

    @InjectModel(ProgramTag)
    private programTagModel: typeof ProgramTag,

    @InjectModel(University)
    private universityModel: typeof University,

    @InjectModel(Tag)
    private tagModel: typeof Tag,
  ) {}

  async triggerWorker(): Promise<string> {
    var majors = await this.ugReykjavikUniversityClient.getMajors()

    const universityNationalId = '6001692039'
    const universityId = (
      await this.universityModel.findOne({
        where: { nationalId: universityNationalId },
      })
    )?.id

    for (let i = 0; i < 5; i++) {
      console.log(majors[i])

      const externalId = majors[i].id?.toString() //TODO

      const programName = majors[i].name

      const departmentName =
        majors[i].departmentId &&
        (
          await this.ugReykjavikUniversityClient.getDepartment(
            majors[i].departmentId!,
          )
        )?.name

      const applicationStartDate = majors[i].courseRegistrationBegins
      const applicationEndDate = majors[i].courseRegistrationEnds

      let degreeType: DegreeType = DegreeType.UNDERGRADUATE
      switch (majors[i].majorTypeKey) {
        case 'grunnnám':
          degreeType = DegreeType.UNDERGRADUATE
        case 'meistaranám':
          degreeType = DegreeType.POSTGRADUATE
        case 'doktorsnám':
          degreeType = DegreeType.DOCTORAL
      }

      const credits = majors[i].credits

      const durationInYears = majors[i].years

      const tagList = [{ code: 'engineering' }, { code: 'science' }] //TODO

      //TODOx update or create

      const program = await this.programModel.create({
        externalId: externalId,
        active: true,
        nameIs: programName,
        nameEn: programName, //TODO
        universityId: universityId,
        departmentNameIs: departmentName,
        departmentNameEn: departmentName, //TODO
        startingSemesterYear: 2023, //TODO
        startingSemesterSeason: Season.FALL, //TODO
        applicationStartDate: applicationStartDate,
        applicationEndDate: applicationEndDate,
        degreeType: degreeType,
        degreeAbbreviation: 'TODO',
        credits: credits,
        descriptionIs: 'TODO',
        descriptionEn: 'TODO',
        durationInYears: durationInYears,
        costPerYear: null, //TODO
        iscedCode: 'TODO',
        externalUrlIs: 'TODO',
        externalUrlEn: 'TODO',
        searchKeywords: ['Test1', 'Test2'], //TODO
        admissionRequirementsIs: 'TODO',
        admissionRequirementsEn: 'TODO',
        studyRequirementsIs: 'TODO',
        studyRequirementsEn: 'TODO',
        costInformationIs: 'TODO',
        costInformationEn: 'TODO',
        courses: [],
        extraApplicationFields: [],
        modeOfDelivery: [],
      })

      //TODOx courses
      //TODOx extraApplicationFields
      //TODOx modeOfDelivery

      for (let j = 0; j < tagList.length; j++) {
        const programId = program.id
        const tag = await this.tagModel.findOne({
          where: { code: tagList[j].code },
        })

        if (tag) {
          this.programTagModel.create({
            programId: programId,
            tagId: tag?.id,
          })
        }
      }
    }

    return 'Finished adding data to DB'
  }

  //TODOx dont return all columns...
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

    const programs = await this.programModel.findAll({ where })
    //TODOx tags
    //TODOx courses
    //TODOx extraApplicationFields
    //TODOx modeOfDelivery

    return {
      data: programs,
      //TODOx pageInfo
      pageInfo: {
        hasPreviousPage: false,
        hasNextPage: false,
        startCursor: '',
        endCursor: '',
      },
      totalCount: programs.length,
    }
  }

  async getProgramDetails(id: string): Promise<ProgramDetailsResponse> {
    const program = await this.programModel.findOne({ where: { id: id } })

    if (!program) {
      throw Error('Not found')
    }

    return { data: program }
  }

  async getTags(): Promise<TagResponse> {
    return { data: await this.tagModel.findAll() }
  }
}
