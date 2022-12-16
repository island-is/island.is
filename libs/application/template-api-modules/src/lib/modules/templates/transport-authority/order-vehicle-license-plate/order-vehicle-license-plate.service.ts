import { Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../../shared'
import { TemplateApiModuleActionProps } from '../../../../types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { ApplicationTypes } from '@island.is/application/types'
import { Auth, AuthMiddleware } from '@island.is/auth-nest-tools'
import {
  OrderVehicleLicensePlateAnswers,
  getChargeItemCodes,
} from '@island.is/application/templates/transport-authority/order-vehicle-license-plate'
import { VehiclePlateOrderingClient } from '@island.is/clients/transport-authority/vehicle-plate-ordering'
import { VehicleSearchApi } from '@island.is/clients/vehicles'
import { TemplateApiError } from '@island.is/nest/problem'
import { externalData } from '@island.is/application/templates/transport-authority/order-vehicle-license-plate'

@Injectable()
export class OrderVehicleLicensePlateService extends BaseTemplateApiService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly vehiclePlateOrderingClient: VehiclePlateOrderingClient,
    private readonly vehiclesApi: VehicleSearchApi,
  ) {
    super(ApplicationTypes.ORDER_VEHICLE_LICENSE_PLATE)
  }

  private vehiclesApiWithAuth(auth: Auth) {
    return this.vehiclesApi.withMiddleware(new AuthMiddleware(auth))
  }

  async getCurrentVehicleList({ auth }: TemplateApiModuleActionProps) {
    const result = await this.vehiclesApiWithAuth(auth).currentVehiclesGet({
      persidNo: auth.nationalId,
      showOwned: true,
      showCoowned: false,
      showOperated: false,
    })

    // // Validate that user has at least 1 vehicle he can transfer
    if (!result || !result.length) {
      throw new TemplateApiError(
        {
          title: externalData.currentVehicles.empty,
          summary: '',
        },
        400,
      )
    }

    return result?.map((vehicle) => ({
      permno: vehicle.permno,
      make: vehicle.make,
      color: vehicle.color,
      role: vehicle.role,
      isStolen: vehicle.stolen,
    }))
  }

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

    await this.vehiclePlateOrderingClient.orderPlates(auth, {
      permno: answers?.vehicle?.plate,
      frontType: answers?.frontType,
      rearType: answers?.rearType,
      deliveryStationType: answers?.deliveryStationType,
      deliveryStationCode: answers?.deliveryStationCode,
      expressOrder: answers.includeRushFee,
    })
  }
}
