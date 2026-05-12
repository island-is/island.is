import { Injectable, NotImplementedException } from '@nestjs/common'
import { User, withAuthContext } from '@island.is/auth-nest-tools'
import { dataOr404Null } from '@island.is/clients/middlewares'
import {
  getSailorCertificatesAndRelatedInfo,
  getShipInfoCertDetail,
  getShipsByOwnerAndFisherySsn,
  ShipBaseInfoDto,
} from '../../gen/fetch'
import {
  mapSailorCertificates,
  type SailorCertificatesDto,
} from './dtos/sailor.dto'
import { mapShipDetail, type ShipDetailDto } from './dtos/ship.dto'

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
  ): Promise<ShipDetailDto | null> {
    const response = await withAuthContext(user, () =>
      dataOr404Null(
        getShipInfoCertDetail({
          path: { shipRegistrationNumber: registryNumber },
        }),
      ),
    )

    return response ? mapShipDetail(response) : null
  }

  async getSailorCertificates(
    user: User,
  ): Promise<SailorCertificatesDto | null> {
    const response = await withAuthContext(user, () =>
      dataOr404Null(getSailorCertificatesAndRelatedInfo()),
    )

    return response ? mapSailorCertificates(response) : null
  }

  getCrewRegistrations(): never {
    throw new NotImplementedException()
  }
}
