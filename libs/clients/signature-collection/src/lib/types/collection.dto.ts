import { Area, mapArea } from './area.dto'
import { MedmaelasofnunExtendedDTO } from '../../../gen/fetch'
import { logger } from '@island.is/logging'
import { Candidate, mapCandidate } from './candidate.dto'

export enum CollectionStatus {
  InitialActive = 'initialActive',
  Active = 'active',
  InInitialReview = 'inInitialReview',
  InReview = 'inReview',
  Processing = 'processing',
  Processed = 'processed',
  Inactive = 'inactive',
}

// We transform the raw numbers coming from the client
// to string representations so that these values will be comparable
// when travelling through the GraphQL layers since numerical enums
// and other objects will default to `Scalar['Float']` which is
// not accurate enough for comparisons to survive through that layer.
export enum CollectionType {
  OtherUnknown = 'OtherUnknown',
  Parliamentary = 'Parliamentary',
  Presidential = 'Presidential',
  Referendum = 'Referendum', // is: Þjóðaratkvæðagreiðsla
  OtherSameRulesAsParliamentary = 'OtherSameRulesAsParliamentary',
  LocalGovernmental = 'LocalGovernmental', // is: Sveitarstjórnarkosningar
  SpecialLocalGovernmental = 'SpecialLocalGovernmental',
  ResidentPoll = 'ResidentPoll', // is: Íbúakönnun
}

// If you need to update these values, please take a look at the
// Signature Collection API → see /Tegund/Kosning
const collectionTypeTable = {
  0: CollectionType.OtherUnknown,
  1: CollectionType.Parliamentary,
  2: CollectionType.Presidential,
  3: CollectionType.Referendum,
  4: CollectionType.OtherSameRulesAsParliamentary,
  5: CollectionType.LocalGovernmental,
  6: CollectionType.SpecialLocalGovernmental,
  9: CollectionType.ResidentPoll,
}

// Typeguard
export const isCollectionType = (value: unknown): value is CollectionType => {
  return Object.values(CollectionType).includes(value as CollectionType)
}

export const getCollectionTypeFromNumber = (number: number): CollectionType => {
  const index = number as keyof typeof collectionTypeTable
  if (collectionTypeTable?.[index]) {
    return collectionTypeTable[index]
  }
  return CollectionType.OtherUnknown
}

export const getNumberFromCollectionType = (
  collectionType: CollectionType,
): number => {
  const found = Object.entries(collectionTypeTable).find(
    (e) => e[1] === collectionType,
  )
  return parseInt(found?.[0] ?? '0', 10)
}

export interface Collection {
  id: string
  startTime: Date
  endTime: Date
  isActive: boolean
  isSignatureCollection: boolean
  name: string
  areas: Area[]
  candidates: Candidate[]
  processed: boolean
  status: CollectionStatus
  collectionType: CollectionType
}

const getStatus = ({
  isActive,
  processed,
  hasActiveLists,
  hasExtendedLists,
}: {
  isActive: boolean
  processed: boolean
  hasActiveLists: boolean
  hasExtendedLists: boolean
}): CollectionStatus => {
  // Collection in inital opening time
  if (isActive) {
    return CollectionStatus.InitialActive
  }

  // Initial opening time passed not all lists reviewed
  if (!hasActiveLists && !processed) {
    return CollectionStatus.InInitialReview
  }
  // Initial opening time passed, collection has been manually processed
  if (!hasActiveLists && processed && !hasExtendedLists) {
    return CollectionStatus.Processed
  }
  // Collection active if any lists have been extended
  if (hasActiveLists && processed && hasExtendedLists) {
    return CollectionStatus.Active
  }
  // Collection had extended lists that have all expired
  if (!hasActiveLists && processed && hasExtendedLists) {
    return CollectionStatus.InReview
  }
  return CollectionStatus.Inactive
}

export const mapCollection = (
  collection: MedmaelasofnunExtendedDTO,
): Collection => {
  const {
    id,
    sofnunStart: startTime,
    sofnunEnd: endTime,
    svaedi: areas,
    frambodList: candidates,
    kosning,
  } = collection
  if (!id || !startTime || !endTime || !areas) {
    logger.warn(
      'Received partial collection information from the national registry.',
      collection,
    )
    throw new Error(
      'Received partial collection information from the national registry.',
    )
  }
  const collectionType = getCollectionTypeFromNumber(
    collection.kosning?.kosningTegundNr ?? 0,
  )
  const isActive = startTime < new Date() && endTime > new Date()
  const processed = collection.lokadHandvirkt ?? false
  const hasActiveLists = collection.opnirListar ?? false
  const hasExtendedLists = collection.framlengdirListar ?? false

  const status = getStatus({
    isActive,
    processed,
    hasActiveLists,
    hasExtendedLists,
  })
  const governmentalArea =
    collectionType === CollectionType.LocalGovernmental && areas.length > 0
      ? areas[0].id?.toString()
      : undefined
  return {
    id: id.toString(),
    name: collection.kosningNafn ?? '',
    startTime,
    endTime,
    isActive,
    isSignatureCollection: kosning?.erMedmaelakosning ?? false,
    candidates: candidates
      ? candidates.map((candidate) => mapCandidate(candidate, governmentalArea))
      : [],
    areas: areas.map((area) => mapArea(area, id.toString())),
    processed,
    status,
    collectionType,
  }
}
