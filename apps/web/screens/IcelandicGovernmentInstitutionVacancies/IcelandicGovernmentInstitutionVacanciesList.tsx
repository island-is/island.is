import { useEffect, useMemo, useRef, useState } from 'react'
import isEqual from 'lodash/isEqual'
import { useRouter } from 'next/router'

import {
  AlertMessage,
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
  Inline,
  Pagination,
  Stack,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { sortAlpha } from '@island.is/shared/utils'
import { FilterTag, HeadWithSocialSharing } from '@island.is/web/components'
import {
  GetIcelandicGovernmentInstitutionVacanciesQuery,
  GetIcelandicGovernmentInstitutionVacanciesQueryVariables,
  GetNamespaceQuery,
  GetNamespaceQueryVariables,
  IcelandicGovernmentInstitutionVacanciesResponse,
} from '@island.is/web/graphql/schema'
import { useLinkResolver, useNamespace } from '@island.is/web/hooks'
import { useWindowSize } from '@island.is/web/hooks/useViewport'
import { withMainLayout } from '@island.is/web/layouts/main'
import { Screen } from '@island.is/web/types'
import { CustomNextError } from '@island.is/web/units/errors'

import { extractFilterTags } from '../Organization/PublishedMaterial/utils'
import { GET_NAMESPACE_QUERY } from '../queries'
import { GET_ICELANDIC_GOVERNMENT_INSTITUTION_VACANCIES } from '../queries/IcelandicGovernmentInstitutionVacancies'
import * as styles from './IcelandicGovernmentInstitutionVacanciesList.css'

type Vacancy =
  IcelandicGovernmentInstitutionVacanciesResponse['vacancies'][number]

const ITEMS_PER_PAGE = 8
export const VACANCY_INTRO_MAX_LENGTH = 80

export const shortenText = (text: string, maxLength: number) => {
  if (!text) return text

  if (text.length <= maxLength) {
    return text
  }

  const shortenedText = text.slice(0, maxLength)

  if (text[maxLength] === ' ') {
    return `${shortenedText} ...`
  }

  // Search for the nearest space before the maxLength
  const spaceIndex = shortenedText.lastIndexOf(' ')

  if (spaceIndex < 0) {
    return `${shortenedText} ...`
  }

  return `${text.slice(0, spaceIndex)} ...`
}

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
  fetchErrorOccured?: boolean
  namespace: Record<string, string>
}

const IcelandicGovernmentInstitutionVacanciesList: Screen<
  IcelandicGovernmentInstitutionVacanciesListProps
> = ({ vacancies, fetchErrorOccured, namespace }) => {
  const { query, replace, isReady } = useRouter()
  const n = useNamespace(namespace)
  const { linkResolver } = useLinkResolver()

  const { width } = useWindowSize()
  const isMobile = width < theme.breakpoints.md

  const pathname = linkResolver('vacancies').href

  const [selectedPage, setSelectedPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')

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

  const clearSearch = () => {
    setParameters({
      fieldOfWork: [],
      location: [],
      institution: [],
    })
    setSearchTerm('')
  }

  const totalPages = Math.ceil(filteredVacancies.length / ITEMS_PER_PAGE)

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

    const shouldScroll = updatedQuery.page !== selectedPage.toString()

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

  const selectedFilters = extractFilterTags(filterCategories)

  const mainTitle = n('mainTitle', 'Starfatorg - laus störf hjá ríkinu')
  const ogTitle = n('ogTitle', 'Starfatorg - laus störf hjá ríkinu | Ísland.is')
  const displayFetchErrorIfPresent = n('displayFetchErrorIfPresent', true)

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
              <Text marginTop={2} variant="h1" as="h1">
                {mainTitle}
              </Text>
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
                value={searchTerm}
                onChange={(value) => {
                  setSelectedPage(1)
                  setSearchTerm(value)
                  searchTermHasBeenInitialized.current = true
                }}
              />
            </Box>
          </Hidden>

          <Filter
            resultCount={filteredVacancies?.length ?? 0}
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
                  value={searchTerm}
                  onChange={(value) => {
                    setSelectedPage(1)
                    setSearchTerm(value)
                    searchTermHasBeenInitialized.current = true
                  }}
                />
              </Box>
            }
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

          <GridRow className={styles.filterTagRow} alignItems="center">
            <GridColumn span="8/12">
              <Inline space={1}>
                {selectedFilters.map(({ label, value, category }) => (
                  <FilterTag
                    key={value}
                    onClick={() => {
                      setParameters((prevParameters) => ({
                        ...prevParameters,
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore make web strict
                        [category]: (prevParameters[category] ?? []).filter(
                          (prevValue: string) => prevValue !== value,
                        ),
                      }))
                    }}
                  >
                    {label}
                  </FilterTag>
                ))}
              </Inline>
            </GridColumn>
          </GridRow>

          {fetchErrorOccured && displayFetchErrorIfPresent && (
            <Box paddingBottom={5}>
              <AlertMessage
                type="warning"
                title={n('fetchErrorTitle', 'Ekki tókst að sækja öll störf')}
                message={n(
                  'fetchErrorMessage',
                  'Villa kom upp við að sækja störf frá ytri kerfum og því er möguleiki að ekki öll auglýst séu sýnileg',
                )}
              />
            </Box>
          )}
        </Box>
      </GridContainer>
      <Box paddingTop={3} paddingBottom={6} background="blue100">
        <GridContainer>
          <Box marginBottom={6}>
            <Text>
              {filteredVacancies.length}{' '}
              {filteredVacancies.length % 10 === 1 &&
              filteredVacancies.length % 100 !== 11
                ? n('singleJobFound', 'starf fannst')
                : n('jobsFound', 'störf fundust')}
            </Text>
          </Box>
          <GridRow rowGap={[3, 3, 6]}>
            {filteredVacancies
              .slice(
                ITEMS_PER_PAGE * (selectedPage - 1),
                ITEMS_PER_PAGE * selectedPage,
              )
              .map((vacancy) => {
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
                      href={`${
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore make web strict
                        linkResolver('vacancydetails', [vacancy.id?.toString()])
                          .href
                      }`}
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
                              <Text variant="eyebrow">
                                {vacancy.fieldOfWork}
                              </Text>
                              <Text color="blue400" variant="h3">
                                {vacancy.title}
                              </Text>
                              <Text>
                                {shortenText(
                                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                  // @ts-ignore make web strict
                                  vacancy.intro,
                                  VACANCY_INTRO_MAX_LENGTH,
                                )}
                              </Text>
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
                              {vacancy.applicationDeadlineTo && (
                                <Tag outlined={true} disabled variant="purple">
                                  {n(
                                    'applicationDeadlineTo',
                                    'Umsóknarfrestur',
                                  )}{' '}
                                  {vacancy.applicationDeadlineTo}
                                </Tag>
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
          {filteredVacancies.length > 0 && (
            <Box paddingTop={8}>
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
        </GridContainer>
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

  if (namespace['display404']) {
    throw new CustomNextError(404, 'Vacancies on Ísland.is are turned off')
  }

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
    customAlertBanner: namespace['customAlertBanner'],
  }
}

export default withMainLayout(IcelandicGovernmentInstitutionVacanciesList, {
  footerVersion: 'organization',
})
