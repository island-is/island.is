import { Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../../shared'
import { TemplateApiModuleActionProps } from '../../../../types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { ApplicationTypes } from '@island.is/application/types'
import {
  applicationCheck,
  OrderVehicleLicensePlateAnswers,
} from '@island.is/application/templates/transport-authority/order-vehicle-license-plate'
import {
  SGS_DELIVERY_STATION_CODE,
  SGS_DELIVERY_STATION_TYPE,
  VehiclePlateOrderingClient,
} from '@island.is/clients/transport-authority/vehicle-plate-ordering'
import { VehicleCodetablesClient } from '@island.is/clients/transport-authority/vehicle-codetables'
import { VehicleSearchApi } from '@island.is/clients/vehicles'
import { YES, coreErrorMessages } from '@island.is/application/core'
import { Auth, AuthMiddleware } from '@island.is/auth-nest-tools'
import { TemplateApiError } from '@island.is/nest/problem'
import { mapVehicle } from '../utils'

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
    // Get max 20 vehicles and total count of vehicles
    // Note: Should be enough to only get 20, because if totalRecords
    // is higher than 20, then we won't return any vehicles
    const result = await this.vehiclesApiWithAuth(
      auth,
    ).currentvehicleswithmileageandinspGet({
      showOwned: true,
      showCoowned: false,
      showOperated: false,
      page: 1,
      pageSize: 20,
    })
    const totalRecords = result.totalRecords || 0

    // Validate that user has at least 1 vehicle
    if (!totalRecords) {
      throw new TemplateApiError(
        {
          title: coreErrorMessages.vehiclesEmptyListOwner,
          summary: coreErrorMessages.vehiclesEmptyListOwner,
        },
        400,
      )
    }

    // Case: count > 20
    // Display search box, validate vehicle when permno is entered
    if (totalRecords > 20) {
      return {
        totalRecords: totalRecords,
        vehicles: [],
      }
    }

    const resultData = result.data || []

    const vehicles = await Promise.all(
      resultData.map(async (vehicle) => {
        // Case: 20 >= count > 5
        // Display dropdown, validate vehicle when selected in dropdown
        if (totalRecords > 5) {
          return mapVehicle(auth, vehicle, false, {
            vehiclePlateOrderingClient: this.vehiclePlateOrderingClient,
            vehiclesApi: this.vehiclesApi,
          })
        }

        // Case: count <= 5
        // Display radio buttons, validate all vehicles now
        return mapVehicle(auth, vehicle, true, {
          vehiclePlateOrderingClient: this.vehiclePlateOrderingClient,
          vehiclesApi: this.vehiclesApi,
        })
      }),
    )

    return {
      totalRecords: totalRecords,
      vehicles: vehicles,
    }
  }

  async getPlateTypeList() {
    return await this.vehicleCodetablesClient.getPlateTypes()
  }

  async validateApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps) {
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

    const result =
      await this.vehiclePlateOrderingClient.validateAllForPlateOrder(
        auth,
        answers?.pickVehicle?.plate,
        answers?.plateSize?.frontPlateSize?.[0],
        answers?.plateSize?.rearPlateSize?.[0],
        deliveryStationType,
        deliveryStationCode,
        includeRushFee,
      )

    // If we get any error messages, we will just throw an error with a default title
    // We will fetch these error messages again through graphql in the template, to be able
    // to translate the error message
    if (result.hasError && result.errorMessages?.length) {
      throw new TemplateApiError(
        {
          title: applicationCheck.validation.alertTitle,
          summary: applicationCheck.validation.alertTitle,
        },
        400,
      )
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

    const submitResult = await this.vehiclePlateOrderingClient.savePlateOrders(
      auth,
      {
        permno: answers?.pickVehicle?.plate,
        frontType: answers?.plateSize?.frontPlateSize?.[0],
        rearType: answers?.plateSize?.rearPlateSize?.[0],
        deliveryStationType: deliveryStationType,
        deliveryStationCode: deliveryStationCode,
        expressOrder: includeRushFee,
      },
    )

    if (
      submitResult.hasError &&
      submitResult.errorMessages &&
      submitResult.errorMessages.length > 0
    ) {
      throw new TemplateApiError(
        {
          title: applicationCheck.validation.alertTitle,
          summary: submitResult.errorMessages,
        },
        400,
      )
    }
  }
}
