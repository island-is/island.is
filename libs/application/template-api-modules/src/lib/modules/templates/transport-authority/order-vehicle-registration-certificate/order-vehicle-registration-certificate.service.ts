import { Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../../shared'
import { TemplateApiModuleActionProps } from '../../../../types'
import { ChargeItemCode } from '@island.is/shared/constants'
import { OrderVehicleRegistrationCertificateApi } from '@island.is/api/domains/transport-authority/order-vehicle-registration-certificate'
import { OrderVehicleRegistrationCertificateAnswers } from '@island.is/application/templates/transport-authority/order-vehicle-registration-certificate'

@Injectable()
export class OrderVehicleLicensePlateService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly orderVehicleRegistrationCertificateApi: OrderVehicleRegistrationCertificateApi,
  ) {}

  async createCharge({ application, auth }: TemplateApiModuleActionProps) {
    try {
      const answers = application.answers as OrderVehicleRegistrationCertificateAnswers

      const chargeItemCode = answers.includeRushFee
        ? ChargeItemCode.TRANSPORT_AUTHORITY_ORDER_VEHICLE_REGISTRATION_CERTIFICATE
        : ChargeItemCode.TRANSPORT_AUTHORITY_ORDER_VEHICLE_REGISTRATION_CERTIFICATE_WITH_RUSH_FEE

      const result = this.sharedTemplateAPIService.createCharge(
        auth.authorization,
        application.id,
        chargeItemCode,
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

    this.orderVehicleRegistrationCertificateApi.RequestRegistrationCardPrint(
      auth,
      answers?.vehicle?.plate,
    )
  }
}
