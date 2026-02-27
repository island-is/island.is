import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useDebounce, useWindowSize } from 'react-use'
import { useQuery } from '@apollo/client'

import { Box, GridContainer } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import {
  GetNamespaceQuery,
  QueryGetNamespaceArgs,
} from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import { withMainLayout } from '@island.is/web/layouts/main'
import { Screen } from '@island.is/web/types'

import SidebarLayout from '../../Layouts/SidebarLayout'
import { GET_NAMESPACE_QUERY } from '../../queries/Namespace'
import { GET_OPEN_DATA_DATASETS, GET_OPEN_DATA_FILTERS } from '../queries'
import {
  DataItem,
  DatasetList,
  FilterSidebar,
  HeroSection,
  SearchSection,
} from './components'
import * as styles from './Index.css'

interface OpenDataProps {
  namespace: Record<string, string>
}

interface FilterOption {
  value: string
  label: string
}

interface FilterCategory {
  id?: string
  field: string
  label: string
  options?: Array<FilterOption | string>
}

type FilterProps = Record<string, Array<string>>

const ITEMS_PER_PAGE = 12

const formatDate = (dateString: string): string => {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('is-IS', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return dateString
  }
}

const initialFilters: FilterProps = {}

const OpenDataPage: Screen<OpenDataProps> = ({ namespace }) => {
  const { width } = useWindowSize()
  const n = useNamespace(namespace)

  // Track if component has mounted to avoid hydration mismatch
  const [hasMounted, setHasMounted] = useState(false)

  // Use consistent values during SSR, then update on client
  const isMobileScreenWidth = hasMounted && width < theme.breakpoints.lg
  const isTabletScreenWidth = hasMounted && width < theme.breakpoints.xl

  const [selectedPage, setSelectedPage] = useState(1)
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [filters, setFilters] = useState<FilterProps>(initialFilters)
  const [gridView, setGridView] = useState<boolean>(true)
  const titleRef = useRef<HTMLDivElement>(null)

  // Debounce the search query to avoid too many API calls
  useDebounce(
    () => {
      setDebouncedQuery(query)
      setSelectedPage(1) // Reset to page 1 when search changes
    },
    300,
    [query],
  )

  // Set mounted state after hydration
  useEffect(() => {
    setHasMounted(true)
  }, [])

  // Fetch datasets with GraphQL
  const { data, loading, error } = useQuery(GET_OPEN_DATA_DATASETS, {
    variables: {
      input: {
        searchQuery: debouncedQuery || undefined,
        categories: filters.category?.length > 0 ? filters.category : undefined,
        publishers:
          filters.publisher?.length > 0 ? filters.publisher : undefined,
        formats: filters.format?.length > 0 ? filters.format : undefined,
        page: selectedPage,
        limit: ITEMS_PER_PAGE,
      },
    },
    fetchPolicy: 'network-only',
  })

  // Fetch filters
  const { data: filtersData } = useQuery(GET_OPEN_DATA_FILTERS, {
    fetchPolicy: 'cache-first',
  })

  const datasets: DataItem[] = data?.openDataDatasets?.datasets || []
  const totalCount = data?.openDataDatasets?.total || 0
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)
  const filterOptions: FilterCategory[] = useMemo(
    () => filtersData?.openDataFilters || [],
    [filtersData?.openDataFilters],
  )

  // Load view preference from localStorage after mount
  useEffect(() => {
    const viewChoice = localStorage.getItem('openDataViewChoice')
    if (viewChoice) {
      setGridView(viewChoice === 'true')
    }
  }, [])

  // Save view preference to localStorage only after initial mount
  useEffect(() => {
    if (hasMounted) {
      localStorage.setItem('openDataViewChoice', gridView ? 'true' : 'false')
    }
  }, [gridView, hasMounted])

  // Filter handlers
  const handleFilterType = (filterKey: string, filterValues: string[]) => {
    setSelectedPage(1)
    setFilters({ ...filters, [filterKey]: filterValues })
  }

  const handleFilters = (
    filterKey: string,
    filterValue: string,
    _checked: boolean,
  ) => {
    setSelectedPage(1)
    const currentValues = filters[filterKey] || []

    if (currentValues.includes(filterValue)) {
      const specificArray = currentValues.filter((v) => v !== filterValue)
      setFilters({ ...filters, [filterKey]: specificArray })
    } else {
      setFilters({
        ...filters,
        [filterKey]: [...currentValues, filterValue],
      })
    }
  }

  const clearFilterType = (filterKey: string) => {
    setFilters({ ...filters, [filterKey]: [] })
  }

  const clearAllFilters = () => {
    setFilters(initialFilters)
    setQuery('')
  }

  const handleRemoveTag = (filterKey: string, value: string) => {
    const specificArray = (filters[filterKey] || []).filter((v) => v !== value)
    setFilters({ ...filters, [filterKey]: specificArray })
  }

  // Filter accordion state
  const [isOpen, setIsOpen] = useState<Array<boolean>>(() =>
    filterOptions.map((_, i) => i < 2),
  )

  useEffect(() => {
    if (filterOptions.length > 0) {
      setIsOpen(filterOptions.map((_, i) => i < 2))
    }
  }, [filterOptions])

  const toggleIsOpen = (index: number, value: boolean) => {
    const newIsOpen = isOpen.map((x, i) => (i === index ? value : x))
    setIsOpen(newIsOpen)
  }

  const toggleOpenAll = () => {
    setIsOpen(filterOptions.map(() => true))
  }

  const toggleCloseAll = () => {
    setIsOpen(filterOptions.map(() => false))
  }

  const areAnyFiltersOpen = () => {
    return isOpen.some((x) => x === true)
  }

  return (
    <Box>
      <HeroSection n={n} />

      <GridContainer>
        <SidebarLayout
          paddingTop={[2, 2, 9]}
          paddingBottom={[4, 4, 4]}
          isSticky={false}
          fullWidthContent={true}
          sidebarContent={
            <FilterSidebar
              filterOptions={filterOptions}
              filters={filters}
              isOpen={isOpen}
              onFilterChange={handleFilters}
              onClearFilterType={clearFilterType}
              onClearAllFilters={clearAllFilters}
              onToggleIsOpen={toggleIsOpen}
              onToggleOpenAll={toggleOpenAll}
              onToggleCloseAll={toggleCloseAll}
              areAnyFiltersOpen={areAnyFiltersOpen}
              n={n}
            />
          }
        >
          <Box minWidth={0} className={styles.mainContentWrapper}>
            <SearchSection
              query={query}
              onQueryChange={setQuery}
              filters={filters}
              filterOptions={filterOptions}
              onRemoveTag={handleRemoveTag}
              onClearAllFilters={clearAllFilters}
              onFilterTypeChange={handleFilterType}
              onClearFilterType={clearFilterType}
              totalCount={totalCount}
              n={n}
              titleRef={titleRef}
            />

            <DatasetList
              datasets={datasets}
              loading={loading}
              error={error}
              totalCount={totalCount}
              totalPages={totalPages}
              selectedPage={selectedPage}
              onPageChange={setSelectedPage}
              gridView={gridView}
              onToggleView={() => setGridView(!gridView)}
              formatDate={formatDate}
              n={n}
              isMobileScreenWidth={isMobileScreenWidth}
              isTabletScreenWidth={isTabletScreenWidth}
              titleRef={titleRef}
              itemsPerPage={ITEMS_PER_PAGE}
            />
          </Box>
        </SidebarLayout>
      </GridContainer>
    </Box>
  )
}

OpenDataPage.getProps = async ({ apolloClient, locale }) => {
  const namespaceResponse = await apolloClient.query<
    GetNamespaceQuery,
    QueryGetNamespaceArgs
  >({
    query: GET_NAMESPACE_QUERY,
    variables: {
      input: {
        lang: locale,
        namespace: 'OpenData',
      },
    },
  })

  const namespace = JSON.parse(
    namespaceResponse?.data?.getNamespace?.fields || '{}',
  ) as Record<string, string>

  return {
    namespace,
  }
}

export default withMainLayout(OpenDataPage)
