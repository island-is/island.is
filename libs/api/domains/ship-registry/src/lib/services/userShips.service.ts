import { Injectable } from '@nestjs/common'
import { User } from '@island.is/auth-nest-tools'
import { ShipRegistryClientV2Service } from '@island.is/clients/ship-registry-v2'
import { UserShipsCollection } from '../models/userShipsCollection.model'
import { mapToUserShipCollection, mapToUserShipFromDetails } from '../mappers'
import { UserShip } from '../models/userShip.model'
import { UserShipInput } from '../dto/userShip.input'

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

  async getUserShip(
    user: User,
    input: UserShipInput,
  ): Promise<UserShip | null> {
    const ship = await this.shipRegistryClientV2Service.getShipDetails(
      user,
      input.registrationNumber,
    )

    if (!ship) {
      return null
    }

    return mapToUserShipFromDetails(ship, input.locale) ?? null
  }
}
