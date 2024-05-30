import Fuse from 'fuse.js'

import { UniversityGatewayProgram } from '../graphql/schema'

interface FilterProps {
  key: string
  value: Array<string>
}

interface SearchProductsProps {
  fuseInstance: Fuse<any>
  query?: string
  activeFilters: Array<FilterProps>
  locale: string
}

export interface FuseQueryResult {
  item: UniversityGatewayProgram
  refIndex: number
  score: number
}

interface QueryMakerProps {
  $and: Array<any>
}

interface Bucket {
  [roundedScore: string]: FuseQueryResult[]
}

export const SearchProducts = ({
  fuseInstance,
  query,
  activeFilters,
  locale,
}: SearchProductsProps) => {
  const queryMaker: QueryMakerProps = { $and: [] }

  if (query) {
    queryMaker.$and.push({
      $or: [
        { [`name${locale === 'is' ? 'Is' : 'En'}`]: query },
        { [`specializationName${locale === 'is' ? 'Is' : 'En'}`]: query },
        { [`description${locale === 'is' ? 'Is' : 'En'}`]: query },
      ],
    })
  }

  activeFilters.forEach((filter) => {
    const orFilters: Array<any> = []
    filter.value.forEach((searchParam) => {
      orFilters.push({ [filter.key]: searchParam })
    })
    queryMaker.$and.push({ $or: orFilters })
  })

  const result = fuseInstance.search(queryMaker)
  const sortedResults = sortIntoBuckets(result as FuseQueryResult[])

  return [...Object.values(sortedResults)].flat() || []
}

// Function to sort and group objects into buckets and further sortedBuckets
const sortIntoBuckets = (dataArray: FuseQueryResult[]) => {
  const buckets: Bucket = {}

  // Group results into buckets based on the rounded score
  dataArray.forEach((item) => {
    const roundedScore = item.score.toFixed(2)

    if (!buckets[roundedScore]) {
      buckets[roundedScore] = []
    }

    buckets[roundedScore].push(item)
  })

  const orderedBuckets: Bucket = {}

  // For each bucket sort within so each university gets equal represantation
  Object.values(buckets).forEach((bucket, index) => {
    const universityGroups: Record<string, FuseQueryResult[]> = {}
    bucket.forEach((item) => {
      universityGroups[item.item.universityId] =
        universityGroups[item.item.universityId] || []
      universityGroups[item.item.universityId].push(item)
    })

    const keys = Object.keys(universityGroups)

    const maxLength = Math.max(
      ...keys.map((key) => universityGroups[key].length),
    )

    const orderedList: FuseQueryResult[] = []
    for (let i = 0; i < maxLength; i++) {
      for (let j = 0; j < keys.length; j++) {
        const currentKey = keys[j]

        if (i < universityGroups[currentKey].length) {
          const currentItem = universityGroups[currentKey][i]

          orderedList.push(currentItem)
        }
      }
    }

    orderedBuckets[index] = orderedList
  })

  return orderedBuckets
}
