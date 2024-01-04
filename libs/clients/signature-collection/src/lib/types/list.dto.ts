import { Area } from './area.dto'
import { UserBase } from './user.dto'
import { MedmaelalistiBaseDTO, MedmaelalistiDTO } from '../../../gen/fetch'
import { Candidate, mapCandidate } from './candidate.dto'
import { logger } from '@island.is/logging'
import { Collection, CollectionInfo } from './collection.dto'

export interface List {
  id: string
  title: string
  candidate: Candidate
  area: Area
  active: boolean
  startTime: Date
  endTime: Date
  collectionId: string
  collectors?: UserBase[]
  numberOfSignatures: number
  slug: string
}

export function getSlug(id: number | string): string {
  // TODO: create hash function
  return `/umsoknir/maela-med-lista/?q=${id}`
}

export function mapListBase(
  list: MedmaelalistiBaseDTO,
  candidate: Candidate,
  collection: CollectionInfo,
): List {
  return {
    id: list.id?.toString() ?? '',
    collectionId: collection.id.toString(),
    title: list.listiNafn ?? '',
    startTime: collection.startTime,
    endTime: collection.endTime,
    area: {
      id: list.svaedi?.id?.toString() ?? '',
      name: list.svaedi?.nafn?.toString() ?? '',
      min: list.svaedi?.fjoldi ?? 0,
    },
    candidate,
    // TODO: update active functionality
    active: true,
    numberOfSignatures: list.fjoldiMedmaela ?? 0,
    slug: getSlug(candidate.id),
  }
}

export function mapList(list: MedmaelalistiDTO): List {
  console.log(list)
  const { id: id, medmaelasofnun: collection, frambod: candidate } = list
  if (!id || !collection || !candidate || !candidate.id) {
    logger.warn(
      'Received partial collection information from the national registry.',
      list,
    )
    throw new Error('List is missing info')
  }
  return {
    id: list.id?.toString() ?? '',
    collectionId: list.medmaelasofnun?.id?.toString() ?? '',
    title: list.listiNafn ?? '',
    startTime: list.medmaelasofnun?.sofnunStart ?? new Date(),
    endTime: list.medmaelasofnun?.sofnunEnd ?? new Date(),
    area: {
      id: list.svaedi?.id?.toString() ?? '',
      name: list.svaedi?.nafn?.toString() ?? '',
      min: list.svaedi?.fjoldi ?? 0,
    },
    candidate: mapCandidate(candidate),
    // TODO: update active functionality
    active: true,
    numberOfSignatures: list.fjoldiMedmaela ?? 0,
    slug: getSlug(candidate.id),
  }
}
