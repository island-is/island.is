import { Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../../shared'
import { TemplateApiModuleActionProps } from '../../../../types'
import { OrderVehicleLicensePlateApi } from '@island.is/api/domains/transport-authority/order-vehicle-license-plate'

import {
  OrderVehicleLicensePlateAnswers,
  getChargeItemCodes,
} from '@island.is/application/templates/transport-authority/order-vehicle-license-plate'

@Injectable()
export class OrderVehicleLicensePlateService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly orderVehicleLicensePlateApi: OrderVehicleLicensePlateApi,
  ) {}

  async createCharge({ application, auth }: TemplateApiModuleActionProps) {
    try {
      const chargeItemCodes = getChargeItemCodes(
        application.answers as OrderVehicleLicensePlateAnswers,
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

    const answers = application.answers as OrderVehicleLicensePlateAnswers

    await this.orderVehicleLicensePlateApi.orderPlates(auth, {
      permno: answers?.vehicle?.plate,
      frontType: answers?.frontType,
      rearType: answers?.rearType,
      deliveryStationType: answers?.deliveryStationType,
      deliveryStationCode: answers?.deliveryStationCode,
      expressOrder: answers.includeRushFee,
    })
  }
}
