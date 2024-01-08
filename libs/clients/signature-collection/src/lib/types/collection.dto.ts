import { Area, mapArea } from './area.dto'
import {
  MedmaelasofnunDTO,
  MedmaelasofnunExtendedDTO,
} from '../../../gen/fetch'
import { logger } from '@island.is/logging'

export interface CollectionInfo {
  id: number
  startTime: Date
  endTime: Date
  isActive: boolean
  isPresidential: boolean
}
export interface Collection {
  id: string
  name: string
  startTime: Date
  endTime: Date
  areas: Area[]
}
export function mapCollectionInfo(
  collection: MedmaelasofnunDTO,
): CollectionInfo | null {
  const { id: id, sofnunStart: startTime, sofnunEnd: endTime } = collection

  if (id == null || startTime == null || endTime == null) {
    logger.warn(
      'Received partial collection information from the national registry.',
      collection,
    )
    return null
  }
  return {
    id,
    startTime: startTime,
    endTime: endTime,
    isActive: startTime < new Date() && endTime > new Date(),
    isPresidential: collection.kosningTegund == 'Forsetakosning',
  }
}

export function mapCollection(
  collection: MedmaelasofnunExtendedDTO,
): Collection {
  if (!collection.svaedi) {
    logger.warn(
      'Received partial collection information from the national registry.',
      collection,
    )
    throw new Error('List has no area')
  }
  return {
    id: collection.id?.toString() ?? '',
    name: collection.kosningNafn ?? '',
    startTime: collection.sofnunStart ?? new Date(),
    endTime: collection.sofnunEnd ?? new Date(),
    areas: collection.svaedi?.map((area) => mapArea(area)),
  }
}
