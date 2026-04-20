import { Injectable } from '@nestjs/common'
import { User, withAuthContext } from '@island.is/auth-nest-tools'
import { dataOr404Null } from '@island.is/clients/middlewares'
import {
  getShipInfoCertDetail,
  getShipsByOwnerAndFisherySsn,
  MyShipDetailDto,
  ShipBaseInfoDto,
} from '../../gen/fetch'

@Injectable()
export class ShipRegistryClientV2Service {
  async getShipsByOwner(user: User): Promise<ShipBaseInfoDto[]> {
    const response = await withAuthContext(user, () =>
      dataOr404Null(getShipsByOwnerAndFisherySsn()),
    )

    return response ?? []
  }

  async getShipDetails(
    user: User,
    registryNumber: string,
  ): Promise<MyShipDetailDto | null> {
    const response = await withAuthContext(user, () =>
      dataOr404Null(
        getShipInfoCertDetail({
          path: { shipRegistrationNumber: registryNumber },
        }),
      ),
    )

    return response ?? null
  }
}
