/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  EstateAsset,
  EstateInfo,
  EstateMember,
} from '@island.is/clients/syslumenn'
import { estateSchema } from '@island.is/application/templates/estate'
import { infer as zinfer } from 'zod'
type EstateSchema = zinfer<typeof estateSchema>
type EstateData = EstateSchema['estate']
type RepeaterType<T> = T & { initial?: boolean; enabled?: boolean }

// A helper type that extracts values from an ArrayLike
export type Extract<
  T extends ArrayLike<any> | Record<any, any>
> = T extends ArrayLike<any> ? T[number] : never

const initialMapper = <T>(element: T) => {
  return {
    ...element,
    initial: true,
    enabled: true,
    marketValue: '0',
  }
}

export const estateTransformer = (estate: EstateInfo): EstateData => {
  const assets = estate.assets.map((el) => initialMapper<EstateAsset>(el))
  const flyers = estate.flyers.map((el) => initialMapper<EstateAsset>(el))
  const estateMembers = estate.estateMembers.map((el) =>
    initialMapper<EstateMember>(el),
  )
  const ships = estate.ships.map((el) => initialMapper<EstateAsset>(el))
  const vehicles = estate.vehicles.map((el) => initialMapper<EstateAsset>(el))
  const guns = estate.guns.map((el) => initialMapper<EstateAsset>(el))

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

export const filterAndRemoveRepeaterMetadata = <T>(
  elements: RepeaterType<Extract<NonNullable<T>>>[],
): Omit<Extract<NonNullable<T>>, 'initial' | 'enabled' | 'dummy'>[] => {
  elements.forEach((element) => {
    delete element.initial
    delete element.dummy
  })

  return elements
}
