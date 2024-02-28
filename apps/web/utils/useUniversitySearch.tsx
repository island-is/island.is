import Fuse from 'fuse.js'

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

interface QueryMakerProps {
  $and: Array<any>
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

  return result
}
