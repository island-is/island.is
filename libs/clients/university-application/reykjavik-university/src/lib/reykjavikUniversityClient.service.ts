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
} from '@island.is/university-gateway-lib'

export
@Injectable()
class ReykjavikUniversityApplicationClient {
  constructor(private hvinApi: HvinApi) {}

  async getPrograms(): Promise<IProgram[]> {
    const res = await this.hvinApi.hvinActivePrograms({ version: '1' })

    return (
      res?.map((program) => {
        return {
          externalId: program.externalId || '',
          nameIs: program.nameIs || '',
          nameEn: program.nameEn || '',
          departmentNameIs: program.departmentNameIs || '',
          departmentNameEn: program.departmentNameEn || '',
          startingSemesterYear: program.startingSemesterYear || 0,
          startingSemesterSeason: program.startingSemesterSeason
            ? mapStringToEnum(program.startingSemesterSeason, Season)
            : Season.FALL,
          applicationStartDate: program.applicationStartDate || new Date(),
          applicationEndDate: program.applicationEndDate || new Date(),
          degreeType: program.degreeType
            ? mapStringToEnum(program.degreeType, DegreeType)
            : DegreeType.UNDERGRADUATE,
          degreeAbbreviation: program.degreeAbbreviation || '',
          credits: program.credits || 0,
          descriptionIs: program.descriptionIs || '',
          descriptionEn: program.descriptionEn || '',
          durationInYears: program.durationInYears || 0,
          costPerYear: program.costPerYear,
          iscedCode: program.iscedCode || '',
          searchKeywords: [], //TODO missing in api
          externalUrlIs: program.externalUrlIs,
          externalUrlEn: program.externalUrlEn,
          admissionRequirementsIs: program.admissionRequirementsIs,
          admissionRequirementsEn: program.admissionRequirementsEn,
          studyRequirementsIs: program.studyRequirementsIs,
          studyRequirementsEn: program.studyRequirementsEn,
          costInformationIs: program.costInformationIs,
          costInformationEn: program.costInformationEn,
          tag:
            program.interestTags?.map((tag) => ({
              code: tag, //TODO change from enumstring to code (string) in api?
            })) || [],
          modeOfDelivery:
            program.modeOfDelivery?.map((m) =>
              mapStringToEnum(m, ModeOfDelivery),
            ) || [],
          extraApplicationField: program.extraApplicationFields?.map(
            (field) => ({
              nameIs: field.nameIs || '',
              nameEn: field.nameEn,
              descriptionIs: field.descriptionIs,
              descriptionEn: field.descriptionEn,
              required: field.required || false,
              fieldType: field.fieldType as unknown as FieldType,
              uploadAcceptedFileType: field.uploadAcceptedFileType,
            }),
          ),
        }
      }) || []
    )
  }

  async getCourses(externalId: string): Promise<ICourse[]> {
    const res = await this.hvinApi.hvinActivePrograms({ version: '1' })

    const program = res.find((p) => p.externalId === externalId)

    if (!program) {
      throw new Error('Did not find program for courses by program external id')
    }

    return (
      program.courses?.map((course) => ({
        externalId: course.externalId || '',
        nameIs: course.nameIs || '',
        nameEn: course.nameEn || '',
        credits: course.credits || 0,
        semesterYear: course.semesterYear,
        semesterSeason: course.semesterSeason
          ? mapStringToEnum(course.semesterSeason, Season)
          : Season.FALL,
        descriptionIs: course.descriptionIs,
        descriptionEn: course.descriptionEn,
        externalUrlIs: course.externalUrlIs,
        externalUrlEn: course.externalUrlEn,
        requirement: course.required
          ? Requirement.MANDATORY
          : Requirement.FREE_ELECTIVE, //TODO missing in api
      })) || []
    )
  }
}
