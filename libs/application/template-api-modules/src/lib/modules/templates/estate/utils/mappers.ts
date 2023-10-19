/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  EstateAsset,
  EstateInfo,
  EstateMember,
} from '@island.is/clients/syslumenn'
import { estateSchema } from '@island.is/application/templates/estate'
import { infer as zinfer } from 'zod'
import { UploadData } from '../types'

type EstateSchema = zinfer<typeof estateSchema>
type EstateData = EstateSchema['estate']
type RepeaterType<T> = T & { initial?: boolean; enabled?: boolean }

const estateAssetMapper = <T>(element: T) => {
  return {
    ...element,
    initial: true,
    enabled: true,
    marketValue: '',
  }
}

const estateMemberMapper = (element: EstateMember) => {
  return {
    ...element,
    initial: true,
    enabled: true,
    phone: '',
    email: '',
    advocate: element.advocate
      ? {
          ...element.advocate,
          phone: '',
          email: '',
        }
      : undefined,
  }
}

export const estateTransformer = (estate: EstateInfo): EstateData => {
  const assets = estate.assets.map((el) => estateAssetMapper<EstateAsset>(el))
  const flyers = estate.flyers.map((el) => estateAssetMapper<EstateAsset>(el))
  const ships = estate.ships.map((el) => estateAssetMapper<EstateAsset>(el))
  const vehicles = estate.vehicles.map((el) =>
    estateAssetMapper<EstateAsset>(el),
  )
  const guns = estate.guns.map((el) => estateAssetMapper<EstateAsset>(el))
  const estateMembers = estate.estateMembers.map((el) => estateMemberMapper(el))

  return {
    ...estate,
    estateMembers,
    assets,
    flyers,
    ships,
    vehicles,
    guns,
  }
}

// -----------------------------------------------------------------
// ----------------------- EXPANDERS -------------------------------
// -----------------------------------------------------------------
// Sometimes, if the application frontend doesn't include properties
// The properties are omitted from the application.answers
// We need to reattach them to the answers such that the
// uploadData is consistent no matter what the frontend decides.
// In other words, if undefined, we need to set them to default empty values
export const expandGuns = (guns: UploadData['guns']): UploadData['guns'] => {
  const expandedGuns: UploadData['guns'] = []

  guns.forEach((gun) => {
    expandedGuns.push({
      assetNumber: gun.assetNumber ?? '',
      description: gun.description ?? '',
      enabled: gun.enabled ?? false,
      marketValue: gun.marketValue ?? '',
    })
  })

  return expandedGuns
}
