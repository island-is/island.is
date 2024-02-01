import { Area, mapArea } from './area.dto'
import { UserBase } from './user.dto'
import {
  MedmaelalistiBaseDTO,
  MedmaelalistiDTO,
  UmbodBaseDTO,
} from '../../../gen/fetch'
import { Candidate, mapCandidate } from './candidate.dto'
import { logger } from '@island.is/logging'

export interface ListBase {
  id: string
  title: string
  area: Area
}

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
  maxReached: boolean
}

export function getSlug(id: number | string): string {
  return `/umsoknir/maela-med-frambodi/?candidate=${id}`
}

export function mapListBase(list: MedmaelalistiBaseDTO): ListBase {
  const { id: id, svaedi: areas } = list
  if (!id || !areas) {
    logger.warn(
      'Received partial collection information from the national registry.',
      list,
    )
    throw new Error('List has no area')
  }
  const area = mapArea(areas)
  return {
    id: list.id?.toString() ?? '',
    title: list.listiNafn ?? '',
    area,
  }
}

export function mapList(
  list: MedmaelalistiDTO,
  collectors?: UmbodBaseDTO[],
): List {
  const {
    id: id,
    medmaelasofnun: collection,
    frambod: candidate,
    svaedi: areas,
    dagsetningLokar: endTime,
  } = list
  if (!id || !collection || !candidate || !candidate.id || !areas || !endTime) {
    logger.warn(
      'Received partial collection information from the national registry.',
      list,
    )
    throw new Error(
      'Fetch list failed. Received partial collection information from the national registry.',
    )
  }
  const area = mapArea(areas)
  const numberOfSignatures = list.fjoldiMedmaela ?? 0
  return {
    id: list.id?.toString() ?? '',
    collectionId: list.medmaelasofnun?.id?.toString() ?? '',
    title: list.listiNafn ?? '',
    startTime: list.medmaelasofnun?.sofnunStart ?? new Date(),
    endTime: list.dagsetningLokar ?? new Date(),
    collectors: collectors
      ? collectors?.map((collector) => ({
          name: collector.nafn ?? '',
          nationalId: collector.kennitala ?? '',
        }))
      : [],
    candidate: mapCandidate(candidate),
    slug: getSlug(candidate.id),
    area,
    active: endTime > new Date(),
    numberOfSignatures,
    maxReached: area.max <= numberOfSignatures,
  }
}
