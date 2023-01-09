import { Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../../shared'
import { TemplateApiModuleActionProps } from '../../../../types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { ApplicationTypes } from '@island.is/application/types'
import {
  OrderVehicleLicensePlateAnswers,
  getChargeItemCodes,
} from '@island.is/application/templates/transport-authority/order-vehicle-license-plate'
import { VehiclePlateOrderingClient } from '@island.is/clients/transport-authority/vehicle-plate-ordering'
import { VehicleCodetablesClient } from '@island.is/clients/transport-authority/vehicle-codetables'
import { YES } from '@island.is/application/core'

@Injectable()
export class OrderVehicleLicensePlateService extends BaseTemplateApiService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly vehiclePlateOrderingClient: VehiclePlateOrderingClient,
    private readonly vehicleCodetablesClient: VehicleCodetablesClient,
  ) {
    super(ApplicationTypes.ORDER_VEHICLE_LICENSE_PLATE)
  }

  async getDeliveryStationList({ auth }: TemplateApiModuleActionProps) {
    const result = await this.vehiclePlateOrderingClient.getDeliveryStations(
      auth,
    )

    return (
      result
        // Filtering out type=R and code=1 (that is the option "Pick up at Samgöngustofa")
        .filter((x) => x.type !== 'R' && x.code !== '1')
        .map((item) => ({
          name: item.name,
          // Since the result is only unique per type+code, we will just merge them together here
          value: item.type + '_' + item.code,
        }))
    )
  }

  async getPlateTypeList() {
    return await this.vehicleCodetablesClient.getPlateTypes()
  }

  async createCharge({ application, auth }: TemplateApiModuleActionProps) {
    try {
      const chargeItemCodes = getChargeItemCodes(
        application.answers as OrderVehicleLicensePlateAnswers,
      )

      const SAMGONGUSTOFA_NATIONAL_ID = '5405131040'

      const result = this.sharedTemplateAPIService.createCharge(
        auth,
        application.id,
        SAMGONGUSTOFA_NATIONAL_ID,
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
      auth,
      application.id,
    )

    if (!isPayment?.fulfilled) {
      throw new Error(
        'Ekki er búið að staðfesta greiðslu, hinkraðu þar til greiðslan er staðfest.',
      )
    }

    const answers = application.answers as OrderVehicleLicensePlateAnswers

    const includeRushFee =
      answers?.plateDelivery?.includeRushFee?.includes(YES) || false

    // Check if used selected delivery method: Pick up at delivery station
    const deliveryStationTypeCode =
      answers?.plateDelivery?.deliveryStationTypeCode
    let deliveryStationType: string
    let deliveryStationCode: string
    if (
      answers.plateDelivery?.deliveryMethodIsDeliveryStation === YES &&
      deliveryStationTypeCode
    ) {
      // Split up code+type (was merged when we fetched that data)
      deliveryStationType = deliveryStationTypeCode.split('_')[0]
      deliveryStationCode = deliveryStationTypeCode.split('_')[1]
    } else {
      // Otherwise we will default to "Pick up at Samgöngustofa" which is type=R and code=1
      deliveryStationType = 'R'
      deliveryStationCode = '1'
    }

    await this.vehiclePlateOrderingClient.orderPlates(auth, {
      permno: answers?.pickVehicle?.plate,
      frontType: answers?.plateSize?.frontPlateSize,
      rearType: answers?.plateSize?.rearPlateSize,
      deliveryStationType: deliveryStationType,
      deliveryStationCode: deliveryStationCode,
      expressOrder: includeRushFee,
    })
  }
}
