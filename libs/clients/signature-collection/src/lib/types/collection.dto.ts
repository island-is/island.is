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

// We are storing this enum such that an unknown category maps to 0
// Then the rest is ordered to reflect the numerical values present in the
// Signature Collection API (see /Tegund/Kosning in the API)
export enum CollectionType {
  OtherUnknown,
  Parliamentary,
  Presidential,
  Municipal,
  Referendum, // is: Þjóðaratkvæðagreiðsla
  OtherSameRulesAsParliamentary,
  LocalGovernmental, // is: Sveitarstjórnarkosningar
  SpecialLocalGovernmental,
  ResidentPoll, // is: Íbúakönnun
  ForeignResidentPoll,
}

export const getCollectionTypeFromNumber = (
  nr: number | undefined,
): CollectionType => {
  // Make sure to add to the enum and iterate on the numbers
  // if needed and when other types of collections are added.
  if (nr && nr > 0 && nr <= 8) {
    return nr as CollectionType
  }
  return CollectionType.OtherUnknown
}

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
  const collectionType = getCollectionTypeFromNumber(kosning?.kosningTegundNr)
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
  return {
    id: id.toString(),
    name: collection.kosningNafn ?? '',
    startTime,
    endTime,
    isActive,
    isPresidential: collectionType === CollectionType.Presidential,
    isSignatureCollection: kosning?.erMedmaelakosning ?? false,
    candidates: candidates
      ? candidates.map((candidate) => mapCandidate(candidate))
      : [],
    areas: areas.map((area) => mapArea(area)),
    processed,
    status,
    collectionType,
  }
}
