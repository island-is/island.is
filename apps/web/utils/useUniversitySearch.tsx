import Fuse from 'fuse.js'

interface FilterProps {
  key: string
  value: Array<string>
}

interface SearchProductsProps {
  fuseInstance: Fuse<any>
  query?: string
  activeFilters: Array<FilterProps>
}

interface QueryMakerProps {
  $and: Array<any>
}
export const SearchProducts = ({
  fuseInstance,
  query,
  activeFilters,
}: SearchProductsProps) => {
  const queryMaker: QueryMakerProps = { $and: [] }

  if (query) {
    queryMaker.$and.push({
      $or: [
        { nameIs: query },
        { departmentNameIs: query },
        { descriptionIs: query },
      ],
    })
  }

  activeFilters.map((filter) => {
    const orFilters: Array<any> = []
    filter.value.map((searchParam) => {
      orFilters.push({ [filter.key]: searchParam })
    })
    queryMaker.$and.push({ $or: orFilters })
  })

  const result = fuseInstance.search(queryMaker)

  return result
}
