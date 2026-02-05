import {
  ShipBaseInfoDto,
  ShipDetailsModel,
} from '@island.is/clients/ship-registry-v2'
import { isDefined } from '@island.is/shared/utils'
import { UserShip } from './models/userShip.model'

export const mapToUserShipCollection = (
  ships: ShipBaseInfoDto[],
): UserShip[] => {
  return ships.map(mapToUserShipFromBaseInfo).filter(isDefined)
}

export const mapToUserShipFromBaseInfo = (
  ship: ShipBaseInfoDto,
): UserShip | undefined => {
  if (!ship.shipRegistrationNumber || !ship.shipName) {
    return undefined
  }

  return {
    id: ship.shipRegistrationNumber,
    name: ship.shipName,
  }
}

export const mapToUserShipFromDetails = (
  ship: ShipDetailsModel,
): UserShip | undefined => {
  if (!ship.shipRegistrationNumber || !ship.name) {
    return undefined
  }

  return {
    id: ship.shipRegistrationNumber.toString(),
    name: ship.name,
  }
}
