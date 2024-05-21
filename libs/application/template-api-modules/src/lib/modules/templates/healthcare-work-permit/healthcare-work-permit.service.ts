import { Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'
import { BaseTemplateApiService } from '../../base-template-api.service'
import {
  ApplicationTypes,
  NationalRegistryIndividual,
} from '@island.is/application/types'
import {
  HealthcareWorkPermitAnswers,
  error as errorMsg,
} from '@island.is/application/templates/healthcare-work-permit'
import {
  HealthDirectorateClientService,
  StarfsleyfiUmsoknStarfsleyfi,
  UtbuaStarfsleyfiSkjalResponse,
} from '@island.is/clients/health-directorate'
import { TemplateApiError } from '@island.is/nest/problem'
import {
  UniversityCareersClientService,
  UniversityId,
} from '@island.is/clients/university-careers'
import {
  EinstaklingurDTOAllt,
  NationalRegistryV3ClientService,
} from '@island.is/clients/national-registry-v3'

@Injectable()
export class HealthcareWorkPermitService extends BaseTemplateApiService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly healthDirectorateClientService: HealthDirectorateClientService,
    // private readonly universityCareersClientService: UniversityCareersClientService,
    private readonly nationalRegistryService: NationalRegistryV3ClientService,
  ) {
    super(ApplicationTypes.HEALTHCARE_WORK_PERMIT)
  }

  async getNationalRegistryWithEESValidation({
    auth,
  }: TemplateApiModuleActionProps): Promise<EinstaklingurDTOAllt> {
    const result = await this.nationalRegistryService.getAllDataIndividual(
      auth.nationalId,
    )

    // TODO Double check if this fails on empty response
    if (!result) {
      throw new TemplateApiError(
        {
          title: errorMsg.healthcareLicenseErrorTitle,
          summary: errorMsg.healthcareLicenseErrorMessage,
        },
        400,
      )
    }

    return result
  }

  async getMyHealthcareLicenses({
    auth,
  }: TemplateApiModuleActionProps): Promise<StarfsleyfiUmsoknStarfsleyfi[]> {
    const result =
      await this.healthDirectorateClientService.getHealthCareLicensesForWorkPermit(
        auth,
      )

    // TODO Double check if this fails on empty response
    if (!result) {
      throw new TemplateApiError(
        {
          title: errorMsg.healthcareLicenseErrorTitle,
          summary: errorMsg.healthcareLicenseErrorMessage,
        },
        400,
      )
    }

    return result
  }

  async getEducationInfo({
    auth,
  }: TemplateApiModuleActionProps): Promise<StarfsleyfiUmsoknStarfsleyfi[]> {
    const result =
      await this.healthDirectorateClientService.getHealthCareWorkPermitEducationInfo(
        auth,
      )

    if (!result) {
      throw new TemplateApiError(
        {
          title: errorMsg.healthcareLicenseErrorTitle,
          summary: errorMsg.noResponseEducationInfoMessage,
        },
        400,
      )
    }

    return result
  }

  async getMyAcademicCareer({
    auth,
  }: TemplateApiModuleActionProps): Promise<[]> {
    // const result =
    //   await this.universityCareersClientService.getStudentTrackHistory(
    //     auth,
    //     UniversityId.UNIVERSITY_OF_ICELAND,
    //   )

    // if (!result) {
    //   throw new TemplateApiError(
    //     {
    //       title: errorMsg.emptyCareerResponseTitle,
    //       summary: errorMsg.emptyCareerResponseMessage,
    //     },
    //     400,
    //   )
    // }

    return []
  }

  async submitApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<UtbuaStarfsleyfiSkjalResponse> {
    // TODO Change to custom type with base64 + .. ?

    const { paymentUrl } = application.externalData.createCharge.data as {
      paymentUrl: string
    }
    if (!paymentUrl) {
      throw new Error(
        'Ekki er búið að staðfesta greiðslu, hinkraðu þar til greiðslan er staðfest.',
      )
    }

    const isPayment: { fulfilled: boolean } | undefined =
      await this.sharedTemplateAPIService.getPaymentStatus(auth, application.id)

    if (!isPayment?.fulfilled) {
      throw new Error(
        'Ekki er búið að staðfesta greiðslu, hinkraðu þar til greiðslan er staðfest.',
      )
    }

    const answers = application.answers as HealthcareWorkPermitAnswers

    const nationalRegistryData = application.externalData.nationalRegistry
      ?.data as NationalRegistryIndividual

    return await this.healthDirectorateClientService.submitApplicationHealthcareWorkPermit(
      auth,
      {
        name: nationalRegistryData.fullName,
        dateOfBirth: nationalRegistryData.birthDate,
        email: answers.userInformation?.email,
        phone: answers.userInformation?.phone, // TODO Is phone in correct format ?
        idProfession: answers.selectWorkPermit.studyProgram, // TODO Where can I get idProfession from
        citizenship: nationalRegistryData.citizenship?.code || '',
        education: [], // TODO
      },
    )
  }
}
