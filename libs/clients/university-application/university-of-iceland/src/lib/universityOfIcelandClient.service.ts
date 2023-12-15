import { Injectable } from '@nestjs/common'
import { CoursesApi, ProgramsApi } from '../../gen/fetch/apis'
import {
  CourseSeason,
  DegreeType,
  FieldType,
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
          schoolAnswerDate: undefined, //TODO missing in api
          studentAnswerDate: undefined, //TODO missing in api
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

  async getCourses(programExternalId: string): Promise<ICourse[]> {
    const res = await this.coursesApi.programExternalIdCoursesGet({
      externalId: programExternalId,
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

        const semesterSeason = mapStringToEnum(
          course.semesterSeason?.toString(),
          CourseSeason,
        )
        if (!semesterSeason) {
          throw new Error(
            `Not able to map semester season: ${course.semesterSeason?.toString()}`,
          )
        }

        // Note: these fields are all array since we get "bundin skylda" as
        // as array of courses. We will display them on out side are separate
        // disconnected courses
        const externalIdList = course.externalId || []
        const nameIsList = course.nameIs || []
        const nameEnList = course.nameEn || []
        const descriptionIsList = course.descriptionIs || []
        const descriptionEnList = course.descriptionEn || []
        const externalUrlIsList = course.externalUrlIs || []
        const externalUrlEnList = course.externalUrlEn || []

        for (let i = 0; i < externalIdList.length; i++) {
          mappedRes.push({
            externalId: externalIdList[i],
            nameIs: nameIsList[i],
            nameEn: nameEnList[i],
            credits: Number(course.credits?.replace(',', '.')) || 0,
            descriptionIs: descriptionIsList[i],
            descriptionEn: descriptionEnList[i],
            externalUrlIs: externalUrlIsList[i],
            externalUrlEn: externalUrlEnList[i],
            requirement: requirement,
            semesterYear: Number(course.semesterYear),
            semesterSeason: semesterSeason,
          })
        }
      } catch (e) {
        logger.error(
          `Failed to map course with externalId ${course.externalId?.toString()} for program with externalId ${programExternalId} (University of Iceland), reason:`,
          e,
        )
      }
    }

    return mappedRes
  }
}
