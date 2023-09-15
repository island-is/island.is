import { Injectable } from '@nestjs/common'
import {
  ProgramApi,
  UniversityApi,
} from '@island.is/clients/university-gateway-api'
import { GetProgramByIdInput, ProgramsPaginated } from './graphql/dto'
import { ProgramDetails, ProgramFilter, University } from './graphql/models'
import {
  DegreeType,
  ModeOfDelivery,
  Season,
} from '@island.is/university-gateway-lib'

export
@Injectable()
class UniversityGatewayApi {
  constructor(
    private readonly programApi: ProgramApi,
    private readonly universityApi: UniversityApi,
  ) {}

  async getActivePrograms(): Promise<ProgramsPaginated> {
    const res = await this.programApi.programControllerGetPrograms({
      active: true,
    })

    return {
      totalCount: res.totalCount,
      pageInfo: res.pageInfo,
      data: res.data.map((item) => ({
        id: item.id,
        externalId: item.externalId,
        active: item.active,
        nameIs: item.nameIs,
        nameEn: item.nameEn,
        universityId: item.universityId,
        universityContentfulKey: item.universityDetails.contentfulKey,
        departmentNameIs: item.departmentNameIs,
        departmentNameEn: item.departmentNameEn,
        startingSemesterYear: item.startingSemesterYear,
        startingSemesterSeason: item.startingSemesterSeason.toString(),
        applicationStartDate: item.applicationStartDate,
        applicationEndDate: item.applicationEndDate,
        degreeType: item.degreeType.toString(),
        degreeAbbreviation: item.degreeAbbreviation,
        credits: item.credits,
        descriptionIs: item.descriptionIs,
        descriptionEn: item.descriptionEn,
        durationInYears: item.durationInYears,
        costPerYear: item.costPerYear,
        iscedCode: item.iscedCode,
        searchKeywords: item.searchKeywords,
        tag: item.tag.map((t) => ({
          id: t.tagId,
          code: t.details.code,
          nameIs: t.details.nameIs,
          nameEn: t.details.nameEn,
        })),
        modeOfDelivery: item.modeOfDelivery.map((m) =>
          m.modeOfDelivery.toString(),
        ),
      })),
    }
  }

  async getProgramById(input: GetProgramByIdInput): Promise<ProgramDetails> {
    const res = await this.programApi.programControllerGetProgramDetails({
      id: input.id,
    })

    const item = res.data

    return {
      id: item.id,
      externalId: item.externalId,
      active: item.active,
      nameIs: item.nameIs,
      nameEn: item.nameEn,
      universityId: item.universityId,
      universityContentfulKey: item.universityDetails.contentfulKey,
      departmentNameIs: item.departmentNameIs,
      departmentNameEn: item.departmentNameEn,
      startingSemesterYear: item.startingSemesterYear,
      startingSemesterSeason: item.startingSemesterSeason.toString(),
      applicationStartDate: item.applicationStartDate,
      applicationEndDate: item.applicationEndDate,
      degreeType: item.degreeType.toString(),
      degreeAbbreviation: item.degreeAbbreviation,
      credits: item.credits,
      descriptionIs: item.descriptionIs,
      descriptionEn: item.descriptionEn,
      durationInYears: item.durationInYears,
      costPerYear: item.costPerYear,
      iscedCode: item.iscedCode,
      searchKeywords: item.searchKeywords,
      tag: item.tag.map((t) => ({
        id: t.tagId,
        code: t.details.code,
        nameIs: t.details.nameIs,
        nameEn: t.details.nameEn,
      })),
      modeOfDelivery: item.modeOfDelivery.map((m) =>
        m.modeOfDelivery.toString(),
      ),
      externalUrlIs: item.externalUrlIs,
      externalUrlEn: item.externalUrlEn,
      admissionRequirementsIs: item.admissionRequirementsIs,
      admissionRequirementsEn: item.admissionRequirementsEn,
      studyRequirementsIs: item.studyRequirementsIs,
      studyRequirementsEn: item.studyRequirementsEn,
      costInformationIs: item.costInformationIs,
      costInformationEn: item.costInformationEn,
      courses: item.courses.map((c) => ({
        id: c.details.id,
        externalId: c.details.externalId,
        nameIs: c.details.nameIs,
        nameEn: c.details.nameEn,
        credits: c.details.credits,
        semesterYear: c.details.semesterYear,
        semesterSeason: c.details.semesterSeason.toString(),
        descriptionIs: c.details.descriptionIs,
        descriptionEn: c.details.descriptionEn,
        externalUrlIs: c.details.externalUrlIs,
        externalUrlEn: c.details.externalUrlEn,
        requirement: c.requirement.toString(),
      })),
      // extraApplicationField: item.extraApplicationField.map((e) => ({
      //   nameIs: e.nameIs,
      //   nameEn: e.nameEn,
      //   descriptionIs: e.descriptionIs,
      //   descriptionEn: e.descriptionEn,
      //   required: e.required,
      //   fieldType: e.fieldType.toString(),
      //   uploadAcceptedFileType: e.uploadAcceptedFileType,
      // })),
    }
  }

  async getUniversities(): Promise<University[]> {
    const res = await this.universityApi.universityControllerGetUniversities()

    return res.data.map((item) => ({
      id: item.id,
      nationalId: item.nationalId,
      contentfulKey: item.contentfulKey,
    }))
  }

  async getProgramFilters(): Promise<ProgramFilter[]> {
    return [
      {
        field: 'degreeType',
        options: Object.values(DegreeType),
      },
      {
        field: 'startingSemesterSeason',
        options: Object.values(Season),
      },
      {
        field: 'modeOfDelivery',
        options: Object.values(ModeOfDelivery),
      },
      {
        field: 'universityId',
        options: (
          await this.universityApi.universityControllerGetUniversities()
        ).data.map((item) => item.id),
      },
      {
        field: 'durationInYears',
        options: await this.programApi.programControllerGetDurationInYears(),
      },
    ]
  }
}
