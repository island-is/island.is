import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import { PlateOrderingApi } from '../../gen/fetch/apis'
import { DeliveryStation, PlateOrder } from './vehiclePlateOrderingClient.types'

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

    return (
      result
        // Filtering out type=R and code=1 (that is the option "Pick up at Samgöngustofa")
        .filter((x) => x.stationType !== 'R' && x.stationCode !== '1')
        .map((item) => ({
          name: item.name,
          // Since the result is only unique per code+type, we will just merge them together here
          codeType: (item.stationCode || '') + '_' + (item.stationType || ''),
        }))
    )
  }

  public async orderPlates(auth: User, plateOrder: PlateOrder): Promise<void> {
    let deliveryStationType: string
    let deliveryStationCode: string

    // Check if used selected delivery method: Pick up at delivery station
    const deliveryStationTypeCode = plateOrder.deliveryStationTypeCode
    if (plateOrder.deliveryMethodIsDeliveryStation && deliveryStationTypeCode) {
      // Split up code+type (was merged when we fetched that data)
      deliveryStationType = deliveryStationTypeCode.split('_')[0]
      deliveryStationCode = deliveryStationTypeCode.split('_')[1]
    } else {
      // Otherwise we will default to "Pick up at Samgöngustofa" which is type=R and code=1
      deliveryStationType = 'R'
      deliveryStationCode = '1'
    }

    await this.plateOrderingApiWithAuth(auth).orderplatesPost({
      apiVersion: '1.0',
      apiVersion2: '1.0',
      postOrderPlatesModel: {
        permno: plateOrder.permno,
        frontType: plateOrder.frontType,
        rearType: plateOrder.rearType,
        stationToDeliverTo: deliveryStationCode,
        stationType: deliveryStationType,
        expressOrder: plateOrder.expressOrder,
      },
    })
  }
}
