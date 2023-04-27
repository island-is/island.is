export const getDefaultFilters = () => {
  if (typeof window !== 'undefined') {
    const filtersFromLocalStorage = localStorage.getItem('filtersAdvice')
    if (filtersFromLocalStorage) {
      return JSON.parse(filtersFromLocalStorage)
    }
  }

  const filters = {
    searchQuery: '',
    oldestFirst: false,
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem('filtersAdvice', JSON.stringify(filters))
  }

  return filters
}

export default getDefaultFilters
