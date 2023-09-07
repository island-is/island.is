import { Injectable } from '@nestjs/common'
import { ExampleEndpointsForUniversitiesApi } from '../../gen/fetch/apis'
import {
  Course,
  DegreeType,
  FieldType,
  ModeOfDelivery,
  Program,
  Season,
} from '@island.is/university-gateway-types'

@Injectable()
export class UniversityGatewayUniversityOfIcelandClient {
  constructor(
    private readonly exampleEndpointsForUniversitiesApi: ExampleEndpointsForUniversitiesApi,
  ) {}

  async getPrograms(): Promise<Program[]> {
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
          startingSemesterSeason:
            program.startingSemesterSeason as unknown as Season, //TODO
          applicationStartDate: program.applicationStartDate,
          applicationEndDate: program.applicationEndDate || new Date(), //TODO
          degreeType: program.degreeType as unknown as DegreeType, //TODO
          degreeAbbreviation: program.degreeAbbreviation,
          credits: program.credits || 0,
          descriptionIs: '', //program.descriptionIs || '', //TODO
          descriptionEn: '', //program.descriptionEn || '', //TODO
          durationInYears: program.durationInYears || 0,
          costPerYear: program.costPerYear,
          iscedCode: program.iscedCode || '', //TODO
          searchKeywords: [], //TODO
          externalUrlIs: program.externalUrlIs,
          externalUrlEn: program.externalUrlEn,
          admissionRequirementsIs: '', //program.admissionRequirementsIs,//TODO
          admissionRequirementsEn: '', //program.admissionRequirementsEn,//TODO
          studyRequirementsIs: '', //program.studyRequirementsIs,//TODO
          studyRequirementsEn: '', //program.studyRequirementsEn,//TODO
          costInformationIs: program.costInformationIs,
          costInformationEn: program.costInformationEn,
          tag: program.interestTags.map((tag) => ({
            code: tag.toString(), //TODO
          })),
          modeOfDelivery: program.modeOfDelivery.map(
            (mode) => mode as unknown as ModeOfDelivery, //TODO
          ),
          extraApplicationField: program.extraApplicationFields.map(
            (field) => ({
              nameIs: field.nameIs,
              nameEn: field.nameEn,
              descriptionIs: field.descriptionIs,
              descriptionEn: field.descriptionEn,
              required: field.required === 'true', //TODO
              fieldType: field.fieldType as unknown as FieldType,
              uploadAcceptedFileType: field.uploadAcceptedFileType,
            }),
          ),
        }
      }) || []
    )
  }

  async getCourses(externalId: string): Promise<Course[]> {
    const res =
      await this.exampleEndpointsForUniversitiesApi.exampleControllerGetProgramsCourses(
        { externalId },
      )

    return (
      res.data?.map((course) => ({
        externalId: course.externalId,
        nameIs: course.nameIs,
        nameEn: course.nameEn,
        required: course.required,
        credits: course.credits,
        semesterYear: course.semesterYear,
        semesterSeason: course.semesterSeason as unknown as Season, //TODO
        descriptionIs: course.descriptionIs,
        descriptionEn: course.descriptionEn,
        externalUrlIs: course.externalUrlIs,
        externalUrlEn: course.externalUrlEn,
      })) || []
    )
  }
}
