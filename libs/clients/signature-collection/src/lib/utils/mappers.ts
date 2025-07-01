import { MedmaelasofnunExtendedDTO } from '../../../gen/fetch/'
import {
  Collection,
  CollectionStatus,
  CollectionType,
  mapCollection,
} from '../types/collection.dto'
export const collapseGovernment = (
  collections: MedmaelasofnunExtendedDTO[],
  activeAreas: string[],
): Collection => {
  let earliestStart: Date = new Date(8640000000000000) // Max date
  let latestEndTime: Date = new Date(0)

  const localGovernmentalCollection: Collection = {
    ...mapCollection(collections[0], activeAreas),
    areas: [],
    candidates: [],
    collectionType: CollectionType.LocalGovernmental,
  }
  for (const collection of collections) {
    const { status, startTime, endTime, areas, candidates } = mapCollection(
      collection,
      activeAreas,
    )

    // Aggregate time over collection for maximal range
    if (startTime < earliestStart) {
      earliestStart = startTime
    }

    if (endTime > latestEndTime) {
      latestEndTime = endTime
    }

    // Aggregate areas and candidates
    localGovernmentalCollection.areas.push(...areas)
    localGovernmentalCollection.candidates.push(...candidates)

    if (status === CollectionStatus.Active) {
      localGovernmentalCollection.status = status
    }
  }
  localGovernmentalCollection.startTime = earliestStart
  localGovernmentalCollection.endTime = latestEndTime

  return localGovernmentalCollection
}
