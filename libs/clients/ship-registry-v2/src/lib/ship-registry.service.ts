import { Injectable } from '@nestjs/common'
import { User, withAuthContext } from '@island.is/auth-nest-tools'
import { dataOr404Null } from '@island.is/clients/middlewares'
import { isDefined } from '@island.is/shared/utils'
import {
  getCrewRegistrationCountByShip,
  getRanks as getRanksApi,
  getSailorMaritimeBooks as getSailorMaritimeBooksApi,
  getSailorRegistrationExemptions as getSailorRegistrationExemptionsApi,
  getSailorRightCertificates as getSailorRightCertificatesApi,
  getSailorSchoolCertificates as getSailorSchoolCertificatesApi,
  getShipInfoCertDetail,
  getShipsByOwnerAndFisherySsn,
  RankDto,
  ShipBaseInfoDto,
} from '../../gen/fetch'
import {
  mapMaritimeBook,
  SailorMaritimeBookDto,
} from './dtos/sailorMaritimeBook.dto'
import {
  mapRegistrationExemption,
  SailorRegistrationExemptionDto,
} from './dtos/sailorRegistrationExemption.dto'
import {
  mapRightCertificate,
  SailorRightCertificateDto,
} from './dtos/sailorRightCertificate.dto'
import {
  mapSchoolCertificate,
  SailorSchoolCertificateDto,
} from './dtos/sailorSchoolCertificate.dto'
import type {
  SailorSeaServiceEntryDto,
  SailorSeaServiceFilterDto,
} from './dtos/sailorSeaServiceEntry.dto'
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

  async getSailorSchoolCertificates(
    user: User,
  ): Promise<SailorSchoolCertificateDto[]> {
    const response = await withAuthContext(user, () =>
      dataOr404Null(getSailorSchoolCertificatesApi()),
    )

    return (response?.data ?? []).map(mapSchoolCertificate)
  }

  async getSailorRightCertificates(
    user: User,
  ): Promise<SailorRightCertificateDto[]> {
    const response = await withAuthContext(user, () =>
      dataOr404Null(getSailorRightCertificatesApi()),
    )

    return (response?.data ?? []).map(mapRightCertificate).filter(isDefined)
  }

  async getSailorMaritimeBooks(user: User): Promise<SailorMaritimeBookDto[]> {
    const response = await withAuthContext(user, () =>
      dataOr404Null(getSailorMaritimeBooksApi()),
    )

    return (response?.data ?? []).map(mapMaritimeBook)
  }

  async getSailorRegistrationExemptions(
    user: User,
  ): Promise<SailorRegistrationExemptionDto[]> {
    const response = await withAuthContext(user, () =>
      dataOr404Null(getSailorRegistrationExemptionsApi()),
    )

    return (response?.data ?? []).map(mapRegistrationExemption)
  }

  async getSailorSeaService(
    user: User,
    filters?: SailorSeaServiceFilterDto,
  ): Promise<SailorSeaServiceEntryDto[]> {
    const response = await withAuthContext(user, () =>
      dataOr404Null(
        getCrewRegistrationCountByShip({
          // TODO: OpenAPI spec for POST /sailor/crewregistrationsbyship does not define a request body — regenerate client once spec is updated
          body: filters as never,
        }),
      ),
    )

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: unknown[] = Array.isArray(response)
      ? response
      : (response as any)?.data ?? []

    return data as SailorSeaServiceEntryDto[]
  }

  async getRanks(): Promise<RankDto[]> {
    const response = await dataOr404Null(getRanksApi())

    return response ?? []
  }
}
