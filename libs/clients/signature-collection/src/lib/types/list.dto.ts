import { Area, mapArea } from './area.dto'
import { UserBase } from './user.dto'
import {
  MedmaelalistiBaseDTO,
  MedmaelalistiDTO,
  UmbodBaseDTO,
} from '../../../gen/fetch'
import { Candidate, mapCandidate } from './candidate.dto'
import { logger } from '@island.is/logging'
import { CollectionType } from './collection.dto'

export enum ListStatus {
  Active = 'active',
  InReview = 'inReview',
  Reviewed = 'reviewed',
  Extendable = 'extendable',
  Inactive = 'inactive',
}

export enum ListType {
  Parliamentary = 'alþingiskosning',
  Presidential = 'forsetakosning',
  Municipal = 'sveitarstjórnarkosningar',
}

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
  reviewed: boolean
  isExtended: boolean
  collectionType: CollectionType
}

export interface SignedList extends List {
  signedDate: Date
  isDigital: boolean
  pageNumber?: number
  isValid: boolean
  canUnsign: boolean
}

export const getSlug = (id: number | string, type: string): string => {
  switch (type.toLowerCase()) {
    case ListType.Parliamentary:
      return `/umsoknir/maela-med-althingisframbodi?candidate=${id}`
    case ListType.Municipal:
      return `/umsoknir/maela-med-sveitarstjornarframbodi?candidate=${id}`
    default:
      return `/umsoknir/maela-med-frambodi?candidate=${id}`
  }
}

export const mapListBase = (
  list: MedmaelalistiBaseDTO,
  isAreaActive: boolean,
): ListBase => {
  const { id: id, svaedi: areas } = list
  if (!id || !areas) {
    logger.warn(
      'Received partial collection information from the national registry.',
      list,
    )
    throw new Error('List has no area')
  }
  const area = mapArea(areas, isAreaActive)
  return {
    id: list.id?.toString() ?? '',
    title: list.listiNafn ?? '',
    area,
  }
}

export const mapList = (
  list: MedmaelalistiDTO,
  participatingAreas: Area[],
  collectionType?: CollectionType,
  collectors?: UmbodBaseDTO[],
): List => {
  const {
    id: id,
    medmaelasofnun: collection,
    frambod: candidate,
    svaedi: areas,
    dagsetningLokar: endTime,
  } = list
  if (
    !id ||
    !collection?.sofnunEnd ||
    !candidate ||
    !candidate.id ||
    !areas ||
    !endTime
  ) {
    logger.warn(
      'Received partial collection information from the national registry.',
      list,
    )
    throw new Error(
      'Fetch list failed. Received partial collection information from the national registry.',
    )
  }
  const area = mapArea(
    areas,
    participatingAreas.find((area) => area.id === areas.id?.toString())
      ?.isActive ?? false,
    collection.id?.toString(),
  )
  const numberOfSignatures = list.fjoldiMedmaela ?? 0

  const isActive = !list.listaLokad
  const isExtended = endTime > collection.sofnunEnd
  const reviewed = list.urvinnslaLokid ?? false

  return {
    id: list.id?.toString() ?? '',
    collectionId: list.medmaelasofnun?.id?.toString() ?? '',
    title: list.listiNafn ?? '',
    startTime: list.medmaelasofnun?.sofnunStart ?? new Date(),
    endTime,
    collectors: collectors
      ? collectors?.map((collector) => ({
          name: collector.nafn ?? '',
          nationalId: collector.kennitala ?? '',
        }))
      : [],
    candidate: mapCandidate(candidate),
    slug: getSlug(candidate.id, collection.kosningTegund),
    area,
    active: isActive,
    numberOfSignatures,
    maxReached: area.max <= numberOfSignatures,
    reviewed,
    isExtended,
    collectionType: collectionType ?? CollectionType.OtherUnknown,
  }
}
