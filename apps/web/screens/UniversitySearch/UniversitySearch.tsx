import { useEffect, useMemo, useRef, useState } from 'react'
import Fuse from 'fuse.js'
import getConfig from 'next/config'
import NextLink from 'next/link'
import { useRouter } from 'next/router'

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
  LinkV2,
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
  BackgroundImage,
  CTAProps,
  ListViewCard,
  OrganizationFooter,
  OrganizationHeader,
} from '@island.is/web/components'
import {
  ContentLanguage,
  GetNamespaceQuery,
  GetNamespaceQueryVariables,
  GetUniversityGatewayProgramFiltersQuery,
  GetUniversityGatewayProgramsQuery,
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

import UniversityStudiesFooter from '../../components/Organization/Wrapper/Themes/UniversityStudiesTheme/UniversityStudiesFooter'
import SidebarLayout from '../Layouts/SidebarLayout'
import {
  GET_NAMESPACE_QUERY,
  GET_ORGANIZATION_PAGE_QUERY,
  GET_ORGANIZATION_QUERY,
} from '../queries'
import {
  GET_UNIVERSITY_GATEWAY_FILTERS,
  GET_UNIVERSITY_GATEWAY_PROGRAM_LIST,
  GET_UNIVERSITY_GATEWAY_UNIVERSITIES,
} from '../queries/UniversityGateway'
import { Comparison } from './ComparisonComponent'
import { TranslationDefaults } from './TranslationDefaults'
import * as organizationStyles from '../../components/Organization/Wrapper/OrganizationWrapper.css'
import * as styles from './UniversitySearch.css'

const { publicRuntimeConfig = {} } = getConfig() ?? {}

const ITEMS_PER_PAGE = 9
const NUMBER_OF_FILTERS = 6
const MAX_SELECTED_COMPARISON = 3

interface UniversitySearchProps {
  data: Array<UniversityGatewayProgram>
  namespace: Record<string, string>
  filterOptions: Array<UniversityGatewayProgramFilter>
  locale: string
  universities: Array<UniversityGatewayUniversity>
  organizationPage?: Query['getOrganizationPage']
  organization?: Query['getOrganization']
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
  data,
  filterOptions,
  namespace,
  searchQuery,
  locale,
  organizationPage,
  organization,
  universities,
}) => {
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

  const getApplicationStatus = (item: UniversityGatewayProgram) => {
    const now = new Date()
    return new Date(item.applicationStartDate) <= now &&
      new Date(item.applicationEndDate) >= now
      ? 'OPEN'
      : 'CLOSED'
  }

  const [filteredResults, setFilteredResults] = useState<Array<any>>(
    data &&
      [...data]
        .sort((x, y) => {
          if (x.nameIs > y.nameIs) return 1
          return -1
        })
        .map((item: UniversityGatewayProgram, index: number) => {
          const itemWithStatus = {
            ...item,
            applicationStatus: getApplicationStatus(item),
          }
          return { item: itemWithStatus, refIndex: index, score: 1 }
        }),
  )
  const { linkResolver } = useLinkResolver()

  //creating a deep copy to avoid original being affected by changes to filters
  const [filters, setFilters] = useState<FilterProps>(
    JSON.parse(JSON.stringify(initialFilters)),
  )

  const [gridView, setGridView] = useState<boolean>(false)

  const [totalPages, setTotalPages] = useState<number>(
    Math.ceil(data.length / ITEMS_PER_PAGE),
  )

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

      //also set deep copy here
      setFilters(JSON.parse(JSON.stringify(initialFilters)))
    }
  }, [])

  const fuseOptions = {
    threshold: 0.2,
    keys: [
      'nameIs',
      'departmentNameIs',
      'descriptionIs',
      'degreeType',
      'modeOfDelivery',
      'startingSemesterSeason',
      'durationInYears',
      'universityId',
      'applicationStatus',
    ],
  }

  const fuseInstance = new Fuse(
    data.map((item) => {
      return { ...item, applicationStatus: getApplicationStatus(item) }
    }),
    fuseOptions,
  )

  useEffect(() => {
    const activeFiltersFound: Array<{ key: string; value: Array<string> }> = []
    Object.keys(filters).forEach(function (key) {
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
      })

      console.log('results', results)
      setFilteredResults(results)
    }
    localStorage.setItem('savedFilters', JSON.stringify(filters))
  }, [filters, query])

  const resetFilteredList = () => {
    const resultProducts: Array<any> = data.map(
      (item: UniversityGatewayProgram, index: number) => {
        return {
          item: { ...item, applicationStatus: getApplicationStatus(item) },
          refIndex: index,
          score: 1,
        }
      },
    )
    setFilteredResults(resultProducts)
  }

  const createPrimaryCTA = (item: UniversityGatewayProgramWithStatus) => {
    const CTA: CTAProps = {
      label: n('apply', 'Sækja um'),
      variant: 'primary',
      size: 'small',
      icon: 'arrowForward',
      iconType: 'outline',
      disabled: item.applicationStatus === 'CLOSED',
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
      active: primaryLink?.url === router.pathname, // TODO This fails because of the contentful url (/haskolanam-temp)
      items: childrenLinks.map(({ text, url }) => ({
        title: text,
        href: url,
      })),
    })) ?? []

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
          fullWidthContent={false}
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
                                let keyField = option
                                const str = filter.field as keyof typeof filters

                                if (str === 'universityId') {
                                  keyField =
                                    universities.filter(
                                      (x) => x.id === option,
                                    )[0].contentfulTitle || ''
                                }
                                if (keyField !== 'OTHER') {
                                  return (
                                    <Checkbox
                                      key={keyField}
                                      label={
                                        <Box
                                          display="flex"
                                          flexDirection="column"
                                        >
                                          <span>
                                            {filter.field ===
                                            'applicationStatus'
                                              ? n(
                                                  'openForApplication',
                                                  'opið fyrir umsóknir',
                                                )
                                              : n(keyField, keyField)}
                                          </span>
                                          <span>
                                            {filter.field === 'degreeType'
                                              ? `${n(`${keyField}_EXTRA`, '')}`
                                              : ''}
                                          </span>
                                        </Box>
                                      }
                                      id={keyField}
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
                                }
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
          <Box minWidth={0}>
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
              label={n('searchPrograms', 'Leit í háskólanámi')}
              id="searchuniversity"
              name="filterInput"
              value={query}
              backgroundColor="blue"
              onChange={(e) => {
                setSelectedPage(1)
                searchTermHasBeenInitialized.current = true
                setQuery(e.target.value)
              }}
            />
            <ContentBlock>
              <Box paddingTop={2} hidden>
                <Inline space={[1, 2]}>
                  <Tag onClick={() => resetFilteredList()}>
                    {n('showAll', 'Sýna allt')}
                  </Tag>
                  {filterOptions.map((option) => {
                    if (
                      option.field === 'degreeType' ||
                      option.field === 'universityId'
                    ) {
                      return option.options.map((item) => {
                        if (item !== 'OTHER') {
                          return (
                            <Tag
                              onClick={() => handleFilters('degreeType', item)}
                            >
                              {n(
                                option.field === 'universityId'
                                  ? universities.filter((x) => x.id === item)[0]
                                      .contentfulTitle || ''
                                  : item,
                                option.field === 'universityId'
                                  ? universities.filter((x) => x.id === item)[0]
                                      .contentfulTitle
                                  : item,
                              )}
                            </Tag>
                          )
                        }
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
                                  let keyField = option

                                  if (str === 'universityId') {
                                    keyField =
                                      universities.filter(
                                        (x) => x.id === option,
                                      )[0].contentfulTitle || ''
                                  }
                                  return {
                                    label: `${n(keyField, keyField)}${
                                      filter.field === 'durationInYears'
                                        ? locale === 'en'
                                          ? keyField === '1'
                                            ? ' year'
                                            : ' years'
                                          : ' ár'
                                        : ''
                                    }`,
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
                <Text variant="intro" fontWeight="semiBold">
                  {`${filteredResults.length}`}{' '}
                </Text>
                <Box paddingLeft={1}>
                  {' '}
                  <Text variant="intro">{`${n(
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
                                  )[0].contentfulLogoUrl || ''
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
                                  )}, ${dataItem.durationInYears} ${
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
                                  title: `${dataItem.modeOfDelivery.map(
                                    (delivery: string, index: number) => {
                                      const total =
                                        dataItem.modeOfDelivery.length
                                      //first item is always the same
                                      if (index === 0) {
                                        return `${n(
                                          delivery,
                                          TranslationDefaults[delivery],
                                        )}`
                                      }
                                      //if there are more items than this one
                                      else if (index > 0 && total > index + 1) {
                                        return `, ${n(
                                          delivery,
                                          TranslationDefaults[delivery],
                                        )}, `
                                      }
                                      return `${n('or', 'eða')} ${n(
                                        delivery,
                                        TranslationDefaults[delivery],
                                      )}`
                                    },
                                  )}`,
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
                                )[0].contentfulTitle || ''
                              }
                              heading={
                                locale === 'en'
                                  ? dataItem.nameEn
                                  : dataItem.nameIs
                              }
                              icon={
                                <img
                                  src={
                                    universities.filter(
                                      (x) => x.id === dataItem.universityId,
                                    )[0].contentfulLogoUrl || ''
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
                                  )}, ${dataItem.durationInYears} ${
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
                                  title: `${dataItem.modeOfDelivery.map(
                                    (delivery: string, index: number) => {
                                      const total =
                                        dataItem.modeOfDelivery.length
                                      //first item is always the same
                                      if (index === 0) {
                                        return `${n(
                                          delivery,
                                          TranslationDefaults[delivery],
                                        )}`
                                      }
                                      //if there are more items than this one
                                      else if (index > 0 && total > index + 1) {
                                        return `, ${n(
                                          delivery,
                                          TranslationDefaults[delivery],
                                        )}, `
                                      }
                                      //else it's the last item and should have an "or" before the item
                                      return `${n('or', 'eða')} ${n(
                                        delivery,
                                        TranslationDefaults[delivery],
                                      )}`
                                    },
                                  )}`,
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

UniversitySearch.getProps = async ({ apolloClient, locale, query }) => {
  const namespaceResponse = await apolloClient.query<
    GetNamespaceQuery,
    GetNamespaceQueryVariables
  >({
    query: GET_NAMESPACE_QUERY,
    variables: {
      input: {
        lang: locale,
        namespace: 'universityGateway',
      },
    },
  })

  const { search } = query

  const namespace = JSON.parse(
    namespaceResponse?.data?.getNamespace?.fields || '{}',
  ) as Record<string, string>

  let showPagesFeatureFlag = false

  if (publicRuntimeConfig?.environment === 'prod') {
    showPagesFeatureFlag = Boolean(namespace?.showPagesProdFeatureFlag)
  } else if (publicRuntimeConfig?.environment === 'staging') {
    showPagesFeatureFlag = Boolean(namespace?.showPagesStagingFeatureFlag)
  } else {
    showPagesFeatureFlag = Boolean(namespace?.showPagesDevFeatureFlag)
  }

  if (!showPagesFeatureFlag) {
    throw new CustomNextError(404, 'Page not found')
  }

  const [
    {
      data: { getOrganizationPage },
    },
    {
      data: { getOrganization },
    },
    {
      data: { universityGatewayPrograms },
    },
    filters,
    {
      data: { universityGatewayUniversities },
    },
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
    apolloClient.query<Query, QueryGetOrganizationPageArgs>({
      query: GET_ORGANIZATION_QUERY,
      variables: {
        input: {
          slug: locale === 'is' ? 'haskolanam' : 'university-studies',
          lang: locale as ContentLanguage,
        },
      },
    }),
    apolloClient.query<GetUniversityGatewayProgramsQuery>({
      query: GET_UNIVERSITY_GATEWAY_PROGRAM_LIST,
    }),
    apolloClient.query<GetUniversityGatewayProgramFiltersQuery>({
      query: GET_UNIVERSITY_GATEWAY_FILTERS,
    }),
    apolloClient.query<GetUniversityGatewayUniversitiesQuery>({
      query: GET_UNIVERSITY_GATEWAY_UNIVERSITIES,
    }),
  ])

  return {
    data: universityGatewayPrograms.data,
    searchQuery: search as string,
    filterOptions: filters.data.universityGatewayProgramFilters,
    locale,
    namespace,
    organizationPage: getOrganizationPage,
    organization: getOrganization,
    universities: universityGatewayUniversities,
  }
}

export default withMainLayout(UniversitySearch, { showFooter: false })
