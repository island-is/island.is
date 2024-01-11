import { Area, mapArea } from './area.dto'
import {
  MedmaelasofnunDTO,
  MedmaelasofnunExtendedDTO,
} from '../../../gen/fetch'
import { logger } from '@island.is/logging'
import { Candidate, mapCandidate } from './candidate.dto'

export interface CollectionInfo {
  id: number
  startTime: Date
  endTime: Date
  isActive: boolean
  isPresidential: boolean
}
export interface Collection extends Omit<CollectionInfo, 'id'> {
  id: string
  name: string
  startTime: Date
  endTime: Date
  areas: Area[]
  candidates: Candidate[]
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
  const {
    id: id,
    sofnunStart: startTime,
    sofnunEnd: endTime,
    svaedi: areas,
    frambodList: candidates,
  } = collection
  if (id == null || startTime == null || endTime == null || areas == null) {
    logger.warn(
      'Received partial collection information from the national registry.',
      collection,
    )
    throw new Error(
      'Received partial collection information from the national registry.',
    )
  }

  return {
    id: id?.toString(),
    name: collection.kosningNafn ?? '',
    startTime,
    endTime,
    isActive: startTime < new Date() && endTime > new Date(),
    isPresidential: collection.kosningTegund == 'Forsetakosning',
    candidates: candidates ? candidates.map((candidate) =>mapCandidate(candidate)) : [],
    areas: areas.map((area) => mapArea(area)),
  }
}
