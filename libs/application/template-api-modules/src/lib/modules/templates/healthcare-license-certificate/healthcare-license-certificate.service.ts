import { Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { ApplicationTypes } from '@island.is/application/types'
import { HealthcareLicenseCertificateAnswers } from '@island.is/application/templates/healthcare-license-certificate'
import { HealthDirectorateClientService } from '@island.is/clients/health-directorate'

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
  }: TemplateApiModuleActionProps): Promise<any[]> {
    return this.healthDirectorateClientService.getMyHealthcareLicenses(auth)
  }

  async submitApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<void> {
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

    // Submit the application
    await this.healthDirectorateClientService.submitApplicationHealthcareLicenseCertificate(
      auth,
    )
  }
}
