import { Injectable } from '@nestjs/common'
import { CoursesApi, ProgramsApi } from '../../gen/fetch/apis'
import {
  ApplicationStatus,
  DegreeType,
  FieldType,
  IApplication,
  ICourse,
  IProgram,
  ModeOfDelivery,
  Requirement,
  Season,
  mapStringToEnum,
} from '@island.is/university-gateway'
import { logger } from '@island.is/logging'

@Injectable()
export class UniversityOfIcelandApplicationClient {
  constructor(
    private readonly programsApi: ProgramsApi,
    private readonly coursesApi: CoursesApi,
  ) {}

  async getPrograms(): Promise<IProgram[]> {
    const res = await this.programsApi.activeProgramsGet()

    const mappedRes = []
    const programList = res.data || []
    for (let i = 0; i < programList.length; i++) {
      const program = programList[i]
      try {
        mappedRes.push({
          externalId: program.externalId || '',
          nameIs: program.nameIs || '',
          nameEn: program.nameEn || '',
          departmentNameIs: program.departmentNameIs || '',
          departmentNameEn: program.departmentNameEn || '',
          startingSemesterYear: Number(program.startingSemesterYear) || 0,
          startingSemesterSeason: mapStringToEnum(
            program.startingSemesterSeason,
            Season,
          ),
          applicationStartDate: program.applicationStartDate || new Date(),
          applicationEndDate: program.applicationEndDate || new Date(),
          schoolAnswerDate: undefined, //TODO will not be used yet
          studentAnswerDate: undefined, //TODO will not be used yet
          degreeType: mapStringToEnum(program.degreeType, DegreeType),
          degreeAbbreviation: program.degreeAbbreviation || '',
          credits: program.credits || 0,
          descriptionIs: program.descriptionIs || '',
          descriptionEn: program.descriptionEn || '',
          durationInYears: program.durationInYears || 0,
          costPerYear: program.costPerYear,
          iscedCode: program.iscedCode || '',
          externalUrlIs: program.externalUrlIs,
          externalUrlEn: program.externalUrlEn,
          admissionRequirementsIs: program.admissionRequirementsIs,
          admissionRequirementsEn: program.admissionRequirementsEn,
          studyRequirementsIs: program.studyRequirementsIs,
          studyRequirementsEn: program.studyRequirementsEn,
          costInformationIs: program.costInformationIs,
          costInformationEn: program.costInformationEn,
          allowException: false, //TODO missing in api
          allowThirdLevelQualification: false, //TODO missing in api
          modeOfDelivery:
            program.modeOfDelivery?.map((m) => {
              // TODO handle when ráðuneyti has made decisions
              if (m.toString() === 'MIXED') {
                return ModeOfDelivery.UNDEFINED
              } else {
                return mapStringToEnum(m, ModeOfDelivery)
              }
            }) || [],
          extraApplicationFields: program.extraApplicationFields?.map(
            (field) => ({
              externalId: '', //TODO missing in api
              nameIs: field.nameIs || '',
              nameEn: field.nameEn || '',
              descriptionIs: field.descriptionIs,
              descriptionEn: field.descriptionEn,
              required: field.required || false,
              fieldType: field.fieldType as unknown as FieldType,
              uploadAcceptedFileType: field.uploadAcceptedFileType,
              options: undefined, //TODO missing in api
            }),
          ),
          specializations: program.kjorsvid?.map((k) => ({
            externalId: k.id?.toString() || '',
            nameIs: k.heiti || '',
            nameEn: k.heitiEn || '',
          })),
        })
      } catch (e) {
        logger.error(
          `Failed to map program with externalId ${program.externalId} (University of Iceland), reason:`,
          e,
        )
      }
    }

    return mappedRes
  }

  async getCourses(externalId: string): Promise<ICourse[]> {
    const res = await this.coursesApi.programExternalIdCoursesGet({
      externalId,
      // specializationExternalId // TODO missing in api
    })

    const mappedRes = []
    const courseList = res.data || []
    for (let i = 0; i < courseList.length; i++) {
      const course = courseList[i]
      try {
        let requirement: Requirement | undefined = undefined
        switch (course.required) {
          case 'MANDATORY':
            requirement = Requirement.MANDATORY
            break
          case 'ELECTIVE':
            requirement = Requirement.FREE_ELECTIVE
            break
          case 'RESTRICTED_ELECTIVE':
            requirement = Requirement.RESTRICTED_ELECTIVE
            break
        }
        if (requirement === undefined) {
          throw new Error(`Not able to map requirement: ${course.required}`)
        }

        let semesterSeason: Season | undefined = undefined
        switch (course.semesterSeason) {
          case 'SPRING':
            semesterSeason = Season.SPRING
            break
          case 'FALL':
            semesterSeason = Season.FALL
            break
          case 'SUMMER':
            semesterSeason = Season.SUMMER
            break
          case 'WHOLE-YEAR': // TODO what value should this map to ("heilsár")
            semesterSeason = Season.FALL
            break
          case 'ANY': // TODO what value should this map to ("á ekki við")
            semesterSeason = Season.FALL
            break
        }
        if (!semesterSeason) {
          throw new Error(
            `Not able to map semester season: ${course.semesterSeason?.toString()}`,
          )
        }

        //TODO how should we handle bundin skylda
        const externalId = (course.externalId || []).join(',')

        //TODO why is externalId empty
        if (!externalId) continue

        mappedRes.push({
          externalId: externalId,
          nameIs: course.nameIs || '',
          nameEn: course.nameEn || '',
          credits: Number(course.credits?.replace(',', '.')) || 0,
          descriptionIs: course.descriptionIs,
          descriptionEn: course.descriptionEn,
          externalUrlIs: course.externalUrlIs,
          externalUrlEn: course.externalUrlEn,
          requirement: requirement,
          semesterYear: Number(course.semesterYear),
          semesterSeason: semesterSeason,
        })
      } catch (e) {
        logger.error(
          `Failed to map course with externalId ${course.externalId?.toString()} for program with externalId ${externalId} (University of Iceland), reason:`,
          e,
        )
      }
    }

    return mappedRes
  }

  async getApplicationStatus(externalId: string): Promise<ApplicationStatus> {
    // TODOx connect to HÍ API
    return ApplicationStatus.IN_REVIEW
  }

  async createApplication(application: IApplication) {
    // TODOx connect to HÍ API
    return true
  }

  async updateApplicationStatus(externalId: string, status: ApplicationStatus) {
    // TODOx connect to HÍ API
    return true
  }
}
