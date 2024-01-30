import { Area, mapArea } from './area.dto'
import { MedmaelasofnunExtendedDTO } from '../../../gen/fetch'
import { logger } from '@island.is/logging'
import { Candidate, mapCandidate } from './candidate.dto'

export interface Collection {
  id: string
  startTime: Date
  endTime: Date
  isActive: boolean
  isPresidential: boolean
  isSignatureCollection: boolean
  name: string
  areas: Area[]
  candidates: Candidate[]
}

export function mapCollection(
  collection: MedmaelasofnunExtendedDTO,
): Collection {
  const {
    id,
    sofnunStart: startTime,
    sofnunEnd: endTime,
    svaedi: areas,
    frambodList: candidates,
    kosning,
  } = collection
  if (!id || startTime == null || endTime == null || areas == null) {
    logger.warn(
      'Received partial collection information from the national registry.',
      collection,
    )
    throw new Error(
      'Received partial collection information from the national registry.',
    )
  }

  return {
    id: id.toString(),
    name: collection.kosningNafn ?? '',
    startTime,
    endTime,
    isActive: startTime < new Date() && endTime > new Date(),
    isPresidential: collection.kosningTegund == 'Forsetakosning',
    isSignatureCollection: kosning?.erMedmaelakosning ?? false,
    candidates: candidates
      ? candidates.map((candidate) => mapCandidate(candidate))
      : [],
    areas: areas.map((area) => mapArea(area)),
  }
}
