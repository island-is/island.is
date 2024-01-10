import { useState } from 'react'
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  useQueryState,
} from 'next-usequerystate'
import { useLazyQuery } from '@apollo/client'

import {
  Box,
  Breadcrumbs,
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
  Pagination,
  Stack,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
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
import { VACANCY_INTRO_MAX_LENGTH } from './utils'
import * as styles from './VacanciesList.css'

const ITEMS_PER_PAGE = 8

interface VacanciesListProps {
  cmsVacancies: GetCmsVacanciesQuery['cmsVacancies']['vacancies']
  externalVacancies: GetExternalVacanciesQuery['externalVacancies']['vacancies']
  totalVacancies: number
  namespace: Record<string, string>
  institutionOptions: FilterOptionListResponse['options']
  locationOptions: FilterOptionListResponse['options']
  fieldOfWorkOptions: FilterOptionListResponse['options']
}

const VacanciesList: Screen<VacanciesListProps> = ({
  cmsVacancies,
  externalVacancies,
  totalVacancies,
  namespace,
  institutionOptions,
  locationOptions,
  fieldOfWorkOptions,
}) => {
  const n = useNamespace(namespace)
  const { linkResolver } = useLinkResolver()
  const { width } = useWindowSize()
  const isMobile = width < theme.breakpoints.md

  const [page, setPage] = useQueryState('page', {
    ...parseAsInteger.withDefault(1),
    scroll: true,
  })
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

  const [queryVariables, setQueryVariables] =
    useState<GetExternalVacanciesQueryVariables>({
      input: {
        page,
        query,
        fieldOfWork: parameters.fieldOfWork.state,
        institution: parameters.institution.state,
        location: parameters.location.state,
      },
    })

  const [fetchMore] = useLazyQuery<
    GetExternalVacanciesQuery,
    GetExternalVacanciesQueryVariables
  >(GET_EXTERNAL_VACANCIES, {
    variables: queryVariables,
    onCompleted(data) {
      console.log(data)
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

  const clearSearch = () => {
    setPage(null)
  }

  const mainTitle = n('mainTitle', 'Starfatorg - laus störf hjá ríkinu')
  const ogTitle = n('ogTitle', 'Starfatorg - laus störf hjá ríkinu | Ísland.is')

  const vacancies = cmsVacancies.concat(externalVacancies)

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
                  setPage(null)
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
            onFilterClear={clearSearch}
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
                    setPage(null)
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
                setPage(null)
              }}
              onClear={(categoryId) => {
                parameters[categoryId as keyof typeof parameters]?.setState(
                  null,
                )
                setPage(null)
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
          {/* TODO: perhaps just have a button to go to previous page or next page, þá þarf kannsi samt að hafa núllstilla síu möguleika */}
          {vacancies.length > 0 && typeof totalVacancies === 'number' && (
            <Box paddingTop={8}>
              <Pagination
                variant="blue"
                page={page}
                itemsPerPage={ITEMS_PER_PAGE}
                totalItems={totalVacancies}
                renderLink={(page, className, children) => (
                  <button
                    onClick={() => {
                      setPage(page === 1 ? null : page)
                    }}
                  >
                    <span className={className}>{children}</span>
                  </button>
                )}
              />
            </Box>
          )}
        </GridContainer>
      </Box>
    </Box>
  )
}

VacanciesList.getProps = async ({ apolloClient, locale, query }) => {
  const queryString = parseAsString.withDefault('').parseServerSide(query.q)
  const page = parseAsInteger.withDefault(1).parseServerSide(query.page)
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
    typesResponse,
    institutionsResponse,
  ] = await Promise.all([
    apolloClient.query<
      GetExternalVacanciesQuery,
      GetExternalVacanciesQueryVariables
    >({
      query: GET_EXTERNAL_VACANCIES,
      variables: {
        input: {
          page,
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

  return {
    cmsVacancies: cmsVacanciesResponse.data.cmsVacancies.vacancies,
    externalVacancies:
      externalVacanciesResponse.data.externalVacancies.vacancies,
    totalVacancies:
      cmsVacanciesResponse.data.cmsVacancies.vacancies.length +
      (externalVacanciesResponse.data.externalVacancies.total ??
        externalVacanciesResponse.data.externalVacancies.vacancies.length),
    institutionOptions:
      institutionsResponse.data.externalVacancyInstitutions.options,
    locationOptions: locationsResponse.data.externalVacancyLocations.options,
    fieldOfWorkOptions: typesResponse.data.externalVacancyFieldsOfWork.options,
    namespace,
    customAlertBanner: namespace['customAlertBanner'],
  }
}

export default withMainLayout(VacanciesList, {
  footerVersion: 'organization',
})
