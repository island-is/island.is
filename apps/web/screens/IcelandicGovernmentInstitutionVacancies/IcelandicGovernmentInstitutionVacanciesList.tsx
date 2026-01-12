import { useEffect, useMemo, useRef, useState } from 'react'
import { useWindowSize } from 'react-use'
import isEqual from 'lodash/isEqual'
import { useRouter } from 'next/router'

import {
  AlertMessage,
  Box,
  Breadcrumbs,
  Button,
  Filter,
  FilterInput,
  FilterMultiChoice,
  GridColumn,
  GridContainer,
  GridRow,
  Inline,
  Pagination,
  Stack,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { isDefined, sortAlpha } from '@island.is/shared/utils'
import { HeadWithSocialSharing, Webreader } from '@island.is/web/components'
import {
  CustomPageUniqueIdentifier,
  GetIcelandicGovernmentInstitutionVacanciesQuery,
  GetIcelandicGovernmentInstitutionVacanciesQueryVariables,
  GetNamespaceQuery,
  GetNamespaceQueryVariables,
  IcelandicGovernmentInstitutionVacanciesResponse,
} from '@island.is/web/graphql/schema'
import { useLinkResolver, useNamespace } from '@island.is/web/hooks'
import { withMainLayout } from '@island.is/web/layouts/main'
import { Screen } from '@island.is/web/types'

import { withCustomPageWrapper } from '../CustomPage/CustomPageWrapper'
import { GET_NAMESPACE_QUERY } from '../queries'
import { GET_ICELANDIC_GOVERNMENT_INSTITUTION_VACANCIES } from '../queries/IcelandicGovernmentInstitutionVacancies'
import { getDeadlineVariant, getExcerpt } from './utils'
import { VacancyCardsGrid } from './VacancyCardsGrid'
import * as styles from './IcelandicGovernmentInstitutionVacanciesList.css'

type Vacancy =
  IcelandicGovernmentInstitutionVacanciesResponse['vacancies'][number]

const ITEMS_PER_PAGE = 12
const SHOW_CURRENT_BREADCRUMB = false
export const VACANCY_INTRO_MAX_LENGTH = 280

const mapVacanciesField = (
  vacancies: Vacancy[],
  fieldName: keyof Vacancy,
  remoteLocationText?: string,
) => {
  const fieldSet = new Set<string | number>()
  for (const vacancy of vacancies) {
    const field = vacancy[fieldName]
    if (!field) continue
    if (Array.isArray(field)) {
      for (const item of field) {
        if (item?.title) fieldSet.add(item.title)
      }
    } else {
      fieldSet.add(field)
    }
  }
  const vacanciesFieldArray = Array.from(fieldSet).map((field) => ({
    label: String(field),
    value: String(field),
  }))

  vacanciesFieldArray.sort(sortAlpha('label'))

  // Make sure the remote location filter option is at the top
  if (fieldName === 'locations' && remoteLocationText) {
    const index = vacanciesFieldArray.findIndex(
      (item) => item.label === remoteLocationText,
    )
    if (index >= 0) {
      vacanciesFieldArray.splice(index, 1)
      vacanciesFieldArray.unshift({
        label: remoteLocationText,
        value: remoteLocationText,
      })
    }
  }

  return vacanciesFieldArray
}

interface IcelandicGovernmentInstitutionVacanciesListProps {
  vacancies: Vacancy[]
  namespace: Record<string, string>
  fetchErrorOccurred?: boolean | null
}

const IcelandicGovernmentInstitutionVacanciesList: Screen<
  IcelandicGovernmentInstitutionVacanciesListProps
> = ({ vacancies, namespace, fetchErrorOccurred }) => {
  const { query, replace, isReady } = useRouter()
  const n = useNamespace(namespace)
  const { linkResolver } = useLinkResolver()

  const pathname = linkResolver('vacancies').href

  const [selectedPage, setSelectedPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [isGridView, setIsGridView] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  const { width } = useWindowSize()
  // Guard against SSR hydration mismatch - default to desktop layout on server
  const isTablet = isMounted && width <= theme.breakpoints.lg

  const [parameters, setParameters] = useState<{
    fieldOfWork: string[]
    location: string[]
    institution: string[]
  }>({
    fieldOfWork: [],
    location: [],
    institution: [],
  })

  const searchTermHasBeenInitialized = useRef(false)

  // Set mounted state after first render to enable responsive layout
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Force grid view on mobile/tablet
  useEffect(() => {
    if (isTablet && !isGridView) {
      setIsGridView(true)
    }
  }, [isTablet, isGridView])

  const filteredVacancies = vacancies.filter((vacancy) => {
    const searchKeywords = searchTerm
      .replace('´', '')
      .trim()
      .toLowerCase()
      .split(' ')

    const searchTermMatches = searchKeywords.every(
      (keyword) =>
        vacancy.title?.toLowerCase()?.includes(keyword) ||
        vacancy.institutionName?.toLowerCase()?.includes(keyword) ||
        vacancy.intro?.toLowerCase()?.includes(keyword),
    )

    let shouldBeShown = searchTermMatches

    if (parameters.fieldOfWork.length > 0) {
      shouldBeShown = Boolean(
        shouldBeShown &&
          vacancy.fieldOfWork &&
          parameters.fieldOfWork.includes(vacancy.fieldOfWork),
      )
    }

    if (parameters.location.length > 0) {
      shouldBeShown =
        shouldBeShown &&
        Boolean(
          vacancy.locations?.some(
            (location) =>
              location?.title && parameters.location.includes(location?.title),
          ),
        )
    }

    if (parameters.institution.length > 0) {
      shouldBeShown = Boolean(
        shouldBeShown &&
          vacancy.institutionName &&
          parameters.institution.includes(vacancy.institutionName),
      )
    }

    return shouldBeShown
  })

  const fieldOfWorkOptions = useMemo(
    () => mapVacanciesField(vacancies, 'fieldOfWork'),
    [vacancies],
  )

  const locationOptions = useMemo(
    () =>
      mapVacanciesField(
        vacancies,
        'locations',
        n('remoteLocation', 'Án staðsetningar') as string,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [vacancies],
  )

  const institutionOptions = useMemo(
    () => mapVacanciesField(vacancies, 'institutionName'),
    [vacancies],
  )

  const filterCategories = [
    {
      id: 'location',
      label: n('location', 'Staðsetning') as string,
      selected: parameters.location,
      filters: locationOptions,
    },
    {
      id: 'fieldOfWork',
      label: n('fieldOfWork', 'Störf') as string,
      selected: parameters.fieldOfWork,
      filters: fieldOfWorkOptions,
    },
    {
      id: 'institution',
      label: n('institution', 'Stofnun/ráðuneyti') as string,
      selected: parameters.institution,
      filters: institutionOptions,
    },
  ]

  const clearSearch = () => {
    setParameters({
      fieldOfWork: [],
      location: [],
      institution: [],
    })
    setSearchTerm('')
  }

  const renderFilterTags = (
    filterType: 'fieldOfWork' | 'location' | 'institution',
    filters: string[],
  ) => {
    return filters.map((filter) => (
      <Tag
        key={filter}
        variant="white"
        onClick={() => {
          setParameters((prev) => ({
            ...prev,
            [filterType]: prev[filterType].filter((f) => f !== filter),
          }))
          setSelectedPage(1)
        }}
      >
        <Box flexDirection="row" alignItems="center">
          {filter}
          <Box
            component="span"
            marginLeft={1}
            style={{ fontSize: '0.75rem', fontWeight: 'normal' }}
          >
            &#10005;
          </Box>
        </Box>
      </Tag>
    ))
  }

  const totalPages = Math.ceil(filteredVacancies.length / ITEMS_PER_PAGE)

  const paginatedVacancies = filteredVacancies.slice(
    ITEMS_PER_PAGE * (selectedPage - 1),
    ITEMS_PER_PAGE * selectedPage,
  )

  const vacancyCards = paginatedVacancies
    .map((vacancy) => {
      if (!vacancy || !vacancy.id) {
        return null
      }

      const logoUrl =
        vacancy.logoUrl ||
        n(
          'fallbackLogoUrl',
          'https://images.ctfassets.net/8k0h54kbe6bj/6XhCz5Ss17OVLxpXNVDxAO/d3d6716bdb9ecdc5041e6baf68b92ba6/coat_of_arms.svg',
        )

      const vacancyComesFromCms = vacancy.id?.startsWith('c-')
      const displayLogoUrl =
        !vacancy.institutionName && vacancyComesFromCms ? '' : logoUrl

      const detailLines = [
        vacancy.locations && vacancy.locations.length > 0
          ? {
              icon: 'location' as const,
              text: vacancy.locations
                .filter((location) => location.title)
                .map((location) => location.title)
                .join(', '),
            }
          : undefined,
        vacancy.address
          ? {
              icon: 'home' as const,
              text: vacancy.address,
            }
          : undefined,
      ].filter(isDefined)

      const tags = [
        vacancy.applicationDeadlineTo && {
          label: `${n('applicationDeadlineTo', 'Umsóknarfrestur')}: ${
            vacancy.applicationDeadlineTo
          }`,
          variant: getDeadlineVariant(vacancy.applicationDeadlineTo),
        },
      ].filter(isDefined)

      return {
        id: vacancy.id,
        eyebrow: vacancy.fieldOfWork ?? vacancy.institutionName ?? '',
        subEyebrow: vacancy.institutionName,
        title: vacancy.title ?? '',
        description: getExcerpt(vacancy.intro ?? '', VACANCY_INTRO_MAX_LENGTH),
        logo: displayLogoUrl,
        logoAlt: vacancy.institutionName ?? '',
        link: {
          label: n('viewDetails', 'Skoða nánar'),
          href: linkResolver('vacancydetails', [vacancy.id?.toString() || ''])
            .href,
        },
        tags,
        detailLines,
      }
    })
    .filter(isDefined)

  // Initial page load
  useEffect(() => {
    if (!isReady) return

    // Page number initialization
    if (query.page) {
      let queriedPage = Number(query.page)
      if (!isNaN(queriedPage) && queriedPage > 0) {
        if (queriedPage > totalPages) {
          queriedPage = totalPages
        }
        setSelectedPage(queriedPage)
      }
    }

    // Filter initialization
    const updatedParameters = {}

    if (query.location) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore make web strict
      updatedParameters['location'] =
        typeof query.location === 'string' ? [query.location] : query.location
    }

    if (query.fieldOfWork) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore make web strict
      updatedParameters['fieldOfWork'] =
        typeof query.fieldOfWork === 'string'
          ? [query.fieldOfWork]
          : query.fieldOfWork
    }

    if (query.institution) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore make web strict
      updatedParameters['institution'] =
        typeof query.institution === 'string'
          ? [query.institution]
          : query.institution
    }

    if (Object.keys(updatedParameters).length > 0) {
      setParameters((params) => ({
        ...params,
        ...updatedParameters,
      }))
    }

    // Search term initialization
    if (query.q && !searchTerm && !searchTermHasBeenInitialized.current) {
      searchTermHasBeenInitialized.current = true
      setSearchTerm(query.q as string)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady])

  // Append search params to url when they change
  useEffect(() => {
    const updatedQuery = { ...query }

    const shouldScroll = (updatedQuery.page ?? '1') !== selectedPage.toString()

    if (selectedPage === 1) {
      if ('page' in updatedQuery) delete updatedQuery['page']
    } else {
      updatedQuery.page = selectedPage.toString()
    }

    if (!searchTerm) {
      if ('q' in updatedQuery) delete updatedQuery['q']
    } else {
      updatedQuery.q = searchTerm
    }

    if (!parameters.fieldOfWork) {
      if ('fieldOfWork' in updatedQuery) delete updatedQuery['fieldOfWork']
    } else {
      updatedQuery.fieldOfWork = parameters.fieldOfWork
    }

    if (!parameters.institution) {
      if ('institution' in updatedQuery) delete updatedQuery['institution']
    } else {
      updatedQuery.institution = parameters.institution
    }

    if (!parameters.location) {
      if ('location' in updatedQuery) delete updatedQuery['location']
    } else {
      updatedQuery.location = parameters.location
    }
    if (!isEqual(query, updatedQuery)) {
      replace(
        {
          pathname,
          query: updatedQuery,
        },
        undefined,
        { shallow: true, scroll: shouldScroll },
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parameters, searchTerm, selectedPage])

  const mainTitle = n('mainTitle', 'Starfatorg - laus störf hjá ríkinu')
  const ogTitle = n('ogTitle', 'Starfatorg - laus störf hjá ríkinu | Ísland.is')
  const displayFetchErrorIfPresent = n('displayFetchErrorIfPresent', true)

  return (
    <Box paddingTop={8} paddingBottom={6}>
      <HeadWithSocialSharing
        title={ogTitle}
        description={n(
          'ogDescription',
          'Á Starfatorginu er að finna upplýsingar um laus störf hjá ríkinu.',
        )}
        imageUrl={n(
          'ogImageUrl',
          'https://images.ctfassets.net/8k0h54kbe6bj/5LqU9yD9nzO5oOijpZF0K0/b595e1cf3e72bc97b2f9d869a53f5da9/LE_-_Jobs_-_S3.png',
        )}
      />
      <GridContainer>
        <Box>
          <GridRow marginBottom={5}>
            <GridColumn span={['1/1', '1/1', '1/1', '1/2']}>
              <Breadcrumbs
                items={[
                  { title: 'Ísland.is', href: '/' },
                  SHOW_CURRENT_BREADCRUMB
                    ? {
                        title: n('breadcrumbTitle', 'Starfatorg'),
                        href: linkResolver('vacancies').href,
                      }
                    : undefined,
                ].filter(isDefined)}
              />
              <Box className="rs_read" marginTop={2}>
                <Text variant="h1" as="h1">
                  {mainTitle}
                </Text>
              </Box>
              <Webreader
                marginBottom={[0, 0, 0, 4]}
                readId={undefined}
                readClass="rs_read"
              />
            </GridColumn>
            {!isTablet && (
              <GridColumn span="1/2">
                <Box display="flex" justifyContent="center" width="full">
                  <img
                    src={n(
                      'starfatorgIcon',
                      'https://images.ctfassets.net/8k0h54kbe6bj/1SY4juL47FNJT7kBNIsdqv/5e51b2319665a832549e6d0813dcd984/LE_-_Jobs_-_S3__1_.svg',
                    )}
                    alt=""
                  />
                </Box>
              </GridColumn>
            )}
          </GridRow>
          {fetchErrorOccurred && displayFetchErrorIfPresent && (
            <Box paddingBottom={5}>
              <AlertMessage
                type="warning"
                title={n('fetchErrorTitle', 'Ekki tókst að sækja öll störf')}
                message={n(
                  'fetchErrorMessage',
                  'Villa kom upp við að sækja störf frá ytri kerfum og því er möguleiki að ekki öll auglýst störf séu sýnileg',
                )}
              />
            </Box>
          )}
        </Box>
      </GridContainer>
      <Box background="blue100">
        {!isTablet && (
          <GridContainer>
            <Box
              display="flex"
              flexDirection="row"
              height="full"
              paddingY={6}
              position="relative"
            >
              {/* Sidebar */}
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
                    {n('search', 'Leit')}
                  </Text>
                  <FilterInput
                    placeholder={n(
                      'filterSearchPlaceholder',
                      'Leita í Starfatorgi',
                    )}
                    name="sidebarFilterInput"
                    value={searchTerm}
                    onChange={(value) => {
                      setSelectedPage(1)
                      setSearchTerm(value)
                      searchTermHasBeenInitialized.current = true
                    }}
                  />
                  <Filter
                    labelClear={n('clear', 'Hreinsa')}
                    labelClearAll={n('clearAllFilters', 'Hreinsa allar síur')}
                    labelOpen={n('open', 'Opna')}
                    labelClose={n('close', 'Loka')}
                    labelResult={n('showResults', 'Skoða niðurstöður')}
                    labelTitle={n('filterResults', 'Sía niðurstöður')}
                    onFilterClear={() => {
                      setParameters({
                        fieldOfWork: [],
                        location: [],
                        institution: [],
                      })
                    }}
                    variant="default"
                  >
                    <FilterMultiChoice
                      labelClear={n('clearFilter', 'Hreinsa val')}
                      onChange={({ categoryId, selected }) => {
                        setSelectedPage(1)
                        setParameters((prevParams) => ({
                          ...prevParams,
                          [categoryId]: selected,
                        }))
                      }}
                      onClear={(categoryId) => {
                        setSelectedPage(1)
                        setParameters((prevParams) => ({
                          ...prevParams,
                          [categoryId]: [],
                        }))
                      }}
                      categories={filterCategories}
                    />
                  </Filter>
                </Stack>
              </Box>

              {/* Content */}
              <Box
                flexGrow={1}
                paddingLeft={2}
                className={styles.contentWrapper}
              >
                <Box
                  className="rs_read"
                  marginBottom={3}
                  display="flex"
                  justifyContent="spaceBetween"
                  alignItems="center"
                >
                  <Text>
                    <strong>{filteredVacancies.length}</strong>{' '}
                    {filteredVacancies.length % 10 === 1 &&
                    filteredVacancies.length % 100 !== 11
                      ? n('singleJobFound', 'starf fannst')
                      : n('jobsFound', 'störf fundust')}
                  </Text>
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
                        ? n('displayList', 'Sýna sem lista')
                        : n('displayGrid', 'Sýna sem spjöld')}
                    </Button>
                  )}
                </Box>
                {(parameters.fieldOfWork.length > 0 ||
                  parameters.location.length > 0 ||
                  parameters.institution.length > 0) && (
                  <Box marginBottom={3}>
                    <Inline space={2}>
                      {renderFilterTags('fieldOfWork', parameters.fieldOfWork)}
                      {renderFilterTags('location', parameters.location)}
                      {renderFilterTags('institution', parameters.institution)}
                    </Inline>
                  </Box>
                )}
                <Box
                  style={{ minHeight: '100vh' }}
                  className={styles.vacancyCardsWrapper}
                >
                  <VacancyCardsGrid
                    columns={!isGridView ? 1 : 2}
                    variant="detailed"
                    cards={vacancyCards}
                  />
                  {vacancyCards.length === 0 && (
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      paddingY={8}
                    >
                      <Text variant="h5">
                        {n('noResults', 'Engar niðurstöður fundust')}
                      </Text>
                    </Box>
                  )}
                </Box>
                {filteredVacancies.length > 0 && (
                  <Box marginTop={2} paddingBottom={2}>
                    <Pagination
                      variant="blue"
                      page={selectedPage}
                      itemsPerPage={ITEMS_PER_PAGE}
                      totalItems={filteredVacancies.length}
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
                )}
              </Box>
            </Box>
          </GridContainer>
        )}
        {isTablet && (
          <Box marginX={3} paddingTop={3}>
            <Stack space={1}>
              <Text variant="h5" as="h4" paddingY={1}>
                {n('search', 'Leit')}
              </Text>
              <FilterInput
                placeholder={n(
                  'filterSearchPlaceholder',
                  'Leita í Starfatorgi',
                )}
                name="mobileFilterInput"
                value={searchTerm}
                onChange={(value) => {
                  setSelectedPage(1)
                  setSearchTerm(value)
                  searchTermHasBeenInitialized.current = true
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.currentTarget.blur()
                  }
                }}
                backgroundColor="white"
              />
            </Stack>
            <Box
              marginTop={2}
              display="flex"
              justifyContent="spaceBetween"
              alignItems="center"
            >
              <Text>
                <strong>{filteredVacancies.length}</strong>{' '}
                {filteredVacancies.length % 10 === 1 &&
                filteredVacancies.length % 100 !== 11
                  ? n('singleJobFound', 'starf fannst')
                  : n('jobsFound', 'störf fundust')}
              </Text>
              <Box>
                <Filter
                  resultCount={filteredVacancies?.length ?? 0}
                  variant="dialog"
                  labelClear={n('clearFilter', 'Hreinsa síu')}
                  labelClearAll={n('clearAllFilters', 'Hreinsa allar síur')}
                  labelOpen={n('openFilter', 'Sía niðurstöður')}
                  labelClose={n('closeFilter', 'Loka síu')}
                  labelResult={n('viewResults', 'Skoða niðurstöður')}
                  labelTitle={n('filterMenuTitle', 'Sía niðurstöður')}
                  onFilterClear={clearSearch}
                  align="right"
                  usePopoverDiscloureButtonStyling
                >
                  <FilterMultiChoice
                    labelClear={n('clearSelection', 'Hreinsa val')}
                    onChange={({ categoryId, selected }) => {
                      setSelectedPage(1)
                      setParameters((prevParameters) => ({
                        ...prevParameters,
                        [categoryId]: selected,
                      }))
                    }}
                    onClear={(categoryId) => {
                      setSelectedPage(1)
                      setParameters((prevParameters) => ({
                        ...prevParameters,
                        [categoryId]: [],
                      }))
                    }}
                    categories={filterCategories}
                  />
                </Filter>
              </Box>
            </Box>
            {(parameters.fieldOfWork.length > 0 ||
              parameters.location.length > 0 ||
              parameters.institution.length > 0) && (
              <Box marginTop={2}>
                <Inline space={2}>
                  {renderFilterTags('fieldOfWork', parameters.fieldOfWork)}
                  {renderFilterTags('location', parameters.location)}
                  {renderFilterTags('institution', parameters.institution)}
                </Inline>
              </Box>
            )}
            <Box
              marginTop={2}
              style={{ minHeight: '100vh' }}
              className={styles.vacancyCardsWrapper}
            >
              <VacancyCardsGrid
                columns={1}
                variant="detailed"
                cards={vacancyCards}
                forceMediumSize={true}
              />
              {vacancyCards.length === 0 && (
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  paddingY={8}
                >
                  <Text variant="h5">
                    {n('noResults', 'Engar niðurstöður fundust')}
                  </Text>
                </Box>
              )}
            </Box>
            {filteredVacancies.length > 0 && (
              <Box marginTop={2} paddingBottom={4}>
                <Pagination
                  variant="blue"
                  page={selectedPage}
                  itemsPerPage={ITEMS_PER_PAGE}
                  totalItems={filteredVacancies.length}
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
            )}
          </Box>
        )}
      </Box>
    </Box>
  )
}

