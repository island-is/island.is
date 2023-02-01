import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import { PlateOrderingApi } from '../../gen/fetch/apis'
import {
  DeliveryStation,
  SGS_DELIVERY_STATION_CODE,
  SGS_DELIVERY_STATION_TYPE,
  PlateOrder,
} from './vehiclePlateOrderingClient.types'

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

  public async checkIfPlateOrderExists(
    auth: User,
    permno: string,
    frontType: string,
    rearType: string,
  ): Promise<boolean> {
    try {
      // Dummy values
      // Note: option "Pick up at Samgöngustofa" which is always valid
      const deliveryStationType = SGS_DELIVERY_STATION_TYPE
      const deliveryStationCode = SGS_DELIVERY_STATION_CODE
      const expressOrder = false

      await this.plateOrderingApiWithAuth(auth).orderplatesPost({
        apiVersion: '1.0',
        apiVersion2: '1.0',
        postOrderPlatesModel: {
          permno: permno,
          frontType: frontType,
          rearType: rearType,
          stationToDeliverTo: deliveryStationCode,
          stationType: deliveryStationType,
          expressOrder: expressOrder,
          checkOnly: true, // to make sure we are only validating
        },
      })
    } catch (e) {
      return true
    }

    return false
  }

  public async savePlateOrders(
    auth: User,
    plateOrder: PlateOrder,
  ): Promise<void> {
    await this.plateOrderingApiWithAuth(auth).orderplatesPost({
      apiVersion: '1.0',
      apiVersion2: '1.0',
      postOrderPlatesModel: {
        permno: plateOrder.permno,
        frontType: plateOrder.frontType,
        rearType: plateOrder.rearType,
        stationToDeliverTo: plateOrder.deliveryStationCode || '',
        stationType: plateOrder.deliveryStationType || '',
        expressOrder: plateOrder.expressOrder,
        checkOnly: false,
      },
    })
  }
}
