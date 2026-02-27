import { Injectable } from '@nestjs/common'
import { User } from '@island.is/auth-nest-tools'
import { ShipRegistryClientV2Service } from '@island.is/clients/ship-registry-v2'
import { UserShipsCollection } from '../models/userShipsCollection.model'
import { mapToUserShipCollection, mapToUserShipFromDetails } from '../mapper'
import { UserShip } from '../models/userShip.model'
import { LocaleEnum } from '../dto/locale.enum'

@Injectable()
export class UserShipsService {
  constructor(
    private readonly shipRegistryClientV2Service: ShipRegistryClientV2Service,
  ) {}

  async getUserShips(user: User): Promise<UserShipsCollection> {
    const ships = await this.shipRegistryClientV2Service.getShipsByOwner(user)
    const mappedShips = mapToUserShipCollection(ships)

    return {
      data: mappedShips,
      totalCount: mappedShips.length,
      pageInfo: {
        hasNextPage: false,
      },
    }
  }

  async getUserShip(user: User, id: string, locale?: LocaleEnum): Promise<UserShip | null> {
    const ship = await this.shipRegistryClientV2Service.getShipDetails(user, id)

    if (!ship) {
      return null
    }

    return mapToUserShipFromDetails(ship, locale) ?? null
  }
}