IcelandicGovernmentInstitutionVacanciesList.getProps = async ({
  apolloClient,
  locale,
}) => {
  const namespaceResponse = await apolloClient.query<
    GetNamespaceQuery,
    GetNamespaceQueryVariables
  >({
    query: GET_NAMESPACE_QUERY,
    variables: {
      input: {
        lang: locale,
        namespace: 'Starfatorg',
      },
    },
  })

  const namespace = JSON.parse(
    namespaceResponse?.data?.getNamespace?.fields || '{}',
  ) as Record<string, string>

  const vacanciesResponse = await apolloClient.query<
    GetIcelandicGovernmentInstitutionVacanciesQuery,
    GetIcelandicGovernmentInstitutionVacanciesQueryVariables
  >({
    query: GET_ICELANDIC_GOVERNMENT_INSTITUTION_VACANCIES,
    variables: {
      input: {},
    },
  })

  const { vacancies, fetchErrorOccurred } =
    vacanciesResponse.data.icelandicGovernmentInstitutionVacancies

  return {
    vacancies,
    namespace,
    fetchErrorOccurred,
  }
}

export default withMainLayout(
  withCustomPageWrapper(
    CustomPageUniqueIdentifier.Vacancies,
    IcelandicGovernmentInstitutionVacanciesList,
  ),
  {
    footerVersion: 'organization',
  },
)
