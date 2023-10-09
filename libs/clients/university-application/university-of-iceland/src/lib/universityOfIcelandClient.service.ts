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
} from '@island.is/university-gateway-lib'
import { logger } from '@island.is/logging'

export
@Injectable()
class UniversityOfIcelandApplicationClient {
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
          applicationEndDate: new Date(), //TODO missing in api
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
          languages: [], //TODO will not be used yet
          searchKeywords: [], //TODO missing in api
          externalUrlIs: program.externalUrlIs,
          externalUrlEn: program.externalUrlEn,
          admissionRequirementsIs: program.admissionRequirementsIs,
          admissionRequirementsEn: program.admissionRequirementsEn,
          studyRequirementsIs: program.studyRequirementsIs,
          studyRequirementsEn: program.studyRequirementsEn,
          costInformationIs: program.costInformationIs,
          costInformationEn: program.costInformationEn,
          tag: [], //TODO will not be used yet
          modeOfDelivery:
            program.modeOfDelivery?.map((m) => {
              // TODO handle when ráðuneyti has made decisions
              if (m.toString() === 'MIXED') {
                return ModeOfDelivery.OTHER
              } else {
                return mapStringToEnum(m, ModeOfDelivery)
              }
            }) || [],
          extraApplicationFields: program.extraApplicationFields?.map(
            (field) => ({
              nameIs: field.nameIs || '',
              nameEn: field.nameEn || '',
              descriptionIs: field.descriptionIs,
              descriptionEn: field.descriptionEn,
              required: field.required || false,
              fieldKey: '', //TODO missing in api
              fieldType: field.fieldType as unknown as FieldType,
              uploadAcceptedFileType: field.uploadAcceptedFileType,
            }),
          ),
          minors: [], //TODO missing in api
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
    })

    const mappedRes = []
    const courseList = res.data || []
    for (let i = 0; i < courseList.length; i++) {
      const course = courseList[i]
      try {
        let requirement: Requirement | undefined = undefined
        switch (course.required) {
          case 'M':
            requirement = Requirement.MANDATORY
            break
          case 'O':
            requirement = Requirement.FREE_ELECTIVE
            break
          case '0':
            requirement = Requirement.FREE_ELECTIVE
            break
          case 'C':
            requirement = Requirement.RESTRICTED_ELECTIVE
            break
          case '':
            requirement = Requirement.UNDEFINED
            break
        }
        if (requirement === undefined) {
          throw new Error(`Not able to map requirement: ${course.required}`)
        }

        let semesterSeason: Season | undefined = undefined
        switch (course.semesterSeason) {
          case 'V':
            semesterSeason = Season.SPRING
            break
          case 'H':
            semesterSeason = Season.FALL
            break
          case 'S':
            semesterSeason = Season.SUMMER
            break
          case 'A': // TODO what value is this -> "heilsár"
            semesterSeason = Season.FALL
            break
          case '': // TODO what value is this -> "á ekki við"
            semesterSeason = Season.FALL
            break
        }
        if (!semesterSeason) {
          throw new Error(
            `Not able to map semester season: ${course.semesterSeason?.toString()}`,
          )
        }

        const externalIdList = course.externalId || []
        for (let j = 0; j < externalIdList.length; j++) {
          mappedRes.push({
            externalId: externalIdList[j],
            // minorExternalId: course.minorId, //TODO missing in api
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
        }
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
