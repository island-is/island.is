import { Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'
import { BaseTemplateApiService } from '../../base-template-api.service'
import {
  ApplicationTypes,
  NationalRegistryIndividual,
} from '@island.is/application/types'
import { HealthcareLicenseCertificateAnswers } from '@island.is/application/templates/healthcare-license-certificate'
import {
  HealthDirectorateClientService,
  HealthcareLicense,
  InnsigladSkjal,
} from '@island.is/clients/health-directorate'

@Injectable()
export class HealthcareLicenseCertificateService extends BaseTemplateApiService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly healthDirectorateClientService: HealthDirectorateClientService,
  ) {
    super(ApplicationTypes.HEALTHCARE_LICENSE_CERTIFICATE)
  }

  async getMyHealthcareLicenses({
    auth,
  }: TemplateApiModuleActionProps): Promise<HealthcareLicense[]> {
    //TODOx kasta villu ef tómt
    return this.healthDirectorateClientService.getMyHealthcareLicenses(auth)
  }

  async submitApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<InnsigladSkjal[]> {
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

    const answers = application.answers as HealthcareLicenseCertificateAnswers

    const nationalRegistryData = application.externalData.nationalRegistry
      ?.data as NationalRegistryIndividual

    // Submit the application
    return await this.healthDirectorateClientService.submitApplicationHealthcareLicenseCertificate(
      auth,
      {
        fullName: nationalRegistryData.fullName,
        dateOfBirth: nationalRegistryData.birthDate,
        email: answers.userInformation?.email,
        phone: answers.userInformation?.phone,
        professionIdList: answers.selectLicence.professionIds,
      },
    )
  }
}
