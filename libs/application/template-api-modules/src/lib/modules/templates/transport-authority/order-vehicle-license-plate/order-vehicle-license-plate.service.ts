import { Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../../shared'
import { TemplateApiModuleActionProps } from '../../../../types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { ApplicationTypes } from '@island.is/application/types'
import {
  OrderVehicleLicensePlateAnswers,
  getChargeItemCodes,
} from '@island.is/application/templates/transport-authority/order-vehicle-license-plate'
import {
  SGS_DELIVERY_STATION_CODE,
  SGS_DELIVERY_STATION_TYPE,
  VehiclePlateOrderingClient,
} from '@island.is/clients/transport-authority/vehicle-plate-ordering'
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
        // Filtering out the option "Pick up at Samgöngustofa"
        .filter(
          (x) =>
            x.type !== SGS_DELIVERY_STATION_TYPE &&
            x.code !== SGS_DELIVERY_STATION_CODE,
        )
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
      const SAMGONGUSTOFA_NATIONAL_ID = '5405131040'

      const answers = application.answers as OrderVehicleLicensePlateAnswers

      const chargeItemCodes = getChargeItemCodes(answers)

      const result = this.sharedTemplateAPIService.createCharge(
        auth,
        application.id,
        SAMGONGUSTOFA_NATIONAL_ID,
        chargeItemCodes,
        [{ name: 'vehicle', value: answers?.pickVehicle?.plate }],
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
      // Otherwise we will default to option "Pick up at Samgöngustofa"
      deliveryStationType = SGS_DELIVERY_STATION_TYPE
      deliveryStationCode = SGS_DELIVERY_STATION_CODE
    }

    await this.vehiclePlateOrderingClient.savePlateOrders(auth, {
      permno: answers?.pickVehicle?.plate,
      frontType: answers?.plateSize?.frontPlateSize,
      rearType: answers?.plateSize?.rearPlateSize,
      deliveryStationType: deliveryStationType,
      deliveryStationCode: deliveryStationCode,
      expressOrder: includeRushFee,
    })
  }
}
