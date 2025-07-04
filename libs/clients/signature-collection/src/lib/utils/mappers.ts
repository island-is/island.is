import { MedmaelasofnunExtendedDTO } from '../../../gen/fetch/'
import { Area } from '../types/area.dto'
import {
  Collection,
  CollectionStatus,
  CollectionType,
  mapCollection,
} from '../types/collection.dto'
export const collapseGovernment = (
  collections: MedmaelasofnunExtendedDTO[],
  participatingAreas: Area[],
): Collection => {
  let earliestStart: Date = new Date(8640000000000000) // Max date
  let latestEndTime: Date = new Date(0)

  const localGovernmentalCollection: Collection = {
    ...mapCollection(collections[0], participatingAreas),
    areas: [],
    candidates: [],
    collectionType: CollectionType.LocalGovernmental,
  }
  for (const collection of collections) {
    const { status, startTime, endTime, candidates } = mapCollection(
      collection,
      participatingAreas,
    )

    // Aggregate time over collection for maximal range
    if (startTime < earliestStart) {
      earliestStart = startTime
    }

    if (endTime > latestEndTime) {
      latestEndTime = endTime
    }

    // Aggregate areas and candidates
    localGovernmentalCollection.candidates.push(...candidates)
    const area = participatingAreas.find(
      (a) => a.id === collection.svaedi?.[0].id?.toString(),
    )
    if (area) {
      area.collectionId = collection.id?.toString()
    }

    if (status === CollectionStatus.Active) {
      localGovernmentalCollection.status = status
    }
  }
  localGovernmentalCollection.startTime = earliestStart
  localGovernmentalCollection.endTime = latestEndTime
  localGovernmentalCollection.areas = participatingAreas

  return localGovernmentalCollection
}
