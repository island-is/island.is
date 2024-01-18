import { useMemo, useState } from 'react'
import { useDebounce } from 'react-use'
import flatten from 'lodash/flatten'
import {
  parseAsArrayOf,
  parseAsString,
  useQueryState,
} from 'next-usequerystate'
import { useLazyQuery } from '@apollo/client'

import {
  Box,
  Breadcrumbs,
  Button,
  Filter,
  FilterInput,
  FilterMultiChoice,
  FocusableBox,
  GridColumn,
  GridContainer,
  GridRow,
  Hidden,
  Hyphen,
  Inline,
  LoadingDots,
  Stack,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { sortAlpha } from '@island.is/shared/utils'
import {
  FilterTag,
  HeadWithSocialSharing,
  Webreader,
} from '@island.is/web/components'
import {
  FilterOptionListResponse,
  GetCmsVacanciesQuery,
  GetCmsVacanciesQueryVariables,
  GetExternalVacanciesQuery,
  GetExternalVacanciesQueryVariables,
  GetExternalVacancyFieldsOfWorkQuery,
  GetExternalVacancyFieldsOfWorkQueryVariables,
  GetExternalVacancyInstitutionsQuery,
  GetExternalVacancyInstitutionsQueryVariables,
  GetExternalVacancyLocationsQuery,
  GetExternalVacancyLocationsQueryVariables,
  GetNamespaceQuery,
  GetNamespaceQueryVariables,
  VacancyListItem,
} from '@island.is/web/graphql/schema'
import { useLinkResolver, useNamespace } from '@island.is/web/hooks'
import { useWindowSize } from '@island.is/web/hooks/useViewport'
import { withMainLayout } from '@island.is/web/layouts/main'
import { Screen } from '@island.is/web/types'
import { CustomNextError } from '@island.is/web/units/errors'
import { shortenText } from '@island.is/web/utils/shortenText'

import { extractFilterTags } from '../Organization/PublishedMaterial/utils'
import { GET_NAMESPACE_QUERY } from '../queries'
import {
  GET_CMS_VACANCIES,
  GET_EXTERNAL_VACANCIES,
  GET_EXTERNAL_VACANCY_FIELDS_OF_WORK,
  GET_EXTERNAL_VACANCY_INSTITUTIONS,
  GET_EXTERNAL_VACANCY_LOCATIONS,
} from '../queries/Vacancies'
import { sortVacancyList, VACANCY_INTRO_MAX_LENGTH } from './utils'
import * as styles from './VacanciesList.css'

const ITEMS_PER_PAGE = 8
const DEBOUNCE_TIME = 300

interface VacanciesListProps {
  cmsVacancies: GetCmsVacanciesQuery['cmsVacancies']['vacancies']
  initialExternalVacancies: GetExternalVacanciesQuery['externalVacancies']['vacancies']
  totalInitialExternalVacancyCount: number
  namespace: Record<string, string>
  institutionOptions: FilterOptionListResponse['options']
  locationOptions: FilterOptionListResponse['options']
  fieldOfWorkOptions: FilterOptionListResponse['options']
}

const VacanciesList: Screen<VacanciesListProps> = ({
  cmsVacancies,
  initialExternalVacancies,
  totalInitialExternalVacancyCount,
  namespace,
  institutionOptions,
  locationOptions,
  fieldOfWorkOptions,
}) => {
  const n = useNamespace(namespace)
  const { linkResolver } = useLinkResolver()
  const { width } = useWindowSize()
  const isMobile = width < theme.breakpoints.md

  const [page, setPage] = useState(1)
  const [externalVacanciesPage, setExternalVacanciesPage] = useState(1)
  const [query, setQuery] = useQueryState('q', parseAsString.withDefault(''))
  const [fieldOfWork, setFieldOfWork] = useQueryState(
    'fieldOfWork',
    parseAsArrayOf(parseAsString),
  )
  const [institution, setInstitution] = useQueryState(
    'institution',
    parseAsArrayOf(parseAsString),
  )
  const [location, setLocation] = useQueryState(
    'location',
    parseAsArrayOf(parseAsString),
  )
  const [externalVacancies, setExternalVacancies] = useState<
    VacancyListItem[][]
  >([initialExternalVacancies])
  const [totalExternalVacancyCount, setTotalExternalVacancyCount] = useState(
    totalInitialExternalVacancyCount,
  )

  const parameters = {
    fieldOfWork: {
      state: fieldOfWork,
      setState: setFieldOfWork,
    },
    institution: {
      state: institution,
      setState: setInstitution,
    },
    location: {
      state: location,
      setState: setLocation,
    },
  }

  const [fetchExternalVacancies, { loading }] = useLazyQuery<
    GetExternalVacanciesQuery,
    GetExternalVacanciesQueryVariables
  >(GET_EXTERNAL_VACANCIES, {
    onCompleted(data) {
      setExternalVacancies((prev) => {
        const updated = [...prev]
        updated[data.externalVacancies.input.page - 1] =
          data.externalVacancies.vacancies
        return updated
      })
      setTotalExternalVacancyCount(
        data.externalVacancies.total ?? data.externalVacancies.vacancies.length,
      )
    },
  })

  const filterCategories = [
    {
      id: 'location',
      label: n('location', 'Staðsetning') as string,
      selected: parameters.location.state ?? [],
      filters: locationOptions,
    },
    {
      id: 'fieldOfWork',
      label: n('fieldOfWork', 'Störf') as string,
      selected: parameters.fieldOfWork.state ?? [],
      filters: fieldOfWorkOptions,
    },
    {
      id: 'institution',
      label: n('institution', 'Stofnun/ráðuneyti') as string,
      selected: parameters.institution.state ?? [],
      filters: institutionOptions,
    },
  ]

  const selectedFilters = extractFilterTags(filterCategories)

  const clearFilters = () => {
    setExternalVacanciesPage(1)
    setPage(1)
    setQuery(null)
    setFieldOfWork(null)
    setInstitution(null)
    setLocation(null)
  }

  const mainTitle = n('mainTitle', 'Starfatorg - laus störf hjá ríkinu')
  const ogTitle = n('ogTitle', 'Starfatorg - laus störf hjá ríkinu | Ísland.is')

  useDebounce(
    () => {
      fetchExternalVacancies({
        variables: {
          input: {
            page: externalVacanciesPage,
            query,
            fieldOfWork: parameters.fieldOfWork.state,
            institution: parameters.institution.state,
            location: parameters.location.state,
          },
        },
      })
    },
    DEBOUNCE_TIME,
    [externalVacanciesPage, query, fieldOfWork, institution, location],
  )

  const { vacancies, totalVacancies } = useMemo(() => {
    const filteredCmsVacancies = cmsVacancies.filter((vacancy) => {
      const searchKeywords = query
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

      if (fieldOfWork && fieldOfWork.length > 0) {
        shouldBeShown = Boolean(
          shouldBeShown &&
            vacancy.fieldOfWork &&
            fieldOfWork.includes(vacancy.fieldOfWork),
        )
      }

      if (location && location.length > 0) {
        shouldBeShown =
          shouldBeShown &&
          Boolean(
            vacancy.locations?.some(
              (vacancyLocation) =>
                vacancyLocation?.title &&
                location.includes(vacancyLocation.title),
            ),
          )
      }

      if (institution && institution.length > 0) {
        shouldBeShown = Boolean(
          shouldBeShown &&
            vacancy.institutionName &&
            institution.includes(vacancy.institutionName),
        )
      }

      return shouldBeShown
    })

    const list = filteredCmsVacancies.concat(flatten(externalVacancies))
    sortVacancyList(list)

    const offset = (page - 1) * ITEMS_PER_PAGE

    return {
      vacancies: list.slice(offset, offset + ITEMS_PER_PAGE),
      totalVacancies: filteredCmsVacancies.length + totalExternalVacancyCount,
    }
  }, [
    cmsVacancies,
    externalVacancies,
    fieldOfWork,
    institution,
    location,
    page,
    query,
    totalExternalVacancyCount,
  ])

  const totalPages = Math.ceil(totalVacancies / ITEMS_PER_PAGE) || 1
  const pageText = `${n('currentPage', 'Síða')} ${page} ${n(
    'of',
    'af',
  )} ${totalPages}`

  return (
    <Box paddingTop={[0, 0, 8]}>
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
          <GridRow marginBottom={[5, 5, 5, 0]}>
            <GridColumn span={['1/1', '1/1', '1/1', '1/2']}>
              <Breadcrumbs items={[{ title: 'Ísland.is', href: '/' }]} />
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
            <GridColumn span="1/2">
              <Hidden below="lg">
                <Box display="flex" justifyContent="center" width="full">
                  <img
                    src={n(
                      'starfatorgIcon',
                      'https://images.ctfassets.net/8k0h54kbe6bj/1SY4juL47FNJT7kBNIsdqv/5e51b2319665a832549e6d0813dcd984/LE_-_Jobs_-_S3__1_.svg',
                    )}
                    alt=""
                  />
                </Box>
              </Hidden>
            </GridColumn>
          </GridRow>

          <Hidden above="sm">
            <Box marginBottom={3}>
              <FilterInput
                placeholder={n(
                  'filterSearchPlaceholder',
                  'Leita í Starfatorgi',
                )}
                name="filterInput"
                value={query || ''}
                onChange={(value) => {
                  setPage(1)
                  setExternalVacanciesPage(1)
                  setQuery(value || null)
                }}
              />
            </Box>
          </Hidden>

          <Filter
            resultCount={vacancies?.length ?? 0}
            variant={isMobile ? 'dialog' : 'popover'}
            labelClear={n('clearFilter', 'Hreinsa síu')}
            labelClearAll={n('clearAllFilters', 'Hreinsa allar síur')}
            labelOpen={n('openFilter', 'Sía niðurstöður')}
            labelClose={n('closeFilter', 'Loka síu')}
            labelResult={n('viewResults', 'Skoða niðurstöður')}
            labelTitle={n('filterMenuTitle', 'Sía niðurstöður')}
            onFilterClear={clearFilters}
            filterInput={
              <Box className={styles.filterInput}>
                <FilterInput
                  placeholder={n(
                    'filterSearchPlaceholder',
                    'Leita í Starfatorgi',
                  )}
                  name="filterInput"
                  value={query || ''}
                  onChange={(value) => {
                    setPage(1)
                    setExternalVacanciesPage(1)
                    setQuery(value || null)
                  }}
                />
              </Box>
            }
          >
            <FilterMultiChoice
              labelClear={n('clearSelection', 'Hreinsa val')}
              onChange={({ categoryId, selected }) => {
                parameters[categoryId as keyof typeof parameters]?.setState(
                  selected?.length > 0 ? [...selected] : null,
                )
                setPage(1)
                setExternalVacanciesPage(1)
              }}
              onClear={(categoryId) => {
                parameters[categoryId as keyof typeof parameters]?.setState(
                  null,
                )
                setPage(1)
                setExternalVacanciesPage(1)
              }}
              categories={filterCategories}
            />
          </Filter>

          <GridRow className={styles.filterTagRow} alignItems="center">
            <GridColumn span="8/12">
              <Inline space={1}>
                {selectedFilters.map(({ label, value, category }) => (
                  <FilterTag
                    key={`${label}-${value}-${category}`}
                    onClick={() => {
                      parameters[category as keyof typeof parameters]?.setState(
                        (prevState) => {
                          const newState =
                            prevState?.filter(
                              (prevValue) => prevValue !== value,
                            ) ?? null
                          if (!newState || newState?.length === 0) return null
                          return newState
                        },
                      )
                    }}
                  >
                    {label}
                  </FilterTag>
                ))}
              </Inline>
            </GridColumn>
          </GridRow>
        </Box>
      </GridContainer>

      <Box paddingTop={3} paddingBottom={6} background="blue100">
        <GridContainer>
          <GridRow>
            <GridColumn span="1/3">
              {typeof totalVacancies === 'number' && (
                <Box className="rs_read" marginBottom={6}>
                  <Text>
                    {totalVacancies}{' '}
                    {totalVacancies % 10 === 1 && totalVacancies % 100 !== 11
                      ? n('singleJobFound', 'starf fannst')
                      : n('jobsFound', 'störf fundust')}
                  </Text>
                </Box>
              )}
            </GridColumn>

            <GridColumn span="1/3">
              <Box display="flex" justifyContent="center">
                {loading && <LoadingDots />}
              </Box>
            </GridColumn>

            <GridColumn span="1/3">
              <Box display="flex" justifyContent="flexEnd">
                <Text>{pageText}</Text>
              </Box>
            </GridColumn>
          </GridRow>

          <GridRow rowGap={[3, 3, 6]}>
            {vacancies.map((vacancy) => {
              let logoUrl =
                vacancy.logoUrl ||
                n(
                  'fallbackLogoUrl',
                  'https://images.ctfassets.net/8k0h54kbe6bj/6XhCz5Ss17OVLxpXNVDxAO/d3d6716bdb9ecdc5041e6baf68b92ba6/coat_of_arms.svg',
                )

              const vacancyComesFromCms = vacancy.id?.startsWith('c-')

              if (!vacancy.institutionName && vacancyComesFromCms) {
                logoUrl = ''
              }

              return (
                <GridColumn
                  key={vacancy.id}
                  span={['1/1', '1/1', '1/1', '1/2']}
                >
                  <FocusableBox
                    height="full"
                    href={
                      linkResolver('vacancydetailsv2', [
                        vacancy.id?.toString() as string,
                      ]).href
                    }
                    background="white"
                    borderRadius="large"
                    borderColor="blue200"
                    borderWidth="standard"
                    padding={[3, 3, 'containerGutter']}
                    overflow="hidden"
                  >
                    <Box width="full">
                      <GridRow
                        rowGap={[2, 2, 2, 5]}
                        direction={['column', 'column', 'column', 'row']}
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore make web strict
                        alignItems={[null, null, null, 'center']}
                        align="spaceBetween"
                        className={styles.vacancyCard}
                      >
                        <GridColumn className={styles.vacancyCardText}>
                          <Stack space={2}>
                            <Text variant="eyebrow">{vacancy.fieldOfWork}</Text>
                            <Box className="rs_read">
                              <Text color="blue400" variant="h3">
                                <Hyphen>{vacancy.title ?? ''}</Hyphen>
                              </Text>
                            </Box>
                            <Box className="rs_read">
                              <Text>
                                {shortenText(
                                  vacancy.intro,
                                  VACANCY_INTRO_MAX_LENGTH,
                                )}
                              </Text>
                            </Box>
                            <Box className="rs_read">
                              <Inline space={1}>
                                {vacancy.institutionName && (
                                  <Tag outlined={true} disabled={true}>
                                    {vacancy.institutionName}
                                  </Tag>
                                )}
                                {vacancy.locations &&
                                  vacancy.locations
                                    .filter((location) => location.title)
                                    .map((location, index) => (
                                      <Tag key={index} outlined={true} disabled>
                                        {location.title}
                                      </Tag>
                                    ))}
                              </Inline>
                            </Box>
                            {vacancy.applicationDeadlineTo && (
                              <Box className="rs_read">
                                <Tag outlined={true} disabled variant="purple">
                                  {n(
                                    'applicationDeadlineTo',
                                    'Umsóknarfrestur',
                                  )}{' '}
                                  {vacancy.applicationDeadlineTo}
                                </Tag>
                              </Box>
                            )}
                          </Stack>
                        </GridColumn>

                        <GridColumn>
                          <Box width="full">
                            {logoUrl && (
                              <>
                                <Hidden below="lg">
                                  <img
                                    className={styles.logo}
                                    src={logoUrl}
                                    alt=""
                                  />
                                </Hidden>
                                <Hidden above="md">
                                  <Box
                                    display="flex"
                                    justifyContent="center"
                                    width="full"
                                  >
                                    <img
                                      className={styles.logo}
                                      src={logoUrl}
                                      alt=""
                                    />
                                  </Box>
                                </Hidden>
                              </>
                            )}
                          </Box>
                        </GridColumn>
                      </GridRow>
                    </Box>
                  </FocusableBox>
                </GridColumn>
              )
            })}
          </GridRow>

          <Box marginTop={6}>
            <Box marginTop={0} marginBottom={2} textAlign="center">
              <Text>{pageText}</Text>
            </Box>
            <Box
              display="flex"
              justifyContent="center"
              marginTop={3}
              textAlign="center"
            >
              {page > 1 && (
                <Button
                  onClick={() => {
                    window.scrollTo({ behavior: 'smooth', left: 0, top: 0 })
                    setPage((currentPage) => {
                      return currentPage - 1
                    })
                  }}
                >
                  {n('prevPage', 'Fyrri síða')}
                </Button>
              )}
              &nbsp;&nbsp;
              {page < totalPages && (
                <Button
                  onClick={() => {
                    window.scrollTo({ behavior: 'smooth', left: 0, top: 0 })
                    setPage((currentPage) => {
                      const newPage = currentPage + 1
                      if (
                        currentPage * ITEMS_PER_PAGE <
                        totalExternalVacancyCount
                      ) {
                        setExternalVacanciesPage(newPage)
                      }
                      return newPage
                    })
                  }}
                >
                  {n('nextPage', 'Næsta síða')}
                </Button>
              )}
            </Box>
          </Box>
        </GridContainer>
      </Box>
    </Box>
  )
}

VacanciesList.getProps = async ({ apolloClient, locale, query }) => {
  const queryString = parseAsString.withDefault('').parseServerSide(query.q)
  const institution = parseAsArrayOf(parseAsString).parseServerSide(
    query.institution,
  )
  const location = parseAsArrayOf(parseAsString).parseServerSide(query.location)
  const fieldOfWork = parseAsArrayOf(parseAsString).parseServerSide(
    query.fieldOfWork,
  )

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

  if (namespace['display404forV2']) {
    throw new CustomNextError(404, 'Vacancies V2 on Ísland.is are turned off')
  }

  const [
    externalVacanciesResponse,
    cmsVacanciesResponse,
    locationsResponse,
    fieldsOfWorkResponse,
    institutionsResponse,
  ] = await Promise.all([
    apolloClient.query<
      GetExternalVacanciesQuery,
      GetExternalVacanciesQueryVariables
    >({
      query: GET_EXTERNAL_VACANCIES,
      variables: {
        input: {
          page: 1,
          query: queryString,
          institution,
          location,
          fieldOfWork,
        },
      },
    }),
    apolloClient.query<GetCmsVacanciesQuery, GetCmsVacanciesQueryVariables>({
      query: GET_CMS_VACANCIES,
      variables: {
        input: {
          language: locale,
        },
      },
    }),
    apolloClient.query<
      GetExternalVacancyLocationsQuery,
      GetExternalVacancyLocationsQueryVariables
    >({
      query: GET_EXTERNAL_VACANCY_LOCATIONS,
    }),
    apolloClient.query<
      GetExternalVacancyFieldsOfWorkQuery,
      GetExternalVacancyFieldsOfWorkQueryVariables
    >({
      query: GET_EXTERNAL_VACANCY_FIELDS_OF_WORK,
    }),
    apolloClient.query<
      GetExternalVacancyInstitutionsQuery,
      GetExternalVacancyInstitutionsQueryVariables
    >({
      query: GET_EXTERNAL_VACANCY_INSTITUTIONS,
    }),
  ])

  const institutionOptions = [
    ...institutionsResponse.data.externalVacancyInstitutions.options,
  ]
  institutionOptions.sort(sortAlpha('label'))

  const locationOptions = [
    ...locationsResponse.data.externalVacancyLocations.options,
  ]
  locationOptions.sort(sortAlpha('label'))

  // Make sure that 'Óstaðbundið' is the first thing in the list
  {
    const index = locationOptions.findIndex(({ label }) =>
      label.includes('Óstaðbundið'),
    )
    if (index >= 0) {
      const option = locationOptions.splice(index, 1)[0]
      locationOptions.unshift(option)
    }
  }

  const fieldOfWorkOptions = [
    ...fieldsOfWorkResponse.data.externalVacancyFieldsOfWork.options,
  ]
  fieldOfWorkOptions.sort(sortAlpha('label'))

  return {
    cmsVacancies: cmsVacanciesResponse.data.cmsVacancies.vacancies,
    initialExternalVacancies:
      externalVacanciesResponse.data.externalVacancies.vacancies,
    totalInitialExternalVacancyCount:
      externalVacanciesResponse.data.externalVacancies.total ??
      externalVacanciesResponse.data.externalVacancies.vacancies.length,
    institutionOptions,
    locationOptions,
    fieldOfWorkOptions,
    namespace,
    customAlertBanner: namespace['customAlertBanner'],
  }
}

export default withMainLayout(VacanciesList, {
  footerVersion: 'organization',
})
