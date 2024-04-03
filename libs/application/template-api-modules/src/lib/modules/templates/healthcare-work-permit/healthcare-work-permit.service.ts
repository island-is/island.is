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
import {
  Transcripts,
  UniversityOfIcelandService,
} from '@island.is/clients/university-of-iceland'
import { TemplateApiError } from '@island.is/nest/problem'

@Injectable()
export class HealthcareWorkPermitService extends BaseTemplateApiService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly healthDirectorateClientService: HealthDirectorateClientService,
    private readonly universityOfIcelandService: UniversityOfIcelandService,
  ) {
    super(ApplicationTypes.HEALTHCARE_WORK_PERMIT)
  }

  async getMyHealthcareLicenses({
    auth,
  }: TemplateApiModuleActionProps): Promise<StarfsleyfiUmsoknStarfsleyfi[]> {
    const result =
      await this.healthDirectorateClientService.getHealthCareLicensesForWorkPermit(
        auth,
      )

    // TODO Error if the service does not respond/is down ?

    return result
  }

  async getEducationInfo({
    auth,
  }: TemplateApiModuleActionProps): Promise<StarfsleyfiUmsoknStarfsleyfi[]> {
    const result =
      await this.healthDirectorateClientService.getHealthCareWorkPermitEducationInfo(
        auth,
      )

    // TODO Error if the service does not respond/is down ?

    return result
  }

  async getMyAcademicCareer({
    auth,
  }: TemplateApiModuleActionProps): Promise<Transcripts> {
    const result = await this.universityOfIcelandService.studentInfo(auth)

    if (!result) {
      throw new TemplateApiError(
        {
          title: errorMsg.emptyCareerResponseTitle,
          summary: errorMsg.emptyCareerResponseMessage,
        },
        400,
      )
    }

    return result
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
