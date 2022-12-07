import { Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../../shared'
import { TemplateApiModuleActionProps } from '../../../../types'
import {
  getChargeItemCodes,
  OrderVehicleRegistrationCertificateAnswers,
} from '@island.is/application/templates/transport-authority/order-vehicle-registration-certificate'
import { VehiclePrintingClient } from '@island.is/clients/transport-authority/vehicle-printing'

@Injectable()
export class OrderVehicleRegistrationCertificateService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly vehiclePrintingClient: VehiclePrintingClient,
  ) {}

  async createCharge({ application, auth }: TemplateApiModuleActionProps) {
    try {
      const chargeItemCodes = getChargeItemCodes(
        application.answers as OrderVehicleRegistrationCertificateAnswers,
      )

      const result = this.sharedTemplateAPIService.createCharge(
        auth.authorization,
        application.id,
        chargeItemCodes,
      )
      return result
    } catch (exeption) {
      return { id: '', paymentUrl: '' }
    }
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

    const isPayment:
      | { fulfilled: boolean }
      | undefined = await this.sharedTemplateAPIService.getPaymentStatus(
      auth.authorization,
      application.id,
    )

    if (!isPayment?.fulfilled) {
      throw new Error(
        'Ekki er búið að staðfesta greiðslu, hinkraðu þar til greiðslan er staðfest.',
      )
    }

    const answers = application.answers as OrderVehicleRegistrationCertificateAnswers
    const permno = answers?.vehicle?.plate

    // Submit the application
    await this.vehiclePrintingClient.requestRegistrationCardPrint(auth, permno)
  }
}
