// apps/web/screens/SecondarySchoolStudies/useSecondarySchoolSearch.tsx

import Fuse from 'fuse.js'

import { SecondarySchoolAllProgrammesQuery } from '@island.is/web/graphql/schema'

type SecondarySchoolProgramme =
  SecondarySchoolAllProgrammesQuery['secondarySchoolAllProgrammes'][0]

interface FilterProps {
  key: string
  value: Array<string>
}

interface SearchProgrammesProps {
  fuseInstance: Fuse<SecondarySchoolProgramme>
  query?: string
  activeFilters: Array<FilterProps>
}

export interface FuseQueryResult {
  item: SecondarySchoolProgramme
  refIndex: number
  score: number
}

interface QueryMakerProps {
  $and: Array<any>
}

interface Bucket {
  [roundedScore: string]: FuseQueryResult[]
}

export const SearchProgrammes = ({
  fuseInstance,
  query,
  activeFilters,
}: SearchProgrammesProps) => {
  const queryMaker: QueryMakerProps = { $and: [] }

  if (query) {
    queryMaker.$and.push({
      $or: [
        { title: query },
        { description: query },
        { 'studyTrack.name': query },
        { 'qualification.title': query },
        { 'specialization.title': query },
      ],
    })
  }

  activeFilters.forEach((filter) => {
    const orFilters: Array<any> = []
    filter.value.forEach((searchParam) => {
      // Handle nested fields for different filter types
      if (filter.key === 'schools') {
        orFilters.push({ 'schools.id': searchParam })
      } else if (filter.key === 'countryAreas') {
        orFilters.push({ 'schools.countryArea.id': searchParam })
      } else if (filter.key === 'studyTracks') {
        orFilters.push({ 'studyTrack.isced': searchParam })
      } else if (filter.key === 'levels') {
        orFilters.push({ 'qualification.level.id': searchParam })
      }
    })
    if (orFilters.length > 0) {
      queryMaker.$and.push({ $or: orFilters })
    }
  })

  const result = fuseInstance.search(queryMaker)
  const sortedResults = sortIntoBuckets(result as FuseQueryResult[])

  return [...Object.values(sortedResults)].flat() || []
}

// Function to sort and group objects into buckets based on score
const sortIntoBuckets = (dataArray: FuseQueryResult[]) => {
  const buckets: Bucket = {}

  // Group results into buckets based on the rounded score
  dataArray.forEach((item) => {
    const roundedScore = item.score?.toFixed(2) || '0.00'

    if (!buckets[roundedScore]) {
      buckets[roundedScore] = []
    }

    buckets[roundedScore].push(item)
  })

  const orderedBuckets: Bucket = {}

  // For each bucket, sort within so each school gets equal representation
  Object.values(buckets).forEach((bucket, index) => {
    const schoolGroups: Record<string, FuseQueryResult[]> = {}

    bucket.forEach((item) => {
      const schoolId = item.item.schools?.[0]?.id || 'unknown'
      schoolGroups[schoolId] = schoolGroups[schoolId] || []
      schoolGroups[schoolId].push(item)
    })

    const keys = Object.keys(schoolGroups)
    const maxLength = Math.max(...keys.map((key) => schoolGroups[key].length))

    const orderedList: FuseQueryResult[] = []
    for (let i = 0; i < maxLength; i++) {
      for (let j = 0; j < keys.length; j++) {
        const currentKey = keys[j]

        if (i < schoolGroups[currentKey].length) {
          const currentItem = schoolGroups[currentKey][i]
          orderedList.push(currentItem)
        }
      }
    }

    orderedBuckets[index] = orderedList
  })

  return orderedBuckets
}
