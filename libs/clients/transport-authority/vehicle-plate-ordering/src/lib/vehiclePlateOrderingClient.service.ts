import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import { PlateOrderingApi } from '../../gen/fetch/apis'
import {
  DeliveryStation,
  SGS_DELIVERY_STATION_CODE,
  SGS_DELIVERY_STATION_TYPE,
  PlateOrder,
  PlateOrderValidation,
} from './vehiclePlateOrderingClient.types'
import {
  ErrorMessage,
  getCleanErrorMessagesFromTryCatch,
} from '@island.is/clients/transport-authority/vehicle-owner-change'

@Injectable()
export class VehiclePlateOrderingClient {
  constructor(private readonly plateOrderingApi: PlateOrderingApi) {}

  private plateOrderingApiWithAuth(auth: Auth) {
    return this.plateOrderingApi.withMiddleware(new AuthMiddleware(auth))
  }

  public async getDeliveryStations(
    auth: User,
  ): Promise<Array<DeliveryStation>> {
    const result = await this.plateOrderingApiWithAuth(
      auth,
    ).deliverystationsGet({
      apiVersion: '1.0',
      apiVersion2: '1.0',
    })

    return result.map((item) => ({
      name: item.name,
      type: item.stationType || '',
      code: item.stationCode || '',
    }))
  }

  public async validateVehicleForPlateOrder(
    auth: User,
    permno: string,
    frontType: string,
    rearType: string,
  ): Promise<PlateOrderValidation> {
    // Dummy values
    // Note: option "Pick up at Samgöngustofa" which is always valid
    const deliveryStationType = SGS_DELIVERY_STATION_TYPE
    const deliveryStationCode = SGS_DELIVERY_STATION_CODE
    const expressOrder = false

    return await this.validateAllForPlateOrder(
      auth,
      permno,
      frontType,
      rearType,
      deliveryStationType,
      deliveryStationCode,
      expressOrder,
    )
  }

  public async validateAllForPlateOrder(
    auth: User,
    permno: string,
    frontType: string,
    rearType: string,
    deliveryStationType: string,
    deliveryStationCode: string,
    expressOrder: boolean,
  ): Promise<PlateOrderValidation> {
    let errorMessages: ErrorMessage[] | undefined

    try {
      await this.plateOrderingApiWithAuth(auth).orderplatesPost({
        apiVersion: '1.0',
        apiVersion2: '1.0',
        postOrderPlatesModel: {
          permno: permno,
          frontType: frontType || null,
          rearType: rearType || null,
          stationToDeliverTo: deliveryStationCode || '',
          stationType: deliveryStationType || '',
          expressOrder: expressOrder,
          checkOnly: true, // to make sure we are only validating
        },
      })
    } catch (e) {
      // Note: We had to wrap in try-catch to get the error messages, because if this action results in error,
      // we get 4xx error (instead of 200 with error messages) with the error messages in the body
      errorMessages = getCleanErrorMessagesFromTryCatch(e)
    }

    return {
      hasError: !!errorMessages?.length,
      errorMessages: errorMessages,
    }
  }

  public async savePlateOrders(
    auth: User,
    plateOrder: PlateOrder,
  ): Promise<PlateOrderValidation> {
    let errorMessages: ErrorMessage[] | undefined

    try {
      await this.plateOrderingApiWithAuth(auth).orderplatesPost({
        apiVersion: '1.0',
        apiVersion2: '1.0',
        postOrderPlatesModel: {
          permno: plateOrder.permno,
          frontType: plateOrder.frontType || null,
          rearType: plateOrder.rearType || null,
          stationToDeliverTo: plateOrder.deliveryStationCode || '',
          stationType: plateOrder.deliveryStationType || '',
          expressOrder: plateOrder.expressOrder,
          checkOnly: false,
        },
      })
    } catch (e) {
      errorMessages = getCleanErrorMessagesFromTryCatch(e)
    }

    return {
      hasError: !!errorMessages?.length,
      errorMessages: errorMessages,
    }
  }
}
