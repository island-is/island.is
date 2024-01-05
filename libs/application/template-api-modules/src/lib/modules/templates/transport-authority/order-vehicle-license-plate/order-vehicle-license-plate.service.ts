import { Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../../shared'
import { TemplateApiModuleActionProps } from '../../../../types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { ApplicationTypes } from '@island.is/application/types'
import { OrderVehicleLicensePlateAnswers } from '@island.is/application/templates/transport-authority/order-vehicle-license-plate'
import {
  PlateOrderValidation,
  SGS_DELIVERY_STATION_CODE,
  SGS_DELIVERY_STATION_TYPE,
  VehiclePlateOrderingClient,
} from '@island.is/clients/transport-authority/vehicle-plate-ordering'
import { VehicleCodetablesClient } from '@island.is/clients/transport-authority/vehicle-codetables'
import { VehicleSearchApi } from '@island.is/clients/vehicles'
import { YES, coreErrorMessages } from '@island.is/application/core'
import { Auth, AuthMiddleware } from '@island.is/auth-nest-tools'
import { TemplateApiError } from '@island.is/nest/problem'

@Injectable()
export class OrderVehicleLicensePlateService extends BaseTemplateApiService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly vehiclePlateOrderingClient: VehiclePlateOrderingClient,
    private readonly vehicleCodetablesClient: VehicleCodetablesClient,
    private readonly vehiclesApi: VehicleSearchApi,
  ) {
    super(ApplicationTypes.ORDER_VEHICLE_LICENSE_PLATE)
  }

  private vehiclesApiWithAuth(auth: Auth) {
    return this.vehiclesApi.withMiddleware(new AuthMiddleware(auth))
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

  async getCurrentVehiclesWithPlateOrderChecks({
    auth,
  }: TemplateApiModuleActionProps) {
    const result = await this.vehiclesApiWithAuth(auth).currentVehiclesGet({
      persidNo: auth.nationalId,
      showOwned: true,
      showCoowned: false,
      showOperated: false,
    })

    // Validate that user has at least 1 vehicle
    if (!result || !result.length) {
      throw new TemplateApiError(
        {
          title: coreErrorMessages.vehiclesEmptyListOwner,
          summary: coreErrorMessages.vehiclesEmptyListOwner,
        },
        400,
      )
    }

    return await Promise.all(
      result?.map(async (vehicle) => {
        let validation: PlateOrderValidation | undefined

        // Only validate if fewer than 5 items
        if (result.length <= 5) {
          // Get basic information about vehicle
          const vehicleInfo = await this.vehiclesApiWithAuth(
            auth,
          ).basicVehicleInformationGet({
            clientPersidno: auth.nationalId,
            permno: vehicle.permno || '',
            regno: undefined,
            vin: undefined,
          })

          // Get validation
          validation = await this.vehiclePlateOrderingClient.validatePlateOrder(
            auth,
            vehicle.permno || '',
            vehicleInfo?.platetypefront || '',
            vehicleInfo?.platetyperear || '',
          )
        }

        return {
          permno: vehicle.permno || undefined,
          make: vehicle.make || undefined,
          color: vehicle.color || undefined,
          role: vehicle.role || undefined,
          validationErrorMessages: validation?.hasError
            ? validation.errorMessages
            : null,
        }
      }),
    )
  }

  async getPlateTypeList() {
    return await this.vehicleCodetablesClient.getPlateTypes()
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
      frontType: answers?.plateSize?.frontPlateSize?.[0],
      rearType: answers?.plateSize?.rearPlateSize?.[0],
      deliveryStationType: deliveryStationType,
      deliveryStationCode: deliveryStationCode,
      expressOrder: includeRushFee,
    })
  }
}
