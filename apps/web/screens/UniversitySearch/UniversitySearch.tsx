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
  Stack,
  Tag,
  Text,
  toast,
  ToastContainer,
  VisuallyHidden,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
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
import { SearchProducts } from '@island.is/web/utils/useUniversitySearch'

import SidebarLayout from '../Layouts/SidebarLayout'
import { GET_NAMESPACE_QUERY, GET_ORGANIZATION_PAGE_QUERY } from '../queries'
import {
  GET_UNIVERSITY_GATEWAY_FILTERS,
  GET_UNIVERSITY_GATEWAY_PROGRAM_LIST,
  GET_UNIVERSITY_GATEWAY_UNIVERSITIES,
} from '../queries/UniversityGateway'
import { Comparison } from './ComparisonComponent'
import { TranslationDefaults } from './TranslationDefaults'
import * as organizationStyles from '../../components/Organization/Wrapper/OrganizationWrapper.css'
import * as styles from './UniversitySearch.css'

const ITEMS_PER_PAGE = 18
const NUMBER_OF_FILTERS = 6
const MAX_SELECTED_COMPARISON = 3

interface UniversitySearchProps {
  namespace: Record<string, string>
  filterOptions: Array<UniversityGatewayProgramFilter>
  locale: string
  universities: Array<UniversityGatewayUniversity>
  organizationPage?: Query['getOrganizationPage']
  searchQuery: string
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

export interface ComparisonProps {
  id: string
  nameIs: string
  iconSrc: string
}

interface UniversityProgramsQuery {
  universityGatewayPrograms: {
    data: Array<UniversityGatewayProgram>
  }
}
interface UniversityGatewayProgramWithStatus extends UniversityGatewayProgram {
  applicationStatus: string
}

const getActiveNavigationItemTitle = (
  navigationItems: NavigationItem[],
  clientUrl: string,
) => {
  for (const item of navigationItems) {
    if (clientUrl === item.href) {
      return item.title
    }
    for (const childItem of item.items ?? []) {
      if (clientUrl === childItem.href) {
        return childItem.title
      }
    }
  }
}

const UniversitySearch: Screen<UniversitySearchProps> = ({
  filterOptions,
  namespace,
  searchQuery,
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
  const [selectedComparison, setSelectedComparison] = useState<
    Array<ComparisonProps>
  >([])
  const [query, setQuery] = useState('')
  const searchTermHasBeenInitialized = useRef(false)
  const [originalSortedResults, setOriginalSortedList] = useState<any>([])
  const [filteredResults, setFilteredResults] = useState<Array<any>>([])
  const [gridView, setGridView] = useState<boolean>(true)
  const { linkResolver } = useLinkResolver()
  const [totalPages, setTotalPages] = useState<number>(0)
  const [filters, setFilters] = useState<FilterProps>(
    JSON.parse(JSON.stringify(initialFilters)),
  )

  useEffect(() => {
    if (!loading) {
      const temp = [
        ...(data?.universityGatewayPrograms.data as UniversityGatewayProgram[]),
      ]
        .sort(() => Math.random() - 0.5)
        .map((item: UniversityGatewayProgram, index: number) => {
          const itemWithStatus = {
            ...item,
            applicationStatus: getApplicationStatus(item),
          }
          return { item: itemWithStatus, refIndex: index, score: 1 }
        })
      setOriginalSortedList(temp)
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

      movedField.options.sort((x, y) => {
        const titleX =
          universities.filter((uni) => uni.id === x)[0]?.contentfulTitle || ''
        const titleY =
          universities.filter((uni) => uni.id === y)[0]?.contentfulTitle || ''
        return titleX.localeCompare(titleY)
      })
      filterOptions.splice(2, 0, movedField)
      const lastElement = filterOptions[filterOptions.length - 1]
      filterOptions[filterOptions.length - 1] =
        filterOptions[filterOptions.length - 2]
      filterOptions[filterOptions.length - 2] = lastElement
    }
  }, [filterOptions, universities])

  const getApplicationStatus = (item: UniversityGatewayProgram) => {
    const now = new Date()
    return new Date(item.applicationStartDate) <= now &&
      new Date(item.applicationEndDate) >= now
      ? 'OPEN'
      : 'CLOSED'
  }

  useEffect(() => {
    setTotalPages(Math.ceil(filteredResults.length / ITEMS_PER_PAGE))
  }, [filteredResults])

  useEffect(() => {
    const comp = localStorage.getItem('comparison')
    const viewChoice = localStorage.getItem('viewChoice')
    const savedFilters = localStorage.getItem('savedFilters')

    if (comp) {
      const comparison = JSON.parse(comp)
      setSelectedComparison(comparison)
    }

    if (viewChoice) {
      setGridView(viewChoice === 'true' ? true : false)
    }

    if (savedFilters) {
      const parsedFilters = JSON.parse(savedFilters)
      setFilters(parsedFilters)
    }

    if (searchQuery) {
      setQuery(searchQuery)
      sessionStorage.setItem('query', searchQuery)
      //also set deep copy here
      setFilters(JSON.parse(JSON.stringify(initialFilters)))
    } else if (sessionStorage.getItem('query')) {
      setQuery(sessionStorage.getItem('query') || '')
    }
  }, [])

  const fuseOptions = {
    threshold: 0.3,
    findAllMatches: true,
    ignoreLocation: true,
    includeScore: true,
    keys: [
      `name${locale === 'is' ? 'Is' : 'En'}`,
      `specializationName${locale === 'is' ? 'Is' : 'En'}`,
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

    let fuseInstance: Fuse<UniversityGatewayProgram> = new Fuse([], fuseOptions)
    if (originalSortedResults.length > 0) {
      fuseInstance = new Fuse(
        data?.universityGatewayPrograms.data || [],
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
        query,
        activeFilters: activeFiltersFound,
        locale,
      })

      setFilteredResults(results)
    }
    localStorage.setItem('savedFilters', JSON.stringify(filters))
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
      disabled: item.applicationStatus === 'CLOSED',
      onClick: () => {
        window.open(applicationUrlParser(item.universityId))
      },
    }
    return CTA
  }

  const handleFilters = (filterKey: string, filterValue: string) => {
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
  }

  const handleComparisonChange = (dataItem: ComparisonProps) => {
    const found = selectedComparison.some((x) => x.id === dataItem.id)

    if (!found) {
      if (selectedComparison.length === MAX_SELECTED_COMPARISON) {
        //comparison can only include 3 items so display error message if trying to add the fourth
        toast.error(
          n(
            'maxComparisonError',
            `Aðeins er hægt að hafa ${MAX_SELECTED_COMPARISON} nám í samanburði`,
          ),
        )
      } else {
        setSelectedComparison([...selectedComparison, dataItem])
      }
    } else {
      setSelectedComparison(
        selectedComparison.filter((item) => {
          if (item.id !== dataItem.id) {
            return true
          }
          return false
        }),
      )
    }
  }

  useEffect(() => {
    localStorage.setItem('comparison', JSON.stringify(selectedComparison))
  }, [selectedComparison])

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

  const checkboxEventHandler = (
    e: React.ChangeEvent<HTMLInputElement>,
    filterKey: string,
  ) => {
    setSelectedPage(1)
    handleFilters(filterKey, e.target.value)
  }

  const routeToComparison = () => {
    router.push(
      `${
        linkResolver('universitysearchcomparison').href
      }?comparison=${JSON.stringify(selectedComparison.map((i) => i.id))}`,
    )
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

  const handleRemoveTag = (key: keyof FilterProps, tag: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: prevFilters[key].filter((existingTag) => existingTag !== tag),
    }))
  }

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
      return universities.filter((x) => x.id === tag)[0]?.contentfulTitle || ''
    } else if (tag === 'OPEN') {
      return `${n('openForApplication', 'Opið fyrir umsóknir')}`
    } else {
      return n(tag, TranslationDefaults[tag])
    }
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
                      icon="add"
                      size="small"
                      onClick={() =>
                        isOpen.filter((x) => x === false).length > 0
                          ? toggleOpenAll()
                          : toggleCloseAll()
                      }
                    >
                      {`${
                        isOpen.filter((x) => x === false).length > 0
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
                                    onChange={(e) =>
                                      checkboxEventHandler(e, filter.field)
                                    }
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
                                onClick={() =>
                                  setFilters({ ...filters, [filter.field]: [] })
                                }
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
                      onClick={() =>
                        setFilters(JSON.parse(JSON.stringify(initialFilters)))
                      }
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
                setSelectedPage(1)
                searchTermHasBeenInitialized.current = true
                setQuery(e.target.value)
                sessionStorage.setItem('query', e.target.value)
              }}
            />
            <Box
              paddingTop={2}
              display={'flex'}
              justifyContent={'spaceBetween'}
            >
              <Box display={'flex'} style={{ gap: '0.5rem' }}>
                {Object.keys(filters).map((key) =>
                  filters[key as keyof FilterProps].map((tag) => (
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
                            handleRemoveTag(key as keyof FilterProps, tag)
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
                  onClick={() => {
                    setSelectedPage(1)
                    setFilters(JSON.parse(JSON.stringify(initialFilters)))
                  }}
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
                        option.field === 'degreeType' ||
                        option.field === 'universityId'
                      ) {
                        return option.options.map((item) => {
                          if (item === 'OTHER') return null
                          return (
                            <Tag
                              onClick={() => handleFilters('degreeType', item)}
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
                      }
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
                  onFilterClear={() => {
                    setSelectedPage(1)
                    setFilters(JSON.parse(JSON.stringify(initialFilters)))
                  }}
                >
                  <FilterMultiChoice
                    labelClear={n('clearFilter', 'Hreinsa val')}
                    onChange={({ categoryId, selected }) => {
                      setSelectedPage(1)
                      setFilters({ ...filters, [categoryId]: selected })
                    }}
                    onClear={(categoryId) => {
                      setSelectedPage(1)
                      setFilters({ ...filters, [categoryId]: [] })
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
              display="flex"
              flexDirection="row"
              justifyContent="spaceBetween"
              marginTop={isTabletScreenWidth || isMobileScreenWidth ? 2 : 5}
              marginBottom={isTabletScreenWidth || isMobileScreenWidth ? 2 : 5}
            >
              <Box display="flex">
                <Text variant="intro" fontWeight="semiBold" as="h2">
                  {`${filteredResults.length}`}{' '}
                </Text>
                <Box paddingLeft={1}>
                  {' '}
                  <Text variant="intro" as="h2">{`${n(
                    'visiblePrograms',
                    'námsleiðir sýnilegar',
                  )}`}</Text>
                </Box>
              </Box>
              <Hidden below="md">
                <Box>
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
                </Box>
              </Hidden>
            </Box>
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
                                alt={`Logo fyrir ${
                                  locale === 'en'
                                    ? dataItem.nameEn
                                    : dataItem.nameIs
                                }`}
                              />
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
                                    TranslationDefaults[dataItem.degreeType],
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
                                  title:
                                    dataItem.applicationStatus === 'OPEN'
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
                        (selectedPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE,
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
                                universities.filter(
                                  (x) => x.id === dataItem.universityId,
                                )[0]?.contentfulTitle || ''
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
                                  alt={`Logo fyrir ${
                                    locale === 'en'
                                      ? dataItem.nameEn
                                      : dataItem.nameIs
                                  }`}
                                />
                              }
                              buttonLabel={n('apply', 'Sækja um')}
                              cta={createPrimaryCTA(dataItem)}
                              href={
                                linkResolver('universitysearchdetails', [
                                  dataItem.id,
                                ]).href
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
                                    TranslationDefaults[dataItem.degreeType],
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
                                  title:
                                    dataItem.applicationStatus === 'OPEN'
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
            <Box
              marginTop={2}
              marginBottom={selectedComparison.length > 0 ? 4 : 0}
            >
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
        {selectedComparison.length > 0 &&
          !isTabletScreenWidth &&
          !isMobileScreenWidth && (
            <Box display="flex" flexDirection="column">
              <Box paddingLeft={2} paddingBottom={2}>
                <Text variant="h3">
                  {n('programsInCompare', 'Nám í samanburði')}
                </Text>
              </Box>
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="spaceBetween"
              >
                <Box
                  display="flex"
                  flexDirection="row"
                  flexWrap="wrap"
                  rowGap={1}
                  width="full"
                >
                  {selectedComparison.map((item) => {
                    return (
                      <GridColumn span="1/3" key={item.id}>
                        <Comparison>
                          <Box
                            display="flex"
                            flexDirection="row"
                            justifyContent="spaceBetween"
                            alignItems="center"
                            width="full"
                          >
                            <Box
                              display="flex"
                              flexDirection="row"
                              alignItems="center"
                              paddingRight={3}
                              style={{ maxWidth: '90%' }}
                            >
                              <img
                                src={item.iconSrc}
                                className={styles.icon}
                                alt={`Logo fyrir ${item.nameIs}`}
                                style={{ paddingRight: 10 }}
                              />
                              <Text variant="h5" truncate>
                                {item.nameIs}
                              </Text>
                            </Box>
                            <Box
                              display="flex"
                              flexDirection="row"
                              alignItems="center"
                            >
                              <button
                                onClick={() =>
                                  handleComparisonChange({
                                    id: item.id,
                                    nameIs: item.nameIs,
                                    iconSrc: item.iconSrc,
                                  })
                                }
                                className={styles.removeButton}
                              >
                                <Icon
                                  className={styles.closeIcon}
                                  icon={'close'}
                                  type="outline"
                                  color="blue400"
                                />
                              </button>
                            </Box>
                          </Box>
                        </Comparison>
                      </GridColumn>
                    )
                  })}
                </Box>
                <Button onClick={() => routeToComparison()}>
                  <Text variant="h5" whiteSpace="nowrap" color="white">
                    {n('seeCompare', 'Skoða samanburð')}
                  </Text>
                </Button>
              </Box>
            </Box>
          )}
        {selectedComparison.length > 0 &&
          (isTabletScreenWidth || isMobileScreenWidth) && (
            <Box
              display="flex"
              flexDirection="column"
              width="full"
              background="white"
              padding={3}
              position="fixed"
              bottom={0}
              right={0}
              left={0}
              zIndex={10}
              borderTopWidth="standard"
              borderColor="blue300"
              boxShadow="strong"
            >
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="spaceBetween"
                width="full"
                alignItems="flexStart"
                paddingBottom={2}
              >
                <Text variant="h3">{n('comparison', 'Samanburður')}</Text>
                <Button
                  variant="text"
                  icon="close"
                  size="small"
                  onClick={() => setSelectedComparison([])}
                >
                  <Text variant="eyebrow" color="blue400" as="span">
                    {n('clearFilter', 'Hreinsa val')}
                  </Text>
                </Button>
              </Box>
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="spaceBetween"
                width="full"
                alignItems="center"
              >
                <Button variant="primary" onClick={() => routeToComparison()}>
                  {n('seeCompare', 'Skoða samanburð')}
                </Button>
                <Text
                  variant="h5"
                  as="span"
                >{`${selectedComparison.length} / ${MAX_SELECTED_COMPARISON}`}</Text>
              </Box>
            </Box>
          )}
        {/* <Box marginBottom={8} marginTop={5}>
        </Box> */}
        <ToastContainer></ToastContainer>
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

  const namespace = JSON.parse(
    namespaceResponse?.data?.getNamespace?.fields || '{}',
  ) as Record<string, string>

  if (!getOrganizationPage) {
    throw new CustomNextError(404, 'Page not found')
  }

  return {
    searchQuery: search as string,
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
