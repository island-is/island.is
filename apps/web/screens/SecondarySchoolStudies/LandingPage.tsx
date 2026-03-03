import { useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { useWindowSize } from 'react-use'
import Fuse from 'fuse.js'

import {
  Box,
  Button,
  GridContainer,
  Pagination,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { HeadWithSocialSharing } from '@island.is/web/components'
import {
  CustomPageUniqueIdentifier,
  SecondarySchoolAllProgrammesQuery,
  SecondarySchoolProgrammeFilterOptionsQuery,
} from '@island.is/web/graphql/schema'
import { withMainLayout } from '@island.is/web/layouts/main'
import { Screen } from '@island.is/web/types'

import { withCustomPageWrapper } from '../CustomPage/CustomPageWrapper'
import {
  GET_SECONDARY_SCHOOL_ALL_PROGRAMMES_QUERY,
  GET_SECONDARY_SCHOOL_PROGRAMME_FILTER_OPTIONS_QUERY,
} from '../queries/SecondarySchoolStudies'
import { useSecondarySchoolFilters } from './hooks/useSecondarySchoolFilters'
import {
  FuseQueryResult,
  SearchProgrammes,
} from './hooks/useSecondarySchoolSearch'
import { m } from './messages/messages'
import { transformProgrammeToCard } from './utils/transformProgramme'
import {
  FilterSection,
  Footer,
  Header,
  MobileFooter,
  SearchSection,
  StudyCardsGrid,
} from './components'
import * as styles from './SecondarySchoolStudies.css'

const ITEMS_PER_PAGE = 18

const getDeterministicWeight = (value: string) => {
  let hash = 0

  for (let index = 0; index < value.length; index++) {
    hash = (hash * 31 + value.charCodeAt(index)) % 2147483647
  }

  return hash
}

interface SecondarySchoolStudiesLandingPageProps {
  programmes: SecondarySchoolAllProgrammesQuery['secondarySchoolAllProgrammes']
  filterOptions: SecondarySchoolProgrammeFilterOptionsQuery['secondarySchoolProgrammeFilterOptions']
  hourlySeed: string
}

const SecondarySchoolStudiesLandingPage: Screen<
  SecondarySchoolStudiesLandingPageProps
> = ({ programmes, filterOptions, hourlySeed }) => {
  const { formatMessage } = useIntl()

  const [isMounted, setIsMounted] = useState(false)
  const [isGridView, setIsGridView] = useState(true)
  const { width } = useWindowSize()

  const isTablet = isMounted && width <= theme.breakpoints.lg

  const pathname = '/framhaldsskolanam'

  const {
    selectedFilters,
    searchTerm,
    setSearchTerm,
    updateFilter,
    clearFilter,
    clearAllFilters,
    filterCategories,
  } = useSecondarySchoolFilters(filterOptions, pathname)

  const [selectedPage, setSelectedPage] = useState(1)
  const [originalSortedResults, setOriginalSortedResults] = useState<
    Array<FuseQueryResult>
  >([])
  const [filteredResults, setFilteredResults] = useState<
    Array<FuseQueryResult>
  >([])
  const [totalPages, setTotalPages] = useState<number>(0)
  const titleRef = useRef<HTMLDivElement>(null)
  const [inputValue, setInputValue] = useState(searchTerm)

  // Initialize original results on mount
  useEffect(() => {
    const sortedResultsWithSchools = programmes
      .flatMap((programme, index) => {
        return [
          {
            item: programme,
            refIndex: index,
            score: 1,
          },
        ]
      })
      .sort((left, right) => {
        const leftWeight = getDeterministicWeight(
          `${hourlySeed}:${left.item.id ?? left.refIndex}`,
        )
        const rightWeight = getDeterministicWeight(
          `${hourlySeed}:${right.item.id ?? right.refIndex}`,
        )

        if (leftWeight === rightWeight) {
          return left.refIndex - right.refIndex
        }

        return leftWeight - rightWeight
      })

    setOriginalSortedResults(sortedResultsWithSchools)
  }, [hourlySeed, programmes])

  // Calculate total pages when filtered results change
  useEffect(() => {
    setTotalPages(Math.ceil(filteredResults.length / ITEMS_PER_PAGE))
  }, [filteredResults])

  // Set mounted state after first render
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Debounce search input
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchTerm(inputValue)
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [inputValue, setSearchTerm])

  // Sync inputValue with searchTerm from URL on mount
  useEffect(() => {
    setInputValue(searchTerm)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm])

  // Fuse.js configuration
  const fuseOptions = {
    threshold: 0.3,
    includeScore: true,
    ignoreLocation: true,
    minMatchCharLength: 3,
    keys: [
      { name: 'title', weight: 2 },
      { name: 'specialization.title', weight: 1 },
      'qualification.level.id',
      'school.id',
      'school.countryArea.id',
    ],
  }

  // Run search and filter when dependencies change
  useEffect(() => {
    if (originalSortedResults.length === 0) return

    const fuseInstance = new Fuse(
      originalSortedResults.map((item) => item.item),
      fuseOptions,
    )

    const activeFiltersFound: Array<{ key: string; value: Array<string> }> = []
    Object.keys(selectedFilters).forEach((key) => {
      const filterKey = key as keyof typeof selectedFilters
      if (selectedFilters[filterKey].length > 0) {
        activeFiltersFound.push({
          key,
          value: selectedFilters[filterKey],
        })
      }
    })

    // Reset to page 1 when filters or search changes
    setSelectedPage(1)

    // If no filters and no search term, show all results
    if (searchTerm === '' && activeFiltersFound.length === 0) {
      setFilteredResults(originalSortedResults)
    } else {
      const results = SearchProgrammes({
        fuseInstance,
        query: searchTerm.trim(),
        activeFilters: activeFiltersFound,
      })

      setFilteredResults(results)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFilters, searchTerm, originalSortedResults])

  // Get paginated cards
  const getPaginatedCards = () => {
    const startIndex = (selectedPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    const paginatedResults = filteredResults.slice(startIndex, endIndex)

    return paginatedResults.map((result) => ({
      ...transformProgrammeToCard(result.item),
      uniqueKey: `${result.refIndex}-${result.item.id}`,
    }))
  }

  const handleSearchInput = (value: string) => {
    setInputValue(value)
  }

  const handlePageChange = (page: number) => {
    setSelectedPage(page)
    // Scroll to top
    titleRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleClearAll = () => {
    setInputValue('')
    clearAllFilters()
  }

  const handleRemoveFilter = (
    categoryId: keyof typeof selectedFilters,
    value: string,
  ) => {
    const currentValues = selectedFilters[categoryId]
    const updatedValues = currentValues.filter((v) => v !== value)
    updateFilter(categoryId, updatedValues)
  }

  const formatFilterLabel = (
    categoryId: keyof typeof selectedFilters,
    value: string,
  ) => {
    const category = filterCategories.find((cat) => cat.id === categoryId)
    const filter = category?.filters.find((f) => f.value === value)
    return filter?.label || value
  }

  return (
    <Box>
      <HeadWithSocialSharing
        title={formatMessage(m.home.metaTitle)}
        description={formatMessage(m.home.metaDescription)}
      />

      <Header isTablet={isTablet} />

      {/* Main */}
      <Box>
        <GridContainer>
          <Box
            display="flex"
            flexDirection="row"
            height="full"
            paddingY={6}
            position="relative"
          >
            {/* Sidebar */}
            {!isTablet && (
              <Box
                printHidden
                display={['none', 'none', 'block']}
                position="sticky"
                alignSelf="flexStart"
                className={styles.sidebar}
                style={{ top: 72 }}
              >
                <Stack space={3}>
                  <Text variant="h4" as="h4" paddingY={1}>
                    {formatMessage(m.search.search)}
                  </Text>
                  <FilterSection
                    variant="default"
                    filterCategories={filterCategories}
                    selectedFilters={selectedFilters}
                    updateFilter={updateFilter}
                    clearFilter={clearFilter}
                    handleClearAll={handleClearAll}
                    resultCount={filteredResults.length}
                    formatMessage={formatMessage}
                  />
                </Stack>
              </Box>
            )}

            {/* Content */}
            <Box flexGrow={1} paddingLeft={2} className={styles.contentWrapper}>
              <Box display={'flex'} flexDirection={'column'} rowGap={4}>
                {/* Mobile filter button */}
                {isTablet && (
                  <Box className={styles.mobileFilterButton}>
                    <FilterSection
                      variant="dialog"
                      filterCategories={filterCategories}
                      selectedFilters={selectedFilters}
                      updateFilter={updateFilter}
                      clearFilter={clearFilter}
                      handleClearAll={handleClearAll}
                      resultCount={filteredResults.length}
                      formatMessage={formatMessage}
                    />
                  </Box>
                )}

                <SearchSection
                  titleRef={titleRef}
                  inputValue={inputValue}
                  handleSearchInput={handleSearchInput}
                  selectedFilters={selectedFilters}
                  formatFilterLabel={formatFilterLabel}
                  handleRemoveFilter={handleRemoveFilter}
                  handleClearAll={handleClearAll}
                  formatMessage={formatMessage}
                />
                {/* Search result number and grid vs list view button */}
                <Box display={'flex'} justifyContent={'spaceBetween'}>
                  <Box>
                    <Text>
                      <strong>{filteredResults.length}</strong>{' '}
                      {formatMessage(m.search.programmesVisible)}
                    </Text>
                  </Box>
                  {!isTablet && (
                    <Button
                      variant="utility"
                      icon={isGridView ? 'menu' : 'gridView'}
                      iconType="filled"
                      colorScheme="white"
                      size="small"
                      onClick={() => setIsGridView(!isGridView)}
                    >
                      {isGridView
                        ? formatMessage(m.general.displayList)
                        : formatMessage(m.general.displayGrid)}
                    </Button>
                  )}
                </Box>
                <Box
                  style={{ minHeight: '100vh' }}
                  className={styles.studyCardsWrapper}
                >
                  <StudyCardsGrid
                    isGridView={isGridView}
                    cards={getPaginatedCards()}
                  />
                </Box>

                <Box marginTop={2} paddingBottom={2}>
                  <Pagination
                    variant="blue"
                    page={selectedPage}
                    itemsPerPage={ITEMS_PER_PAGE}
                    totalItems={filteredResults.length}
                    totalPages={totalPages}
                    renderLink={(page, className, children) => (
                      <button
                        aria-label={selectedPage < page ? 'Next' : 'Previous'}
                        onClick={() => {
                          handlePageChange(page)
                        }}
                      >
                        <span className={className}>{children}</span>
                      </button>
                    )}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        </GridContainer>
      </Box>
      {/* Main ends */}
      {isTablet ? <MobileFooter /> : <Footer />}
    </Box>
  )
}

SecondarySchoolStudiesLandingPage.getProps = async ({
  apolloClient,
  locale: _locale,
}) => {
  const [programmesResponse, filterOptionsResponse] = await Promise.all([
    apolloClient.query<SecondarySchoolAllProgrammesQuery>({
      query: GET_SECONDARY_SCHOOL_ALL_PROGRAMMES_QUERY,
    }),
    apolloClient.query<SecondarySchoolProgrammeFilterOptionsQuery>({
      query: GET_SECONDARY_SCHOOL_PROGRAMME_FILTER_OPTIONS_QUERY,
    }),
  ])

  const programmes = programmesResponse?.data.secondarySchoolAllProgrammes
  const filterOptions =
    filterOptionsResponse?.data.secondarySchoolProgrammeFilterOptions

  const now = new Date()
  const hourlySeed = [
    now.getUTCFullYear(),
    String(now.getUTCMonth() + 1).padStart(2, '0'),
    String(now.getUTCDate()).padStart(2, '0'),
    String(now.getUTCHours()).padStart(2, '0'),
  ].join('')

  return {
    programmes,
    filterOptions,
    hourlySeed,
    languageToggleHrefOverride: {
      is: '/framhaldsskolanam',
      en: '/en/secondary-school-studies',
    },
  }
}

export default withMainLayout(
  withCustomPageWrapper(
    CustomPageUniqueIdentifier.SecondarySchoolStudies,
    SecondarySchoolStudiesLandingPage,
  ),
  {
    footerVersion: 'organization',
    showSearchInHeader: false,
  },
)
