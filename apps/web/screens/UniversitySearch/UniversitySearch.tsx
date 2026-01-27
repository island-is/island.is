import { useEffect, useRef, useState } from 'react'
import Fuse from 'fuse.js'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client/react/hooks/useQuery'

import {
  Accordion,
  AccordionItem,
  Box,
  Button,
  Checkbox,
  ContentBlock,
  Filter,
  FilterMultiChoice,
  GridColumn,
  GridContainer,
  GridRow,
  Hidden,
  Icon,
  Inline,
  Input,
  Navigation,
  NavigationItem,
  Pagination,
  SkeletonLoader,
  Stack,
  Tag,
  Text,
  VisuallyHidden,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import {
  haskolanamCardClicked,
  haskolanamFilterClicked,
  haskolanamTrackSearchQuery,
} from '@island.is/plausible'
import {
  ActionCategoryCard,
  CTAProps,
  ListViewCard,
  OrganizationFooter,
  OrganizationHeader,
  Webreader,
} from '@island.is/web/components'
import {
  ContentLanguage,
  GetNamespaceQuery,
  GetNamespaceQueryVariables,
  GetUniversityGatewayProgramFiltersQuery,
  GetUniversityGatewayUniversitiesQuery,
  Query,
  QueryGetOrganizationPageArgs,
  UniversityGatewayProgram,
  UniversityGatewayProgramFilter,
  UniversityGatewayUniversity,
} from '@island.is/web/graphql/schema'
import { useLinkResolver, useNamespace } from '@island.is/web/hooks'
import { useWindowSize } from '@island.is/web/hooks/useViewport'
import { withMainLayout } from '@island.is/web/layouts/main'
import { Screen } from '@island.is/web/types'
import { CustomNextError } from '@island.is/web/units/errors'
import {
  FuseQueryResult,
  SearchProducts,
} from '@island.is/web/utils/useUniversitySearch'

import SidebarLayout from '../Layouts/SidebarLayout'
import { GET_NAMESPACE_QUERY, GET_ORGANIZATION_PAGE_QUERY } from '../queries'
import {
  GET_UNIVERSITY_GATEWAY_FILTERS,
  GET_UNIVERSITY_GATEWAY_PROGRAM_LIST,
  GET_UNIVERSITY_GATEWAY_UNIVERSITIES,
} from '../queries/UniversityGateway'
import { TranslationDefaults } from './TranslationDefaults'
import * as organizationStyles from '../../components/Organization/Wrapper/OrganizationWrapper.css'
import * as styles from './UniversitySearch.css'

const ITEMS_PER_PAGE = 18
const NUMBER_OF_FILTERS = 6

interface UniversitySearchProps {
  namespace: Record<string, string>
  filterOptions: Array<UniversityGatewayProgramFilter>
  locale: string
  universities: Array<UniversityGatewayUniversity>
  organizationPage?: Query['getOrganizationPage']
  searchQuery: string
  filtersFromQuery: FilterProps
}

interface FilterProps {
  applicationStatus: Array<string>
  degreeType: Array<string>
  modeOfDelivery: Array<string>
  universityId: Array<string>
  durationInYears: Array<string>
  startingSemesterSeason: Array<string>
}

const initialFilters: FilterProps = {
  applicationStatus: [],
  degreeType: [],
  modeOfDelivery: [],
  durationInYears: [],
  universityId: [],
  startingSemesterSeason: [],
}

const stripHtml = (html: string) => {
  const tmp = document.createElement('DIV')
  tmp.innerHTML = html
  return tmp.textContent || tmp.innerText || ''
}

interface UniversityProgramsQuery {
  universityGatewayPrograms: {
    data: Array<UniversityGatewayProgram>
  }
}
interface UniversityGatewayProgramWithStatus extends UniversityGatewayProgram {
  applicationStatus: string
}

const UniversitySearch: Screen<UniversitySearchProps> = ({
  filterOptions,
  namespace,
  searchQuery,
  filtersFromQuery,
  locale,
  organizationPage,
  universities,
}) => {
  const { data, loading } = useQuery<UniversityProgramsQuery>(
    GET_UNIVERSITY_GATEWAY_PROGRAM_LIST,
    { ssr: false },
  )

  const router = useRouter()
  const { width } = useWindowSize()
  const n = useNamespace(namespace)
  const isMobileScreenWidth = width < theme.breakpoints.lg
  const isTabletScreenWidth = width < theme.breakpoints.xl

  const [selectedPage, setSelectedPage] = useState(1)
  const [query, setQuery] = useState(searchQuery || '')
  const searchTermHasBeenInitialized = useRef(false)
  const [originalSortedResults, setOriginalSortedList] = useState<
    Array<FuseQueryResult>
  >([])
  const [filteredResults, setFilteredResults] = useState<
    Array<FuseQueryResult>
  >([])
  const [gridView, setGridView] = useState<boolean>(true)
  const { linkResolver } = useLinkResolver()
  const [totalPages, setTotalPages] = useState<number>(0)
  const [filters, setFilters] = useState<FilterProps>(filtersFromQuery)
  const titleRef = useRef<HTMLDivElement>(null)
  const [searchTimeoutId, setSearchTimeoutId] =
    useState<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    if (!loading) {
      const sortedResultsWithStatus = [
        ...(data?.universityGatewayPrograms.data as UniversityGatewayProgram[]),
      ]
        .sort(() => Math.random() - 0.5)
        .map((item: UniversityGatewayProgram, index: number) => {
          const itemWithStatus = {
            ...item,
            applicationStatus: item.applicationPeriodOpen ? 'OPEN' : 'CLOSED',
          }
          return { item: itemWithStatus, refIndex: index, score: 1 }
        })

      setOriginalSortedList(sortedResultsWithStatus)
    }
  }, [data, loading])

  useEffect(() => {
    if (!filterOptions) return

    // Re-ordering filters.
    const index = filterOptions.findIndex(
      (filter) => filter.field === 'universityId',
    )

    if (index !== -1) {
      const movedField = filterOptions.splice(index, 1)[0]

      const universityTitlesMap = new Map()
      universities.forEach((uni) => {
        universityTitlesMap.set(uni.id, {
          is: uni.contentfulTitle || '',
          en: uni.contentfulTitleEn || '',
        })
      })

      movedField.options.sort((x, y) => {
        const titleX = universityTitlesMap.get(x)?.[locale] || ''
        const titleY = universityTitlesMap.get(y)?.[locale] || ''

        return titleX.localeCompare(titleY, locale)
      })
      filterOptions.splice(2, 0, movedField)
      const lastElement = filterOptions[filterOptions.length - 1]
      filterOptions[filterOptions.length - 1] =
        filterOptions[filterOptions.length - 2]
      filterOptions[filterOptions.length - 2] = lastElement
    }
  }, [filterOptions, universities, locale])

  useEffect(() => {
    setTotalPages(Math.ceil(filteredResults.length / ITEMS_PER_PAGE))
  }, [filteredResults])

  useEffect(() => {
    const viewChoice = localStorage.getItem('viewChoice')

    if (viewChoice) {
      setGridView(viewChoice === 'true' ? true : false)
    }
  }, [])

  const fuseOptions = {
    threshold: 0.1,
    includeScore: true,
    ignoreLocation: true,
    minMatchCharLength: 3,
    keys: [
      {
        name: `name${locale === 'is' ? 'Is' : 'En'}`,
        weight: 2,
      },
      {
        name: `specializationName${locale === 'is' ? 'Is' : 'En'}`,
        weight: 0.75,
      },
      {
        name: `description${locale === 'is' ? 'Is' : 'En'}`,
        weight: 0.75,
      },
      'degreeType',
      'modeOfDelivery',
      'startingSemesterSeason',
      'durationInYears',
      'universityId',
      'applicationStatus',
    ],
  }

  const resetFilteredList = () => {
    setFilteredResults(originalSortedResults)
  }

  useEffect(() => {
    if (loading) return
    if (query[query.length - 1] === '´') return

    let fuseInstance: Fuse<UniversityGatewayProgram> = new Fuse([], fuseOptions)
    if (originalSortedResults.length > 0) {
      fuseInstance = new Fuse(
        originalSortedResults.map((item: FuseQueryResult) => {
          return item.item
        }) || [],
        fuseOptions,
      )
    }

    const activeFiltersFound: Array<{ key: string; value: Array<string> }> = []
    Object.keys(filters).forEach((key) => {
      const str = key as keyof typeof filters
      if (filters[str].length > 0) {
        activeFiltersFound.push({ key, value: filters[str] })
      }
    })
    //if no filters are active, then show no products
    if (query === '' && activeFiltersFound.length === 0) {
      resetFilteredList()
    } else {
      const results = SearchProducts({
        fuseInstance,
        query: query.trim(),
        activeFilters: activeFiltersFound,
        locale,
      })

      setFilteredResults(results)
    }
  }, [filters, query, data, loading, originalSortedResults, locale])

  const applicationUrlParser = (universityId: string) => {
    const university =
      universities.filter((uni) => uni.id === universityId)[0]
        ?.contentfulTitle || ''

    switch (university) {
      case 'Háskóli Íslands':
        return 'https://ugla.hi.is/namsumsoknir/'
      case 'Háskólinn á Akureyri':
        return 'https://ugla.unak.is/namsumsoknir/'
      case 'Háskólinn á Bifröst':
        return 'https://ugla.bifrost.is/namsumsoknir/index.php'
      case 'Háskólinn á Hólum':
        return 'https://ugla.holar.is/namsumsoknir/'
      case 'Háskólinn í Reykjavík':
        return 'https://umsoknir.ru.is/'
      case 'Landbúnaðarháskóli Íslands':
        return 'https://ugla.lbhi.is/namsumsoknir/'
      case 'Listaháskóli Íslands':
        return 'https://ugla.lhi.is/namsumsoknir/'
      default:
        return '/'
    }
  }

  const createPrimaryCTA = (item: UniversityGatewayProgramWithStatus) => {
    const CTA: CTAProps = {
      label: n('apply', 'Sækja um'),
      variant: 'primary',
      size: 'small',
      icon: 'arrowForward',
      iconType: 'outline',
      disabled: !item.applicationPeriodOpen,
      href: applicationUrlParser(item.universityId),
    }
    return CTA
  }

  const handleFilterType = (filterKey: string, filterValues: string[]) => {
    setSelectedPage(1)
    setFilters({ ...filters, [filterKey]: filterValues })

    // Update query params
    const currentQueryParams = router.query
    const { [filterKey]: prevFilterKeyValues, ...restParams } =
      currentQueryParams

    router.push(
      {
        pathname: router.pathname,
        query: {
          ...restParams,
          [filterKey]: filterValues,
        },
      },
      undefined,
      {
        shallow: true,
      },
    )
  }

  const handleFilters = (
    filterKey: string,
    filterValue: string,
    checked: boolean,
  ) => {
    setSelectedPage(1)

    // Set state
    const str = filterKey as keyof typeof filters
    if (filters[str].includes(filterValue)) {
      const index = filters[str].indexOf(filterValue)
      const specificArray = filters[str]
      specificArray.splice(index, 1)
      setFilters({ ...filters, [filterKey]: specificArray })
    } else {
      setFilters({
        ...filters,
        [filterKey]: [...filters[str], filterValue],
      })
    }

    // Update query params
    const currentQueryParams = router.query
    const { [filterKey]: prevFilterKeyValues, ...restParams } =
      currentQueryParams

    let updatedQueryParams = {}
    if (!prevFilterKeyValues) {
      // No previous value
      updatedQueryParams = {
        ...restParams,
        ...(checked && { [filterKey]: filterValue }),
      }
    } else if (Array.isArray(prevFilterKeyValues)) {
      // More than one prev value
      const updatedValues = checked
        ? [...prevFilterKeyValues, filterValue]
        : prevFilterKeyValues.filter((value) => value !== filterValue)

      updatedQueryParams = {
        ...restParams,
        ...(updatedValues.length > 0 && { [filterKey]: updatedValues }),
      }
    } else {
      // one prev value
      updatedQueryParams = {
        ...restParams,
        ...(checked && { [filterKey]: [prevFilterKeyValues, filterValue] }),
      }
    }

    router.push(
      {
        pathname: router.pathname,
        query: updatedQueryParams,
      },
      undefined,
      {
        shallow: true,
      },
    )
  }

  const clearFilterType = (filterKey: string) => {
    setFilters({ ...filters, [filterKey]: [] })

    const currentQueryParams = router.query
    const { [filterKey]: _, ...restParams } = currentQueryParams
    const updatedQueryParams = {
      ...restParams,
    }

    router.push(
      {
        pathname: router.pathname,
        query: updatedQueryParams,
      },
      undefined,
      {
        shallow: true,
      },
    )
  }

  useEffect(() => {
    localStorage.setItem('viewChoice', gridView ? 'true' : 'false')
  }, [gridView])

  const predefinedFilterOpenings: Array<boolean> = []
  for (let x = 0; x < NUMBER_OF_FILTERS; x++) {
    predefinedFilterOpenings.push(true)
  }

  const [isOpen, setIsOpen] = useState<Array<boolean>>(predefinedFilterOpenings)

  const toggleIsOpen = (index: number, value: boolean) => {
    const newIsOpen = isOpen.map((x, i) => {
      if (i === index) {
        return value
      } else return x
    })

    setIsOpen(newIsOpen)
  }

  const toggleOpenAll = () => {
    setIsOpen(predefinedFilterOpenings)
  }

  const toggleCloseAll = () => {
    const newIsOpen = isOpen.map(() => {
      return false
    })
    setIsOpen(newIsOpen)
  }

  const navList: NavigationItem[] =
    organizationPage?.menuLinks.map(({ primaryLink, childrenLinks }) => ({
      title: primaryLink?.text ?? '',
      href: primaryLink?.url,
      active: primaryLink?.url === router.pathname,
      items: childrenLinks.map(({ text, url }) => ({
        title: text,
        href: url,
      })),
    })) ?? []

  const formatModeOfDelivery = (items: string[]): string => {
    items = items.filter((item) => {
      return item !== 'UNDEFINED' ? true : false
    })

    const length = items.length

    if (length === 0) {
      return ''
    }

    if (length === 1) {
      return n(items[0], TranslationDefaults[items[0]])
    }

    if (length === 2) {
      return `${n(items[0], TranslationDefaults[items[0]])} ${n(
        'or',
        'eða',
      )} ${n(items[1], TranslationDefaults[items[1]])}`
    }

    const formattedList = items.map((item, index) => {
      if (index === length - 1) {
        return `${n('or', 'eða')} ${n(item, TranslationDefaults[item])}`
      } else {
        return `${n(item, TranslationDefaults[item])}, `
      }
    })

    return formattedList.join('')
  }

  const formatFilterStrings = (tag: string, field: string) => {
    if (field === 'universityId') {
      if (locale === 'is')
        return (
          universities.filter((x) => x.id === tag)[0]?.contentfulTitle || ''
        )
      else
        return (
          universities.filter((x) => x.id === tag)[0]?.contentfulTitleEn || ''
        )
    } else if (tag === 'OPEN') {
      return `${n('openForApplication', 'Opið fyrir umsóknir')}`
    } else {
      return n(tag, TranslationDefaults[tag])
    }
  }

  const areFiltersOpen = () => {
    return isOpen.filter((x) => x === false).length > 0
  }

  const loadSkeletons = () => {
    if (gridView || isMobileScreenWidth || isTabletScreenWidth) {
      return (
        <GridContainer className={styles.gridContainer}>
          <GridRow rowGap={3}>
            {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
              <GridColumn
                span={
                  isMobileScreenWidth
                    ? '1/1'
                    : isTabletScreenWidth
                    ? '1/2'
                    : '1/3'
                }
                key={i}
              >
                <Box width="full">
                  <SkeletonLoader height={480} width={'100%'} />
                </Box>
              </GridColumn>
            ))}
          </GridRow>
        </GridContainer>
      )
    } else {
      return (
        <GridContainer className={styles.gridContainer}>
          <GridRow rowGap={3}>
            <Box width="full">
              {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                <Box padding={2} key={i} width="full">
                  <SkeletonLoader height={480} width={'100%'} />
                </Box>
              ))}
            </Box>
          </GridRow>
        </GridContainer>
      )
    }
  }

  const handleUserInput = (value: string) => {
    setSelectedPage(1)
    searchTermHasBeenInitialized.current = true
    setQuery(value)

    const { search: _, ...currentQueryParams } = router.query
    const updatedQueryParams = {
      ...currentQueryParams,
      ...(value.length > 0 && { search: value }),
    }
    router.push(
      {
        pathname: router.pathname,
        query: updatedQueryParams,
      },
      undefined,
      {
        shallow: true,
      },
    )
  }

  const clearFilterParams = () => {
    setSelectedPage(1)
    setFilters(initialFilters)
    router.push(
      {
        pathname: router.pathname,
        query: query ? { search: query } : {},
      },
      undefined,
      {
        shallow: true,
      },
    )
  }

  const countOccurrencesInResults = (): Map<string, number> => {
    const occurrenceMap = new Map<string, number>()

    filteredResults.forEach((result) => {
      const count = occurrenceMap.get(result.item.universityId) || 0
      occurrenceMap.set(result.item.universityId, count + 1)
    })

    return occurrenceMap
  }

  const getLocalizedStringValue = (isValue: string, enValue: string) => {
    return locale === 'is' ? isValue || '' : enValue || ''
  }

  return (
    <Box>
      {organizationPage && (
        <OrganizationHeader organizationPage={organizationPage} />
      )}
      <GridContainer>
        <SidebarLayout
          paddingTop={[2, 2, 9]}
          paddingBottom={[4, 4, 4]}
          isSticky={false}
          fullWidthContent={true}
          sidebarContent={
            <Box>
              <Navigation
                baseId="pageNav"
                items={navList}
                title={n('navigationTitle', 'Efnisyfirlit')}
                activeItemTitle="Námsleit"
                renderLink={(link, item) => {
                  return item?.href ? (
                    <NextLink href={item?.href} legacyBehavior>
                      {link}
                    </NextLink>
                  ) : (
                    link
                  )
                }}
              />
              <Hidden below="md">
                <Box
                  height="full"
                  className={styles.filterWrapper}
                  display="flex"
                  flexDirection="column"
                  paddingTop={4}
                >
                  <Box display="inline" marginBottom={3}>
                    <Text title="Sía niðurstöður" variant="h3" as="h2">
                      {n('filterResults', 'Sía leitarniðurstöður')}
                    </Text>
                  </Box>
                  <Box
                    display="inline"
                    style={{ alignSelf: 'flex-end' }}
                    marginBottom={1}
                  >
                    <Button
                      variant="text"
                      icon={areFiltersOpen() ? 'add' : 'remove'}
                      size="small"
                      onClick={() =>
                        areFiltersOpen() ? toggleOpenAll() : toggleCloseAll()
                      }
                    >
                      {`${
                        areFiltersOpen()
                          ? n('openAllFilters', 'opna allar síur')
                          : n('closeAllFilters', 'loka öllum síum')
                      }`}
                    </Button>
                  </Box>
                  <Accordion
                    singleExpand={false}
                    dividerOnTop={false}
                    dividerOnBottom={false}
                  >
                    {filterOptions &&
                      filterOptions.map((filter, index) => {
                        return (
                          <AccordionItem
                            key={filter.field}
                            id={filter.field}
                            label={n(
                              filter.field,
                              TranslationDefaults[filter.field],
                            )}
                            labelUse="p"
                            labelVariant="h5"
                            iconVariant="small"
                            expanded={isOpen[index]}
                            onToggle={() => toggleIsOpen(index, !isOpen[index])}
                          >
                            <Stack space={[1, 1, 2]}>
                              {filter.options.map((option) => {
                                const str = filter.field as keyof typeof filters

                                if (option === 'OTHER') {
                                  return null
                                }

                                return (
                                  <Checkbox
                                    key={option}
                                    label={
                                      <Box
                                        display="flex"
                                        flexDirection="column"
                                      >
                                        <span>
                                          {formatFilterStrings(option, str)}
                                        </span>
                                        {filter.field === 'degreeType' && (
                                          <span>
                                            {n(`${option}_EXTRA`, '')}
                                          </span>
                                        )}
                                      </Box>
                                    }
                                    id={option}
                                    value={option}
                                    checked={
                                      filters[str].filter((x) => x === option)
                                        .length > 0
                                    }
                                    onChange={(e) => {
                                      handleFilters(
                                        filter.field,
                                        e.target.value,
                                        e.target.checked,
                                      )
                                      if (e.target.checked) {
                                        haskolanamFilterClicked(
                                          filter.field,
                                          formatFilterStrings(option, str),
                                        )
                                      }
                                    }}
                                  />
                                )
                              })}
                            </Stack>
                            <Box
                              display="flex"
                              width="full"
                              flexDirection="row"
                              justifyContent="flexEnd"
                              marginTop={1}
                            >
                              <Button
                                variant="text"
                                icon="reload"
                                size="small"
                                onClick={() => clearFilterType(filter.field)}
                              >
                                {n('clearFilter', 'Hreinsa val')}
                              </Button>
                            </Box>
                          </AccordionItem>
                        )
                      })}
                  </Accordion>
                  <Box
                    background="blue100"
                    width="full"
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                    justifyContent="center"
                    style={{ height: 72 }}
                  >
                    <Button
                      variant="text"
                      icon="reload"
                      size="small"
                      onClick={clearFilterParams}
                    >
                      {n('clearAllFilters', 'Hreinsa allar síur')}
                    </Button>
                  </Box>
                </Box>
              </Hidden>
            </Box>
          }
        >
          {isMobileScreenWidth && (
            <Box className={organizationStyles.menuStyle}>
              <Box marginY={2}>
                <Navigation
                  baseId="pageNavMobile"
                  isMenuDialog={true}
                  items={navList}
                  title={n('navigationTitle', 'Efnisyfirlit')}
                  activeItemTitle="Námsleit"
                  renderLink={(link, item) => {
                    return item?.href ? (
                      <NextLink href={item?.href} legacyBehavior>
                        {link}
                      </NextLink>
                    ) : (
                      link
                    )
                  }}
                />
              </Box>
            </Box>
          )}
          <Box minWidth={0} className={styles.mainContentWrapper}>
            <Webreader />
            <Text
              ref={titleRef}
              marginTop={0}
              marginBottom={2}
              variant="h1"
              as="h1"
              lineHeight="xs"
            >
              {n('searchResults', 'Leitarniðurstöður')}
            </Text>
            <Input
              placeholder={n('searchPrograms', 'Leit í háskólanámi')}
              id="searchuniversity"
              name="filterInput"
              value={query}
              backgroundColor="blue"
              onChange={(e) => {
                handleUserInput(e.target.value)
                clearTimeout(searchTimeoutId)
                const timeoutId = setTimeout(() => {
                  if (!e.target.value) return null
                  haskolanamTrackSearchQuery(e.target.value)
                }, 750)
                setSearchTimeoutId(timeoutId)
              }}
            />
            <Box
              paddingTop={2}
              display={'flex'}
              justifyContent={'spaceBetween'}
            >
              <Box
                display={'flex'}
                style={{ gap: '0.5rem', minHeight: '2rem' }}
                flexWrap={'wrap'}
              >
                {Object.keys(filters).map((key) =>
                  filters[key as keyof FilterProps].map((tag, idx) => (
                    <Tag key={tag}>
                      <Box
                        display={'flex'}
                        justifyContent={'center'}
                        alignItems={'center'}
                        style={{ gap: '0.5rem' }}
                      >
                        {formatFilterStrings(tag, key)}
                        <button
                          aria-label="remove tag"
                          style={{ alignSelf: 'end' }}
                          onClick={() =>
                            handleFilters(
                              key,
                              filters[key as keyof FilterProps][idx],
                              false,
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
                  onClick={() => clearFilterParams()}
                >
                  {n('clearAllFilters', 'Hreinsa allar síur')}
                </Button>
              </Box>
            </Box>

            <ContentBlock>
              <Box paddingTop={2} hidden>
                <Inline space={[1, 2]}>
                  <Tag onClick={() => resetFilteredList()}>
                    {n('showAll', 'Sýna allt')}
                  </Tag>
                  {filterOptions &&
                    filterOptions.map((option) => {
                      if (
                        !(
                          option.field === 'degreeType' ||
                          option.field === 'universityId'
                        )
                      ) {
                        return null
                      }
                      return option.options.map((item) => {
                        if (item === 'OTHER') return null
                        return (
                          <Tag
                            onClick={() =>
                              handleFilters('degreeType', item, false)
                            }
                          >
                            {n(
                              option.field === 'universityId'
                                ? universities.filter((x) => x.id === item)[0]
                                    ?.contentfulTitle || ''
                                : item,
                              option.field === 'universityId'
                                ? universities.filter((x) => x.id === item)[0]
                                    ?.contentfulTitle
                                : item,
                            )}
                          </Tag>
                        )
                      })
                    })}
                </Inline>
              </Box>
            </ContentBlock>
            <Hidden above="md">
              <Box width="full" marginTop={2}>
                <Filter
                  resultCount={filteredResults?.length ?? 0}
                  variant={'dialog'}
                  labelClear={n('clear', 'Hreinsa')}
                  labelClearAll={n('clearAllFilters', 'Hreinsa allar síur')}
                  labelOpen={n('open', 'Opna')}
                  labelClose={n('close', 'Loka')}
                  labelResult={n('showResults', 'Skoða niðurstöður')}
                  labelTitle={n('filterResults', 'Sía niðurstöður')}
                  labelFilterBy={n('filterBy', 'Sía eftir')}
                  onFilterClear={() => {
                    clearFilterParams()
                  }}
                >
                  <FilterMultiChoice
                    labelClear={n('clearFilter', 'Hreinsa val')}
                    onChange={({ categoryId, selected }) => {
                      handleFilterType(categoryId, selected)
                    }}
                    onClear={(categoryId) => {
                      setSelectedPage(1)
                      clearFilterType(categoryId)
                    }}
                    categories={
                      filterOptions
                        ? filterOptions.map((filter) => {
                            const str = filter.field as keyof typeof filters
                            return {
                              id: filter.field,
                              label: n(
                                filter.field,
                                TranslationDefaults[filter.field],
                              ),
                              selected: filters[str],
                              filters: filter.options
                                .filter((x) => x !== 'OTHER')
                                .map((option) => {
                                  return {
                                    label: formatFilterStrings(option, str),
                                    value: option,
                                  }
                                }),
                            }
                          })
                        : []
                    }
                  ></FilterMultiChoice>
                </Filter>
              </Box>
            </Hidden>
            <Box
              display={'flex'}
              flexDirection={'column'}
              style={{ gap: '0.5rem' }}
              marginTop={isTabletScreenWidth || isMobileScreenWidth ? 2 : 5}
              marginBottom={isTabletScreenWidth || isMobileScreenWidth ? 2 : 5}
            >
              <Box
                display="flex"
                flexDirection="row"
                width="full"
                justifyContent="spaceBetween"
              >
                {data && (
                  <Box
                    width="full"
                    display={'flex'}
                    justifyContent={'spaceBetween'}
                  >
                    <Box display={'flex'} flexWrap={'wrap'}>
                      <Box display={'flex'}>
                        <Text variant="intro" fontWeight="semiBold" as="h2">
                          {`${filteredResults.length}`}
                        </Text>
                        <Box paddingLeft={1}>
                          {' '}
                          <Text variant="intro" as="h2">{`${n(
                            'visiblePrograms',
                            'námsleiðir',
                          )}:`}</Text>
                        </Box>
                      </Box>
                    </Box>
                    <Box
                      display="flex"
                      flexDirection="row"
                      justifyContent="flexEnd"
                    >
                      <Hidden below="md">
                        <Box>
                          <button
                            onClick={() => setGridView(true)}
                            className={styles.iconButton}
                          >
                            <VisuallyHidden>
                              {n('changeToTable', 'Breyta niðurstöðum í töflu')}
                            </VisuallyHidden>
                            <Icon
                              icon={'gridView'}
                              type="outline"
                              color={gridView ? 'blue400' : 'dark200'}
                            />
                          </button>
                          <button
                            onClick={() => setGridView(false)}
                            className={styles.iconButton}
                          >
                            <VisuallyHidden>
                              {n('changeToList', 'Breyta niðurstöðum í lista')}
                            </VisuallyHidden>
                            <Icon
                              icon={'listView'}
                              type="outline"
                              color={gridView ? 'dark200' : 'blue400'}
                              useStroke
                            />
                          </button>
                        </Box>
                      </Hidden>
                    </Box>
                  </Box>
                )}
              </Box>
              <Box
                display="flex"
                justifyContent="flexStart"
                alignItems={'center'}
                style={{ gap: '1rem' }}
                marginBottom={2}
              >
                {Array.from(countOccurrencesInResults())
                  .sort((a, b) => b[1] - a[1])
                  .map(([universityId, count]) => {
                    const uni = universities.filter(
                      (x) => x.id === universityId,
                    )[0]
                    return (
                      <Box
                        key={universityId}
                        display="flex"
                        alignItems="center"
                        style={{ gap: '4px' }}
                        flexWrap={'wrap'}
                      >
                        <img
                          className={styles.searchResultIcon}
                          src={uni?.contentfulLogoUrl || ''}
                          alt={`${
                            locale === 'en'
                              ? uni.contentfulTitleEn
                              : uni.contentfulTitle
                          } logo`}
                        />
                        <Text variant="small">{`(${count})`}</Text>
                      </Box>
                    )
                  })}
              </Box>
            </Box>

            {loading ? (
              <>{loadSkeletons()}</>
            ) : (
              <>
                {!gridView && !isMobileScreenWidth && !isTabletScreenWidth && (
                  <Box>
                    {filteredResults &&
                      filteredResults
                        .slice(
                          (selectedPage - 1) * ITEMS_PER_PAGE,
                          (selectedPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE,
                        )
                        .map((item, index) => {
                          const dataItem =
                            item.item as UniversityGatewayProgramWithStatus
                          const university = universities.filter(
                            (x) => x.id === dataItem.universityId,
                          )[0]
                          const specializedName =
                            locale === 'en'
                              ? dataItem.specializationNameEn ?? undefined
                              : dataItem.specializationNameIs ?? undefined
                          const subHeading =
                            specializedName !== undefined
                              ? (locale === 'en'
                                  ? 'Specialization: '
                                  : 'Kjörsvið: ') + specializedName
                              : undefined
                          return (
                            <Box marginBottom={3} key={index}>
                              <ActionCategoryCard
                                key={`${index}-${dataItem.id}`}
                                href={
                                  linkResolver('universitysearchdetails', [
                                    dataItem.id,
                                  ]).href
                                }
                                heading={
                                  locale === 'en'
                                    ? dataItem.nameEn
                                    : dataItem.nameIs
                                }
                                subHeading={subHeading}
                                text={
                                  locale === 'en'
                                    ? stripHtml(dataItem.descriptionEn)
                                    : stripHtml(dataItem.descriptionIs)
                                }
                                icon={
                                  <img
                                    src={
                                      universities.filter(
                                        (x) => x.id === dataItem.universityId,
                                      )[0]?.contentfulLogoUrl || ''
                                    }
                                    alt={`${
                                      locale === 'en'
                                        ? dataItem.nameEn
                                        : dataItem.nameIs
                                    } logo`}
                                  />
                                }
                                onCardClick={() =>
                                  haskolanamCardClicked(
                                    getLocalizedStringValue(
                                      university.contentfulTitle || '',
                                      university.contentfulTitleEn || '',
                                    ),
                                    getLocalizedStringValue(
                                      dataItem.nameIs,
                                      dataItem.nameEn,
                                    ),
                                    dataItem.id,
                                  )
                                }
                                sidePanelConfig={{
                                  cta: createPrimaryCTA(dataItem),
                                  buttonLabel: n('apply', 'Sækja um'),
                                  items: [
                                    {
                                      icon: (
                                        <Icon
                                          icon={'school'}
                                          type="outline"
                                          color="blue400"
                                        />
                                      ),
                                      title: `${n(
                                        dataItem.degreeType,
                                        TranslationDefaults[
                                          dataItem.degreeType
                                        ],
                                      )}, ${dataItem.degreeAbbreviation}`,
                                    },
                                    {
                                      icon: (
                                        <Icon
                                          icon={'time'}
                                          type="outline"
                                          color="blue400"
                                        />
                                      ),
                                      title: `${dataItem.credits} ${n(
                                        'units',
                                        'einingar',
                                      )}, ${dataItem.durationInYears.toLocaleString(
                                        locale === 'is' ? 'de' : 'en',
                                      )} ${
                                        locale === 'en'
                                          ? dataItem.durationInYears === 1
                                            ? 'year'
                                            : 'years'
                                          : 'ár'
                                      }`,
                                    },
                                    {
                                      icon: (
                                        <Icon
                                          icon={'person'}
                                          type="outline"
                                          color="blue400"
                                        />
                                      ),
                                      title: formatModeOfDelivery(
                                        dataItem.modeOfDelivery,
                                      ),
                                    },
                                    {
                                      icon: (
                                        <Icon
                                          icon={'calendar'}
                                          type="outline"
                                          color="blue400"
                                        />
                                      ),
                                      title: `${n(
                                        dataItem.startingSemesterSeason,
                                        TranslationDefaults[
                                          dataItem.startingSemesterSeason
                                        ],
                                      )} ${dataItem.startingSemesterYear}`,
                                    },
                                    {
                                      icon: (
                                        <Icon
                                          icon={'time'}
                                          type="outline"
                                          color="blue400"
                                        />
                                      ),
                                      title: dataItem.applicationPeriodOpen
                                        ? `${n(
                                            'openForApplication',
                                            'Opið fyrir umsóknir',
                                          )}`
                                        : `${n(
                                            'closedForApplication',
                                            'Lokað fyrir umsóknir',
                                          )}`,
                                    },
                                  ],
                                }}
                              />
                            </Box>
                          )
                        })}
                  </Box>
                )}
                {(gridView || isMobileScreenWidth || isTabletScreenWidth) && (
                  <GridContainer className={styles.gridContainer}>
                    <GridRow rowGap={3}>
                      {filteredResults &&
                        filteredResults
                          .slice(
                            (selectedPage - 1) * ITEMS_PER_PAGE,
                            (selectedPage - 1) * ITEMS_PER_PAGE +
                              ITEMS_PER_PAGE,
                          )
                          .map((item, index) => {
                            const dataItem =
                              item.item as UniversityGatewayProgramWithStatus
                            const specializedName =
                              locale === 'en'
                                ? dataItem.specializationNameEn ?? undefined
                                : dataItem.specializationNameIs ?? undefined
                            const subHeading =
                              specializedName !== undefined
                                ? (locale === 'en'
                                    ? 'Specialization: '
                                    : 'Kjörsvið: ') + specializedName
                                : undefined
                            const contentfulUni = universities.filter(
                              (x) => x.id === dataItem.universityId,
                            )[0]
                            return (
                              <GridColumn
                                span={
                                  isMobileScreenWidth
                                    ? '1/1'
                                    : isTabletScreenWidth
                                    ? '1/2'
                                    : '1/3'
                                }
                                key={index}
                              >
                                <ListViewCard
                                  iconText={
                                    locale === 'en'
                                      ? contentfulUni?.contentfulTitleEn || ''
                                      : contentfulUni?.contentfulTitle || ''
                                  }
                                  heading={
                                    locale === 'en'
                                      ? dataItem.nameEn
                                      : dataItem.nameIs
                                  }
                                  subHeading={subHeading}
                                  icon={
                                    <img
                                      src={
                                        universities.filter(
                                          (x) => x.id === dataItem.universityId,
                                        )[0]?.contentfulLogoUrl || ''
                                      }
                                      alt={`${
                                        locale === 'en'
                                          ? dataItem.nameEn
                                          : dataItem.nameIs
                                      } logo`}
                                    />
                                  }
                                  buttonLabel={n('apply', 'Sækja um')}
                                  cta={createPrimaryCTA(dataItem)}
                                  href={
                                    linkResolver('universitysearchdetails', [
                                      dataItem.id,
                                    ]).href
                                  }
                                  onCardClick={() =>
                                    haskolanamCardClicked(
                                      getLocalizedStringValue(
                                        contentfulUni.contentfulTitle || '',
                                        contentfulUni.contentfulTitleEn || '',
                                      ),
                                      getLocalizedStringValue(
                                        dataItem.nameIs,
                                        dataItem.nameEn,
                                      ),
                                      dataItem.id,
                                    )
                                  }
                                  infoItems={[
                                    {
                                      icon: (
                                        <Icon
                                          icon={'school'}
                                          type="outline"
                                          color="blue400"
                                        />
                                      ),
                                      title: `${n(
                                        dataItem.degreeType,
                                        TranslationDefaults[
                                          dataItem.degreeType
                                        ],
                                      )}, ${dataItem.degreeAbbreviation}`,
                                    },
                                    {
                                      icon: (
                                        <Icon
                                          icon={'time'}
                                          type="outline"
                                          color="blue400"
                                        />
                                      ),
                                      title: `${dataItem.credits} ${n(
                                        'units',
                                        'einingar',
                                      )}, ${dataItem.durationInYears.toLocaleString(
                                        locale === 'is' ? 'de' : 'en',
                                      )} ${
                                        locale === 'en'
                                          ? dataItem.durationInYears === 1
                                            ? 'year'
                                            : 'years'
                                          : 'ár'
                                      }`,
                                    },
                                    {
                                      icon: (
                                        <Icon
                                          icon={'person'}
                                          type="outline"
                                          color="blue400"
                                        />
                                      ),
                                      title: formatModeOfDelivery(
                                        dataItem.modeOfDelivery,
                                      ),
                                    },
                                    {
                                      icon: (
                                        <Icon
                                          icon={'calendar'}
                                          type="outline"
                                          color="blue400"
                                        />
                                      ),
                                      title: `${n(
                                        dataItem.startingSemesterSeason,
                                        TranslationDefaults[
                                          dataItem.startingSemesterSeason
                                        ],
                                      )} ${dataItem.startingSemesterYear}`,
                                    },
                                    {
                                      icon: (
                                        <Icon
                                          icon={'time'}
                                          type="outline"
                                          color="blue400"
                                        />
                                      ),
                                      title: dataItem.applicationPeriodOpen
                                        ? `${n(
                                            'openForApplication',
                                            'Opið fyrir umsóknir',
                                          )}`
                                        : `${n(
                                            'closedForApplication',
                                            'Lokað fyrir umsóknir',
                                          )}`,
                                    },
                                  ]}
                                />
                              </GridColumn>
                            )
                          })}
                    </GridRow>
                  </GridContainer>
                )}
              </>
            )}
            <Box marginTop={2} marginBottom={0}>
              <Pagination
                variant="purple"
                page={selectedPage}
                itemsPerPage={ITEMS_PER_PAGE}
                totalItems={filteredResults.length}
                totalPages={totalPages}
                renderLink={(page, className, children) => (
                  <button
                    aria-label={selectedPage < page ? 'Next' : 'Previous'}
                    onClick={() => {
                      setSelectedPage(page)
                      if (titleRef.current) {
                        titleRef.current.scrollIntoView({
                          behavior: 'smooth',
                        })
                      }
                    }}
                  >
                    <span className={className}>{children}</span>
                  </button>
                )}
              />
            </Box>
          </Box>
        </SidebarLayout>
        <Box
          display="flex"
          flexDirection="row"
          columnGap={15}
          paddingBottom={8}
        ></Box>
      </GridContainer>
      <Box className="rs_read">
        <OrganizationFooter
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore make web strict
          organizations={[organizationPage.organization]}
          force={true}
        />
      </Box>
    </Box>
  )
}

UniversitySearch.getProps = async ({ apolloClient, locale, query, res }) => {
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=1650, stale-while-revalidate=300',
  )

  const [
    {
      data: { getOrganizationPage },
    },
    filters,
    {
      data: { universityGatewayUniversities },
    },
    namespaceResponse,
  ] = await Promise.all([
    apolloClient.query<Query, QueryGetOrganizationPageArgs>({
      query: GET_ORGANIZATION_PAGE_QUERY,
      variables: {
        input: {
          slug: locale === 'is' ? 'haskolanam' : 'university-studies',
          lang: locale as ContentLanguage,
        },
      },
    }),
    apolloClient.query<GetUniversityGatewayProgramFiltersQuery>({
      query: GET_UNIVERSITY_GATEWAY_FILTERS,
    }),
    apolloClient.query<GetUniversityGatewayUniversitiesQuery>({
      query: GET_UNIVERSITY_GATEWAY_UNIVERSITIES,
    }),
    apolloClient.query<GetNamespaceQuery, GetNamespaceQueryVariables>({
      query: GET_NAMESPACE_QUERY,
      variables: {
        input: {
          lang: locale,
          namespace: 'universityGateway',
        },
      },
    }),
  ])

  const { search } = query
  const queryFilters = query

  const filtersByQuery = initialFilters
  Object.keys(initialFilters).forEach((key) => {
    const typedKey = key as keyof typeof initialFilters
    if (queryFilters[key]) {
      if (Array.isArray(queryFilters[key])) {
        filtersByQuery[typedKey] = queryFilters[key] as string[]
      } else {
        filtersByQuery[typedKey] = [queryFilters[key]] as string[]
      }
    }
  })

  const namespace = JSON.parse(
    namespaceResponse?.data?.getNamespace?.fields || '{}',
  ) as Record<string, string>

  if (!getOrganizationPage) {
    throw new CustomNextError(404, 'Page not found')
  }

  return {
    searchQuery: search as string,
    filtersFromQuery: filtersByQuery,
    filterOptions: filters.data.universityGatewayProgramFilters,
    locale,
    namespace,
    organizationPage: getOrganizationPage,
    universities: universityGatewayUniversities,
  }
}

export default withMainLayout(UniversitySearch, {
  showFooter: false,
})
