import { Injectable } from '@nestjs/common'
import {
  HvinApi,
  RekUniITAPICustomModelsHvinActiveProgram,
  RekUniITAPICustomModelsHvinApplicantGenderEnum,
  RekUniITAPICustomModelsHvinNewApplicationModeOfDeliveryEnum,
  RekUniITAPICustomModelsHvinNewApplicationStartingSemesterSeasonEnum,
  RekUniITAPICustomModelsHvinUpdateApplicationStatusNewStatusValueEnum,
} from '../../gen/fetch'
import {
  ApplicationStatus,
  DegreeType,
  FieldType,
  IApplication,
  IProgram,
  ModeOfDelivery,
  Season,
  mapStringToEnum,
  EnumError,
} from '@island.is/university-gateway'
import { logger } from '@island.is/logging'
import * as kennitala from 'kennitala'

@Injectable()
export class ReykjavikUniversityApplicationClient {
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
            'Season',
          ),
          applicationStartDate: program.applicationStartDate ?? null,
          applicationEndDate: program.applicationEndDate ?? null,
          schoolAnswerDate: undefined, //TODO missing in api
          studentAnswerDate: undefined, //TODO missing in api
          degreeType: mapStringToEnum(
            program.degreeType,
            DegreeType,
            'DegreeType',
          ),
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
          arrangementIs: undefined, //TODO missing in api
          arrangementEn: undefined, //TODO missing in api
          studyRequirementsIs: program.studyRequirementsIs,
          studyRequirementsEn: program.studyRequirementsEn,
          costInformationIs: program.costInformationIs,
          costInformationEn: program.costInformationEn,
          allowException: false, //TODO missing in api
          allowThirdLevelQualification: false, //TODO missing in api
          modeOfDelivery:
            program.modeOfDelivery?.map((m) => {
              return mapStringToEnum(m, ModeOfDelivery, 'ModeOfDelivery')
            }) || [],
          extraApplicationFields: program.extraApplicationFields?.map(
            (field) => ({
              externalKey: field.fieldKey || '',
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
          applicationPeriodOpen: this.mapApplicationPeriodOpen(program),
          applicationInUniversityGateway: false, //TODO missing in api
        })
      } catch (e) {
        if (e instanceof EnumError) {
          logger.warn(
            `EnumError when trying to map program with externalId ${program.externalId} for university (reykjavik-university), update skipped.`,
            e,
          )
        } else {
          logger.error(
            `Failed to map program with externalId ${program.externalId} for university (reykjavik-university), reason:`,
            e,
          )
        }
      }
    }

    return mappedRes
  }

  async getApplicationStatus(externalId: string): Promise<ApplicationStatus> {
    const application = await this.hvinApi.hvinGetApplicationById({
      id: Number(externalId),
      version: '1',
    })

    if (!application) {
      throw new Error(
        `Did not find application with the external id ${externalId}`,
      )
    }

    if (!application.status) {
      throw new Error(
        `Empty status for application with the external id ${externalId}`,
      )
    }

    return mapStringToEnum(
      application.status,
      ApplicationStatus,
      'ApplicationStatus',
    )
  }

  async createApplication(application: IApplication): Promise<string> {
    const externalId = await this.hvinApi.hvinCreateApplication({
      version: '1',
      application: {
        programId: application.programExternalId,
        modeOfDelivery: mapStringToEnum(
          application.modeOfDelivery,
          RekUniITAPICustomModelsHvinNewApplicationModeOfDeliveryEnum,
          'RekUniITAPICustomModelsHvinNewApplicationModeOfDeliveryEnum',
        ),
        startingSemesterYear: application.startingSemesterYear,
        startingSemesterSeason: mapStringToEnum(
          application.startingSemesterSeason,
          RekUniITAPICustomModelsHvinNewApplicationStartingSemesterSeasonEnum,
          'RekUniITAPICustomModelsHvinNewApplicationStartingSemesterSeasonEnum',
        ),
        applicantInfo: {
          kennitala: application.applicant.nationalId,
          dateOfBirth: kennitala.info(application.applicant.nationalId)
            .birthday,
          firstName: application.applicant.givenName,
          middleName: application.applicant.middleName,
          lastName: application.applicant.familyName,
          email: application.applicant.email,
          mobilePhone: application.applicant.phone,
          // TODO heyra í HR hvort þau vilji ekki genderCode eins og kemur úr Þjóðskrá
          gender: mapStringToEnum(
            application.applicant.genderCode,
            RekUniITAPICustomModelsHvinApplicantGenderEnum,
            'RekUniITAPICustomModelsHvinApplicantGenderEnum',
          ),
          nationalityCode: application.applicant.citizenshipCode,
          streetNameAndHouseNumber: application.applicant.streetAddress,
          postcode: application.applicant.postalCode,
          city: application.applicant.city,
          residenceState: application.applicant.municipalityCode,
          countryCode: application.applicant.countryCode,
          preferredLanguage: application.preferredLanguage,
          educations: application.educationList.map((x) => ({
            school: x.schoolName,
            degree: x.degree,
          })),
          jobs: application.workExperienceList,
        },
        // extraApplicationFields: application.extraFieldList, // TODO waiting for change in API
      },
    })

    return externalId.toString()
  }

  async updateApplicationStatus(externalId: string, status: ApplicationStatus) {
    const mappedStatus = mapStringToEnum(
      status.toString(),
      RekUniITAPICustomModelsHvinUpdateApplicationStatusNewStatusValueEnum,
      'RekUniITAPICustomModelsHvinUpdateApplicationStatusNewStatusValueEnum',
    )

    const res = await this.hvinApi.hvinUpdateApplicationById({
      id: Number(externalId),
      version: '1',
      update: {
        statusUpdate: { newStatusValue: mappedStatus },
      },
    })

    for (let i = 0; i < res.length; i++) {
      if (res[i].hasError) {
        throw new Error(
          `Error trying to update application with external id ${externalId}, reason: ${res[i].errorText}`,
        )
      }
    }
  }

  mapApplicationPeriodOpen(
    program: RekUniITAPICustomModelsHvinActiveProgram,
  ): boolean {
    if (!program.applicationStartDate || !program.applicationEndDate)
      return false
    return (
      new Date() > program.applicationStartDate &&
      new Date() < program.applicationEndDate
    )
  }
}
