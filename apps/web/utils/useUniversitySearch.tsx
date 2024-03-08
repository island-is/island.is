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

interface FuseQueryResult {
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
  const test = sortIntoBuckets(result as FuseQueryResult[])
  return [...Object.values(test)].flat() || []
}

// Function to sort and group objects into buckets
const sortIntoBuckets = (dataArray: FuseQueryResult[]) => {
  // Initialize an object to store buckets
  const buckets: Bucket = {}

  // Group objects into buckets based on the rounded score
  dataArray.forEach((item) => {
    const roundedScore = item.score.toFixed(2)

    if (!buckets[roundedScore]) {
      buckets[roundedScore] = []
    }

    buckets[roundedScore].push(item)
  })

  console.log('buckets', buckets)

  const orderedBuckets: Bucket = {}

  Object.values(buckets).forEach((bucket, index) => {
    const universityGroups: Record<string, FuseQueryResult[]> = {}
    bucket.forEach((item) => {
      universityGroups[item.item.universityId] =
        universityGroups[item.item.universityId] || []
      universityGroups[item.item.universityId].push(item)
    })

    // Get an array of all keys in the object
    const keys = Object.keys(universityGroups)

    // Find the maximum length among all arrays
    const maxLength = Math.max(
      ...keys.map((key) => universityGroups[key].length),
    )

    const orderedList: FuseQueryResult[] = []
    // Outer loop to iterate over each index up to the maximum length
    for (let i = 0; i < maxLength; i++) {
      // Inner loop to iterate over each key
      for (let j = 0; j < keys.length; j++) {
        const currentKey = keys[j]

        // Check if the current index is within the bounds of the current array
        if (i < universityGroups[currentKey].length) {
          const currentItem = universityGroups[currentKey][i]

          orderedList.push(currentItem)

          // Your action goes here
          // Example: Do something with the current key and item
          // YourFunction(currentKey, currentItem);
        }
      }
    }

    orderedBuckets[index] = orderedList
  })

  return orderedBuckets
}
