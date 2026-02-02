import { Injectable } from '@nestjs/common'
import { User, withAuthContext } from '@island.is/auth-nest-tools'
import { dataOr404Null } from '@island.is/clients/middlewares'
import {
  getShipInfoDetail,
  getShipsByOwnerAndFisherySsn,
  ShipBaseInfoDto,
  ShipDetailsModel,
} from '../../gen/fetch'

@Injectable()
export class ShipRegistryClientV2Service {
  // Example: Get ships owned by user
  async getShipsByOwner(user: User): Promise<ShipBaseInfoDto[]> {
    const response = await withAuthContext(user, () =>
      dataOr404Null(
        getShipsByOwnerAndFisherySsn({
          path: { ssn: user.nationalId },
        }),
      ),
    )

    return response ?? []
  }

  // Example: Get ship details by registry number
  async getShipDetails(
    user: User,
    registryNumber: string,
  ): Promise<ShipDetailsModel | null> {
    const response = await withAuthContext(user, () =>
      dataOr404Null(
        getShipInfoDetail({
          path: { shipRegistrationNumber: registryNumber },
        }),
      ),
    )

    return response ?? null
  }
}
