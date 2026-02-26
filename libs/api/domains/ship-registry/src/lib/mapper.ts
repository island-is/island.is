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
    usageType: ship.usageType || undefined,
    imoNumber: ship.imoNumber || undefined,
    status: ship.status || undefined,
    constructionYear: ship.constructionYear || undefined,
    constructionStation: ship.constructionStation || undefined,
    constructionPlace: ship.constructionPlace || undefined,
    hullMaterial: ship.hullMaterial || undefined,
    classificationSociety: ship.classificationSociety || undefined,
    seaworthiness: ship.seaworthiness
      ? {
          isValid: ship.seaworthiness.isValid,
          validTo: ship.seaworthiness.validTo
            ? ship.seaworthiness.validTo.toString()
            : '',
        }
      : undefined,
    identification: ship.identification
      ? {
          regionAcronym: ship.identification.regionAcronym,
          regionName: ship.identification.regionName,
          homeHarbor: ship.identification.homeHarbor || undefined,
        }
      : undefined,
    measurements: ship.mainMeasurements
      ? {
          length: ship.mainMeasurements.length,
          mostLength: ship.mainMeasurements.mostLength,
          width: ship.mainMeasurements.width,
          depth: ship.mainMeasurements.depth,
          bruttoGrt: ship.mainMeasurements.bruttoGrt,
          nettoWeightTons: ship.mainMeasurements.nettoWeightTons,
        }
      : undefined,
    fishery: ship.fishery
      ? {
          name: ship.fishery.name || undefined,
          address: ship.fishery.address || undefined,
          postalCode: ship.fishery.postalCode || undefined,
        }
      : undefined,
    engines: ship.engines
      ? ship.engines.map((engine) => ({
          power: engine.power || undefined,
          year: engine.year || undefined,
          usage: engine.usage?.name || undefined,
          manufacturer: engine.manufacturer?.name || undefined,
        }))
      : undefined,
  }
}
