import { Injectable } from '@nestjs/common'
import { HvinApi } from '../../gen/fetch'
import {
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

export
@Injectable()
class ReykjavikUniversityApplicationClient {
  constructor(private hvinApi: HvinApi) {}

  async getPrograms(): Promise<IProgram[]> {
    const res = await this.hvinApi.hvinActivePrograms({ version: '1' })

    const mappedRes = []
    const programList = res || []
    for (let i = 0; i < programList.length; i++) {
      const program = programList[i]
      try {
        mappedRes.push({
          externalId: program.externalId || '',
          nameIs: program.nameIs || '',
          nameEn: program.nameEn || '',
          departmentNameIs: program.departmentNameIs || '',
          departmentNameEn: program.departmentNameEn || '',
          startingSemesterYear: program.startingSemesterYear || 0,
          startingSemesterSeason: mapStringToEnum(
            program.startingSemesterSeason,
            Season,
          ),
          applicationStartDate: program.applicationStartDate || new Date(),
          applicationEndDate: program.applicationEndDate || new Date(),
          schoolAnswerDate: undefined, //TODO missing in api
          studentAnswerDate: undefined, //TODO missing in api
          degreeType: mapStringToEnum(
            program.degreeType,
            DegreeType,
            DegreeType.OTHER,
          ),
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
              // TODO why is this value empty
              if (!m) {
                return ModeOfDelivery.UNDEFINED
              } else {
                return mapStringToEnum(m, ModeOfDelivery)
              }
            }) || [],
          extraApplicationFields: program.extraApplicationFields?.map(
            (field) => ({
              externalId: field.fieldKey || '',
              nameIs: field.nameIs || '',
              nameEn: field.nameEn || '',
              descriptionIs: field.descriptionIs,
              descriptionEn: field.descriptionEn,
              required: field.required || false,
              fieldType: field.fieldType as unknown as FieldType,
              uploadAcceptedFileType: field.uploadAcceptedFileType,
            }),
          ),
        })
      } catch (e) {
        logger.error(
          `Failed to map program with externalId ${program.externalId} (Reykjavik University), reason:`,
          e,
        )
      }
    }

    return mappedRes
  }

  async getCourses(externalId: string): Promise<ICourse[]> {
    const res = await this.hvinApi.hvinActivePrograms({ version: '1' })

    const program = res.find((p) => p.externalId === externalId)

    if (!program) {
      throw new Error('Did not find program for courses by program external id')
    }

    const mappedRes = []
    const courseList = program.courses || []
    for (let i = 0; i < courseList.length; i++) {
      const course = courseList[i]
      try {
        let semesterSeason: Season | undefined = undefined
        // TODO what value is this
        if (course.semesterSeason === 'NOTSET') {
          semesterSeason = Season.FALL
        } else {
          semesterSeason = mapStringToEnum(course.semesterSeason, Season)
        }

        mappedRes.push({
          externalId: course.externalId || '',
          nameIs: course.nameIs || '',
          nameEn: course.nameEn || '',
          credits: course.credits || 0,
          descriptionIs: course.descriptionIs,
          descriptionEn: course.descriptionEn,
          externalUrlIs: course.externalUrlIs,
          externalUrlEn: course.externalUrlEn,
          requirement: course.required
            ? Requirement.MANDATORY
            : Requirement.FREE_ELECTIVE, //TODO missing in api
          semesterYear: course.semesterYear,
          semesterSeason: semesterSeason,
        })
      } catch (e) {
        logger.error(
          `Failed to map course with externalId ${course.externalId} for program with externalId ${externalId} (Reykjavik University), reason:`,
          e,
        )
      }
    }

    return mappedRes
  }
}
