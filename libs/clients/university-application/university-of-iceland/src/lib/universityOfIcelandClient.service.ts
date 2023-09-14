import { Injectable } from '@nestjs/common'
import { ExampleEndpointsForUniversitiesApi } from '../../gen/fetch/apis'
import {
  DegreeType,
  FieldType,
  ICourse,
  IProgram,
  ModeOfDelivery,
  Requirement,
  Season,
  mapEnum,
} from '@island.is/university-gateway-lib'
import {
  ExampleProgramDegreeTypeEnum,
  ExampleProgramModeOfDeliveryEnum,
  ExampleProgramStartingSemesterSeasonEnum,
} from '../../gen/fetch'

export
@Injectable()
class UniversityOfIcelandApplicationClient {
  constructor(
    private readonly exampleEndpointsForUniversitiesApi: ExampleEndpointsForUniversitiesApi,
  ) {}

  async getPrograms(): Promise<IProgram[]> {
    const res =
      await this.exampleEndpointsForUniversitiesApi.exampleControllerGetActivePrograms()

    return (
      res.data?.map((program) => {
        return {
          externalId: program.externalId,
          nameIs: program.nameIs,
          nameEn: program.nameEn,
          departmentNameIs: program.departmentNameIs,
          departmentNameEn: program.departmentNameEn,
          startingSemesterYear: program.startingSemesterYear,
          startingSemesterSeason: mapEnum(
            program.startingSemesterSeason,
            ExampleProgramStartingSemesterSeasonEnum,
            Season,
          ),
          applicationStartDate: program.applicationStartDate,
          applicationEndDate: program.applicationEndDate || new Date(), //TODO cannot be empty in api
          degreeType: mapEnum(
            program.degreeType,
            ExampleProgramDegreeTypeEnum,
            DegreeType,
          ),
          degreeAbbreviation: program.degreeAbbreviation,
          credits: program.credits || 0,
          descriptionIs: program.descriptionIs || '',
          descriptionEn: program.descriptionEn || '',
          durationInYears: program.durationInYears || 0,
          costPerYear: program.costPerYear,
          iscedCode: program.iscedCode || '', //TODO cannot be empty in api
          searchKeywords: [], //TODO missing in api
          externalUrlIs: program.externalUrlIs,
          externalUrlEn: program.externalUrlEn,
          admissionRequirementsIs: program.admissionRequirementsIs,
          admissionRequirementsEn: program.admissionRequirementsEn,
          studyRequirementsIs: program.studyRequirementsIs,
          studyRequirementsEn: program.studyRequirementsEn,
          costInformationIs: program.costInformationIs,
          costInformationEn: program.costInformationEn,
          tag: program.interestTags.map((tag) => ({
            code: tag.toString(), //TODO change from enum to code (string) in api
          })),
          modeOfDelivery: program.modeOfDelivery.map((m) =>
            mapEnum(m, ExampleProgramModeOfDeliveryEnum, ModeOfDelivery),
          ),
          extraApplicationField: program.extraApplicationFields.map(
            (field) => ({
              nameIs: field.nameIs,
              nameEn: field.nameEn,
              descriptionIs: field.descriptionIs,
              descriptionEn: field.descriptionEn,
              required: field.required === 'true', //TODO change to enum not boolean in api
              fieldType: field.fieldType as unknown as FieldType,
              uploadAcceptedFileType: field.uploadAcceptedFileType,
            }),
          ),
        }
      }) || []
    )
  }

  async getCourses(externalId: string): Promise<ICourse[]> {
    const res =
      await this.exampleEndpointsForUniversitiesApi.exampleControllerGetProgramsCourses(
        { externalId },
      )

    return (
      res.data?.map((course) => ({
        externalId: course.externalId,
        nameIs: course.nameIs,
        nameEn: course.nameEn,
        credits: course.credits,
        semesterYear: course.semesterYear,
        semesterSeason: course.semesterSeason as unknown as Season, //TODO map enum
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
