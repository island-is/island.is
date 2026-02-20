import { useEffect, useRef, useState } from 'react'
import { useIntl } from 'react-intl'
import { useWindowSize } from 'react-use'
import Fuse from 'fuse.js'

import {
  Box,
  Button,
  Filter,
  FilterMultiChoice,
  GridColumn,
  GridContainer,
  GridRow,
  Icon,
  Input,
  Navigation,
  Pagination,
  Stack,
  Tag,
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
import { m } from './messages'
import { mockFilterOptions, mockProgrammes } from './mockData'
import { StudyCardsGrid } from './StudyCardsGrid'
import { useSecondarySchoolFilters } from './useSecondarySchoolFilters'
import { FuseQueryResult, SearchProgrammes } from './useSecondarySchoolSearch'
import * as styles from './SecondarySchoolStudies.css'
import {
  GET_SECONDARY_SCHOOL_ALL_PROGRAMMES_QUERY,
  GET_SECONDARY_SCHOOL_PROGRAMME_FILTER_OPTIONS_QUERY,
} from '../queries/SecondarySchoolStudies'

const ITEMS_PER_PAGE = 18

interface SecondarySchoolStudiesLandingPageProps {
  programmes: SecondarySchoolAllProgrammesQuery['secondarySchoolAllProgrammes']
  filterOptions: SecondarySchoolProgrammeFilterOptionsQuery['secondarySchoolProgrammeFilterOptions']
}

type SecondarySchoolProgramme =
  SecondarySchoolAllProgrammesQuery['secondarySchoolAllProgrammes'][0]

const SecondarySchoolStudiesLandingPage: Screen<
  SecondarySchoolStudiesLandingPageProps
> = ({ programmes: _programmes, filterOptions }) => {
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
  const [searchTimeoutId, setSearchTimeoutId] =
    useState<ReturnType<typeof setTimeout>>()

  // Initialize original results on mount
  useEffect(() => {
    const sortedResultsWithSchools = _programmes
      .flatMap((programme, index) => {
        // If programme has multiple schools, create separate result for each
        if (programme.schools && programme.schools.length > 1) {
          return programme.schools.map((school, schoolIndex) => ({
            item: {
              ...programme,
              schools: [school], // Single school for this instance
            } as SecondarySchoolProgramme,
            refIndex: index * 100 + schoolIndex, // Unique index
            score: 1,
          }))
        }
        // Single school or no schools
        return [
          {
            item: programme,
            refIndex: index,
            score: 1,
          },
        ]
      })
      .sort(() => Math.random() - 0.5) // Randomize initial order

    setOriginalSortedResults(sortedResultsWithSchools)
  }, [_programmes])

  // Calculate total pages when filtered results change
  useEffect(() => {
    setTotalPages(Math.ceil(filteredResults.length / ITEMS_PER_PAGE))
  }, [filteredResults])

  // Set mounted state after first render
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Fuse.js configuration
  const fuseOptions = {
    threshold: 0.3,
    includeScore: true,
    ignoreLocation: true,
    minMatchCharLength: 3,
    keys: [
      { name: 'title', weight: 2 },
      { name: 'description', weight: 0.75 },
      { name: 'studyTrack.name', weight: 1 },
      { name: 'qualification.title', weight: 1 },
      { name: 'specialization.title', weight: 1 },
      { name: 'schools.name', weight: 0.5 },
      'studyTrack.isced',
      'qualification.level.id',
      'schools.id',
      'schools.countryArea.id',
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

  // Transform programme data to card props
  const transformProgrammeToCard = (programme: SecondarySchoolProgramme) => {
    const school = programme.schools?.[0]
    const detailLines = []

    // Study track / field of study
    if (programme.studyTrack?.name) {
      detailLines.push({
        icon: 'reader' as const,
        text: programme.studyTrack.name,
      })
    }

    // Credits
    if (programme.credits) {
      detailLines.push({
        icon: 'document' as const,
        text: `${programme.credits} einingar`,
      })
    }

    // Qualification level
    if (programme.qualification?.level?.shortDescription) {
      detailLines.push({
        icon: 'school' as const,
        text: programme.qualification.level.shortDescription,
      })
    } else if (programme.qualification?.level?.name) {
      detailLines.push({
        icon: 'school' as const,
        text: programme.qualification.level.name,
      })
    }

    return {
      id: `${programme.id}-${school?.id || 'unknown'}`,
      schoolName: school?.name || 'Óþekktur skóli',
      schoolIcon: <Icon icon="school" color="blue400" size="small" />,
      title: programme.title || 'Óþekkt námsbraut',
      description: programme.description || undefined,
      detailLines,
      href: '#', // TODO: Update with actual link when detail pages exist
    }
  }

  // Get paginated cards
  const getPaginatedCards = () => {
    const startIndex = (selectedPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    const paginatedResults = filteredResults.slice(startIndex, endIndex)

    return paginatedResults.map((result) =>
      transformProgrammeToCard(result.item),
    )
  }

  const handleSearchInput = (value: string) => {
    setSelectedPage(1)
    setSearchTerm(value)
  }

  const handlePageChange = (page: number) => {
    setSelectedPage(page)
    // Scroll to top
    titleRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleClearAll = () => {
    setSelectedPage(1)
    clearAllFilters()
  }

  const handleRemoveFilter = (
    categoryId: keyof typeof selectedFilters,
    value: string,
  ) => {
    setSelectedPage(1)
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
        title={''}
        // title={ogTitle}
        // description={n(
        //   'ogDescription',
        //   'Á Starfatorginu er að finna upplýsingar um laus störf hjá ríkinu.',
        // )}
        // imageUrl={n(
        //   'ogImageUrl',
        //   'https://images.ctfassets.net/8k0h54kbe6bj/5LqU9yD9nzO5oOijpZF0K0/b595e1cf3e72bc97b2f9d869a53f5da9/LE_-_Jobs_-_S3.png',
        // )}
      />

      {/* Header */}
      {!isTablet && (
        <GridContainer>
          <Box>
            <GridRow marginBottom={5}>
              <GridColumn span="1/1">
                <Box
                  position="relative"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  style={{ minHeight: '242px', height: '242px' }}
                >
                  <img
                    src={'/assets/bakgrunnsmynnstur_framhaldskola.svg'}
                    alt=""
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  <Box
                    position="absolute"
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    textAlign="left"
                  >
                    <Box className="rs_read">
                      <Text variant="h1" as="h1" marginBottom={2} color="white">
                        {'Framhaldsskólanám'}
                      </Text>
                      <Text variant="h3" as="h2" color="white">
                        {'Allt framhaldsskólanám á Íslandi á sama stað'}
                      </Text>
                    </Box>
                  </Box>
                  {/* White circle with coat of arms */}
                  <Box
                    position="absolute"
                    style={{
                      width: '120px',
                      height: '120px',
                      borderRadius: '50%',
                      backgroundColor: 'white',
                      bottom: '-60px',
                      left: '160px',
                      transform: 'translateX(-50%)',
                    }}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <img
                      src={'/assets/skjaldarmerki.svg'}
                      alt="Icelandic coat of arms"
                      style={{ width: '80px', height: '80px' }}
                    />
                  </Box>
                </Box>
              </GridColumn>
            </GridRow>
          </Box>
        </GridContainer>
      )}
      {isTablet && (
        <Box>
          <GridRow marginBottom={5}>
            <GridColumn span="1/1">
              <Box
                position="relative"
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <img
                  width={'100%'}
                  src={'/assets/bakgrunnsmynnstur_framhaldskola_tablet.svg'}
                  alt=""
                />
                <Box
                  position="absolute"
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  textAlign="center"
                >
                  <Box className="rs_read">
                    <Text variant="h1" as="h1" marginBottom={2} color="white">
                      {'Framhaldsskólanám'}
                    </Text>
                    <Text variant="h3" as="h2" color="white">
                      {'Allt framhaldsskólanám á Íslandi á sama stað'}
                    </Text>
                  </Box>
                </Box>
              </Box>
            </GridColumn>
          </GridRow>
        </Box>
      )}
      {/* Header ends */}

      {/* Main */}
      <Box>
        {true && (
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
                    <Navigation
                      title={'Tengt efni'}
                      asSpan
                      renderLink={(link, _item) => {
                        return (
                          <a
                            href="https://island.is"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Box
                              display="flex"
                              flexDirection={'row'}
                              justifyContent="spaceBetween"
                              alignItems="center"
                              paddingLeft={2}
                              paddingRight={4}
                            >
                              {link}

                              <Icon
                                color="purple600"
                                type="outline"
                                icon="open"
                                size="small"
                              />
                            </Box>
                          </a>
                        )
                      }}
                      items={[
                        {
                          title: 'Um framhaldskólanám.is',
                        },
                        {
                          title: 'Ég veit ekki hvað ég vil',
                        },
                      ]}
                      baseId={'test'}
                      colorScheme="purple"
                    />
                    <Text variant="h4" as="h4" paddingY={1}>
                      {formatMessage(m.search.search)}
                    </Text>
                    <Filter
                      resultCount={filteredResults.length}
                      variant={'default'}
                      labelClear={formatMessage(m.search.clear)}
                      labelClearAll={formatMessage(m.search.clearAllFilters)}
                      labelOpen={formatMessage(m.search.open)}
                      labelClose={formatMessage(m.search.close)}
                      labelResult={formatMessage(m.search.showResults)}
                      labelTitle={formatMessage(m.search.filterResults)}
                      onFilterClear={handleClearAll}
                    >
                      <FilterMultiChoice
                        labelClear={formatMessage(m.search.clearFilter)}
                        onChange={({ categoryId, selected }) => {
                          setSelectedPage(1)
                          updateFilter(
                            categoryId as keyof typeof selectedFilters,
                            selected,
                          )
                        }}
                        onClear={(categoryId) => {
                          setSelectedPage(1)
                          clearFilter(
                            categoryId as keyof typeof selectedFilters,
                          )
                        }}
                        categories={filterCategories}
                      />
                    </Filter>
                  </Stack>
                </Box>
              )}

              {/* Content */}
              <Box
                flexGrow={1}
                paddingLeft={2}
                className={styles.contentWrapper}
              >
                <Box display={'flex'} flexDirection={'column'} rowGap={4}>
                  {/* Title, searchbar and clear search button */}
                  <Box display={'flex'} rowGap={2} flexDirection={'column'}>
                    <Text ref={titleRef} variant="h2" as="h2" lineHeight="xs">
                      {formatMessage(m.search.searchResults)}
                    </Text>
                    <Input
                      placeholder={formatMessage(m.search.searchPrograms)}
                      id="searchprogrammes"
                      name="filterInput"
                      value={searchTerm}
                      backgroundColor="blue"
                      onChange={(e) => {
                        handleSearchInput(e.target.value)
                        clearTimeout(searchTimeoutId)
                        const timeoutId = setTimeout(() => {
                          // TODO: Add tracking if needed
                          // trackSearchQuery(e.target.value)
                        }, 750)
                        setSearchTimeoutId(timeoutId)
                      }}
                    />
                    <Box display={'flex'} justifyContent={'spaceBetween'}>
                      <Box
                        display={'flex'}
                        style={{ gap: '0.5rem', minHeight: '2rem' }}
                        flexWrap={'wrap'}
                      >
                        {Object.keys(selectedFilters).map((key) =>
                          selectedFilters[
                            key as keyof typeof selectedFilters
                          ].map((value) => (
                            <Tag key={`${key}-${value}`}>
                              <Box
                                display={'flex'}
                                justifyContent={'center'}
                                alignItems={'center'}
                                style={{ gap: '0.5rem' }}
                              >
                                {formatFilterLabel(
                                  key as keyof typeof selectedFilters,
                                  value,
                                )}
                                <button
                                  aria-label="remove tag"
                                  style={{ alignSelf: 'end' }}
                                  onClick={() =>
                                    handleRemoveFilter(
                                      key as keyof typeof selectedFilters,
                                      value,
                                    )
                                  }
                                >
                                  <Icon icon={'close'} size="small" />
                                </button>
                              </Box>
                            </Tag>
                          )),
                        )}
                      </Box>
                      <Box style={{ flexShrink: 0 }}>
                        <Button
                          variant="text"
                          icon="reload"
                          size="small"
                          onClick={handleClearAll}
                        >
                          {formatMessage(m.search.clearAllFilters)}
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                  {/* Search result number and grid vs list view button */}
                  <Box display={'flex'} justifyContent={'spaceBetween'}>
                    <Box>
                      <Text>
                        <strong>{filteredResults.length}</strong> námsbrautir
                        sýnilegar
                      </Text>
                    </Box>
                    {true && (
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

                  {totalPages > 1 && (
                    <Box marginTop={2} paddingBottom={2}>
                      <Pagination
                        variant="blue"
                        page={selectedPage}
                        itemsPerPage={ITEMS_PER_PAGE}
                        totalItems={filteredResults.length}
                        totalPages={totalPages}
                        renderLink={(page, className, children) => (
                          <button
                            aria-label={
                              selectedPage < page ? 'Next' : 'Previous'
                            }
                            onClick={() => {
                              handlePageChange(page)
                            }}
                          >
                            <span className={className}>{children}</span>
                          </button>
                        )}
                      />
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          </GridContainer>
        )}
        {/* Tablet content, Dialog filters */}
        {isTablet && <Box marginX={3} paddingTop={3}></Box>}
      </Box>
      {/* Main ends */}
    </Box>
  )
}

SecondarySchoolStudiesLandingPage.getProps = async ({
  apolloClient,
  locale,
}) => {
  // TODO: Uncomment when API is ready
  // const [programmesResponse, filterOptionsResponse] = await Promise.all([
  //   apolloClient.query<SecondarySchoolAllProgrammesQuery>({
  //     query: GET_SECONDARY_SCHOOL_ALL_PROGRAMMES_QUERY,
  //   }),
  //   apolloClient.query<SecondarySchoolProgrammeFilterOptionsQuery>({
  //     query: GET_SECONDARY_SCHOOL_PROGRAMME_FILTER_OPTIONS_QUERY,
  //   }),
  // ])

  const programmes = mockProgrammes
  const filterOptions = mockFilterOptions
  // const programmes = programmesResponse?.data.secondarySchoolAllProgrammes
  // const filterOptions =
  //   filterOptionsResponse?.data.secondarySchoolProgrammeFilterOptions

  return {
    programmes,
    filterOptions,
  }
}

export default withMainLayout(
  withCustomPageWrapper(
    CustomPageUniqueIdentifier.SecondarySchoolStudies,
    SecondarySchoolStudiesLandingPage,
  ),
  {
    footerVersion: 'organization',
  },
)
