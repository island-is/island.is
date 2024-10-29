import { Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'
import { BaseTemplateApiService } from '../../base-template-api.service'
import {
  ApplicationTypes,
  ApplicationWithAttachments,
  NationalRegistryIndividual,
} from '@island.is/application/types'

import { NationalRegistryClientService } from '@island.is/clients/national-registry-v2'
import {
  mapStringToEnum,
  ApplicationTypes as UniversityApplicationTypes,
} from '@island.is/university-gateway'
import {
  ProgramApi,
  UniversityApi,
  ApplicationApi,
  CreateApplicationDtoModeOfDeliveryEnum,
  CreateApplicationEducationDto,
  UniversityApplicationControllerCreateApplicationRequest,
  CreateApplicationDtoEducationOptionEnum,
  CreateApplicationExtraFieldsDto,
  ProgramExtraApplicationFieldFieldTypeEnum,
  CreateApplicationExtraFieldsDtoFieldTypeEnum,
} from '@island.is/clients/university-gateway-api'

import {
  UniversityAnswers,
  UniversityGatewayProgram,
} from '@island.is/application/templates/university'
import { Auth, AuthMiddleware } from '@island.is/auth-nest-tools'
import { InnaClientService } from '@island.is/clients/inna'

@Injectable()
export class UniversityService extends BaseTemplateApiService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly nationalRegistryApi: NationalRegistryClientService,
    private readonly programApi: ProgramApi,
    private readonly universityApi: UniversityApi,
    private readonly universityApplicationApi: ApplicationApi,
    private readonly innaService: InnaClientService,
  ) {
    super(ApplicationTypes.UNIVERSITY)
  }

  private universityApplicationApiWithAuth(auth: Auth) {
    return this.universityApplicationApi.withMiddleware(
      new AuthMiddleware(auth),
    )
  }

  async getUniversities({ application, auth }: TemplateApiModuleActionProps) {
    const res = await this.universityApi.universityControllerGetUniversities()
    return res.data
  }

  async getPrograms({ application, auth }: TemplateApiModuleActionProps) {
    const res = await this.programApi.programControllerGetApplicationPrograms({
      active: true,
    })

    return res.data.map((item) => ({
      active: item.active,
      id: item.id,
      externalId: item.externalId,
      nameIs: item.nameIs,
      nameEn: item.nameEn,
      specializationExternalId: item.specializationExternalId,
      specializationNameIs: item.specializationNameIs,
      specializationNameEn: item.specializationNameEn,
      universityId: item.universityId,
      universityContentfulKey: item.universityDetails.contentfulKey,
      applicationStartDate: item.applicationStartDate,
      applicationEndDate: item.applicationEndDate,
      schoolAnswerDate: item.schoolAnswerDate,
      studentAnswerDate: item.studentAnswerDate,
      degreeType: item.degreeType.toString(),
      degreeAbbreviation: item.degreeAbbreviation,
      credits: item.credits,
      modeOfDelivery: item.modeOfDelivery,
      allowException: item.allowException,
      allowThirdLevelQualification: item.allowThirdLevelQualification,
      extraApplicationFields: item.extraApplicationFields,
      applicationInUniversityGateway: item.applicationInUniversityGateway,
      applicationPeriodOpen: item.applicationPeriodOpen,
    }))
  }

  async addSchoolAcceptance({
    application,
    auth,
  }: TemplateApiModuleActionProps) {
    return
  }

  async validateApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps) {
    return
  }

  async submitApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<void> {
    const answers = application.answers as UniversityAnswers
    const userFromAnswers = answers.userInformation
    const externalData = application.externalData
    const nationalRegistryUser = externalData.nationalRegistry
      .data as NationalRegistryIndividual

    const user = {
      givenName: nationalRegistryUser.givenName || '',
      middleName: '',
      familyName: nationalRegistryUser.familyName || '',
      genderCode: nationalRegistryUser.genderCode,
      citizenshipCode: nationalRegistryUser.citizenship?.code || '',
      streetAddress: nationalRegistryUser.address?.streetAddress || '',
      postalCode: nationalRegistryUser.address?.postalCode || '',
      city: nationalRegistryUser.address?.city || '', // TODO what to use then?
      municipalityCode: nationalRegistryUser.address?.municipalityCode || '',
      countryCode: '', // TODO get this from residenceHistory in dataProvider
      email: userFromAnswers.email,
      phone: userFromAnswers.phone,
    }

    const programs = externalData.programs
      ?.data as Array<UniversityGatewayProgram>
    const chosenProgram = programs.find(
      (x) => x.id === answers.programInformation.program,
    )

    const defaultModeOfDelivery = chosenProgram?.modeOfDelivery[0]
      .modeOfDelivery as CreateApplicationDtoModeOfDeliveryEnum

    // Education list:

    //all possible types of education data from the application answers
    const educationOptionChosen =
      answers.educationOptions || UniversityApplicationTypes.DIPLOMA

    const combinedEducationList: Array<CreateApplicationEducationDto> = []

    // A: ekki námsgögn í Innu, eldra próf eða annað + Námsgögn í Innu + Bæta við námsferli gögn
    const finishedData =
      answers.educationDetails.finishedDetails?.filter(
        (x) => x && x.wasRemoved !== 'true',
      ) || []
    for (let i = 0; i < finishedData.length; i++) {
      const item = finishedData[i]
      combinedEducationList.push({
        schoolName: item.school,
        degree: item.degreeLevel,
        degreeName: item.degreeMajor,
        degreeCountry: item.degreeCountry,
        finishedUnits: item.finishedUnits,
        degreeStartDate: item.beginningDate,
        degreeEndDate: item.endDate,
        moreDetails: item.moreDetails,
        degreeAttachments: await this.getAttachmentUrls(
          application,
          item.degreeAttachments?.map((x) => {
            return {
              name: x.name,
              key: x.key,
            }
          }),
        ),
      })
    }

    // B: Þú munt ljúka stúdentsprófi eftir að umsóknarfrestur rennur út
    if (educationOptionChosen === UniversityApplicationTypes.NOTFINISHED) {
      combinedEducationList.push({
        schoolName: answers.educationDetails.notFinishedDetails?.school,
        degree: answers.educationDetails.notFinishedDetails?.degreeLevel,
        moreDetails: answers.educationDetails.notFinishedDetails?.moreDetails,
      })
    }

    // C: Ef þú þarft undanþágu frá Stúdentsprófi
    if (educationOptionChosen === UniversityApplicationTypes.EXEMPTION) {
      combinedEducationList.push({
        degreeAttachments: await this.getAttachmentUrls(
          application,
          answers.educationDetails.exemptionDetails?.degreeAttachments?.map(
            (x) => {
              return {
                name: x.name,
                key: x.key,
              }
            },
          ),
        ),
        moreDetails: answers.educationDetails.exemptionDetails?.moreDetails,
      })
    }

    //D: Ef þú ert með annað próf á þriðja hæfnisþrepi
    if (educationOptionChosen === UniversityApplicationTypes.THIRDLEVEL) {
      combinedEducationList.push({
        schoolName: answers.educationDetails.thirdLevelDetails?.school,
        degree: answers.educationDetails.thirdLevelDetails?.degreeLevel,
        degreeName: answers.educationDetails.thirdLevelDetails?.degreeMajor,
        degreeCountry:
          answers.educationDetails.thirdLevelDetails?.degreeCountry,
        finishedUnits:
          answers.educationDetails.thirdLevelDetails?.finishedUnits,
        degreeStartDate:
          answers.educationDetails.thirdLevelDetails?.beginningDate,
        degreeEndDate: answers.educationDetails.thirdLevelDetails?.endDate,
        moreDetails: answers.educationDetails.thirdLevelDetails?.moreDetails,
        degreeAttachments: await this.getAttachmentUrls(
          application,
          answers.educationDetails.thirdLevelDetails?.degreeAttachments?.map(
            (x) => {
              return {
                name: x.name,
                key: x.key,
              }
            },
          ),
        ),
      })
    }

    // Extra field list:
    const otherDocuments = answers.otherDocuments || []
    const extraFieldList: Array<CreateApplicationExtraFieldsDto> = []
    for (let i = 0; i < otherDocuments.length; i++) {
      const fieldInfo = chosenProgram?.extraApplicationFields[i]
      if (!fieldInfo) continue

      if (
        fieldInfo.fieldType === ProgramExtraApplicationFieldFieldTypeEnum.UPLOAD
      ) {
        const attachments = await this.getAttachmentUrls(
          application,
          otherDocuments[i].attachments?.map((attachment) => {
            return {
              name: attachment.name,
              key: attachment.key,
            }
          }),
        )

        for (let j = 0; j < attachments.length; j++) {
          extraFieldList.push({
            fieldType: CreateApplicationExtraFieldsDtoFieldTypeEnum.UPLOAD,
            externalKey: fieldInfo.externalKey,
            value: attachments[j],
          })
        }
      }
      // TODO handle other field types when ready
    }

    const createApplicationDto: UniversityApplicationControllerCreateApplicationRequest =
      {
        createApplicationDto: {
          applicationId: application.id,
          universityId: answers.programInformation.university,
          programId: answers.programInformation.program,
          modeOfDelivery: mapStringToEnum(
            answers.modeOfDeliveryInformation?.chosenMode ||
              defaultModeOfDelivery,
            CreateApplicationDtoModeOfDeliveryEnum,
            'CreateApplicationDtoModeOfDeliveryEnum',
          ),
          applicant: user,
          educationOption: mapStringToEnum(
            educationOptionChosen,
            CreateApplicationDtoEducationOptionEnum,
            'CreateApplicationDtoEducationOptionEnum',
          ),
          educationList: combinedEducationList,
          workExperienceList: [],
          extraFieldList: extraFieldList,
        },
      }
    await this.universityApplicationApiWithAuth(
      auth,
    ).universityApplicationControllerCreateApplication(createApplicationDto)
  }

  private async getAttachmentUrls(
    application: ApplicationWithAttachments,
    attachments?: { name: string; key: string }[],
  ): Promise<{ fileName: string; fileUrl: string }[]> {
    const expiry = 36000

    return await Promise.all(
      attachments?.map(async (file) => {
        return {
          fileName: file.name,
          fileUrl: await this.sharedTemplateAPIService.getAttachmentUrl(
            application,
            file.key,
            expiry,
          ),
        }
      }) || [],
    )
  }
}
