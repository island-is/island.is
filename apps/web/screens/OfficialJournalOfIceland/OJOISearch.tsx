import { useCallback, useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import debounce from 'lodash/debounce'
import { useRouter } from 'next/router'

import { useTypes } from '@island.is/application/templates/official-journal-of-iceland'
import {
  AlertMessage,
  Box,
  Button,
  DatePicker,
  Divider,
  DropdownMenu,
  Inline,
  Input,
  Pagination,
  Select,
  SkeletonLoader,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { debounceTime } from '@island.is/shared/constants'
import { Locale } from '@island.is/shared/types'
import {
  ContentLanguage,
  CustomPageUniqueIdentifier,
  OfficialJournalOfIcelandAdvertCategory,
  OfficialJournalOfIcelandAdvertEntity,
  OfficialJournalOfIcelandAdvertsResponse,
  OfficialJournalOfIcelandAdvertType,
  Query,
  QueryGetOrganizationArgs,
  QueryOfficialJournalOfIcelandAdvertsArgs,
  QueryOfficialJournalOfIcelandCategoriesArgs,
  QueryOfficialJournalOfIcelandDepartmentsArgs,
  QueryOfficialJournalOfIcelandInstitutionsArgs,
} from '@island.is/web/graphql/schema'
import { useLinkResolver } from '@island.is/web/hooks'
import { withMainLayout } from '@island.is/web/layouts/main'
import { CustomNextError } from '@island.is/web/units/errors'

import {
  emptyOption,
  findValueOption,
  mapEntityToOptions,
  mapYearOptions,
  OJOISearchGridView,
  OJOISearchListView,
  OJOIWrapper,
  removeEmptyFromObject,
} from '../../components/OfficialJournalOfIceland'
import {
  CustomScreen,
  withCustomPageWrapper,
} from '../CustomPage/CustomPageWrapper'
import { GET_ORGANIZATION_QUERY } from '../queries'
import {
  ADVERTS_QUERY,
  CATEGORIES_QUERY,
  DEPARTMENTS_QUERY,
  INSTITUTIONS_QUERY,
} from '../queries/OfficialJournalOfIceland'
import { ORGANIZATION_SLUG } from './constants'
import { useAdverts } from './hooks'
import { m } from './messages'
import * as styles from './OJOIPage.css'

const DEBOUNCE_MS = 600

type OJOISearchParams = {
  q: string
  deild: string
  tegund: string
  timabil: string
  malaflokkur: string
  stofnun: string
  dagsFra?: string // DATE STRING
  dagsTil?: string // DATE STRING
  sida?: number
  staerd?: number
  year?: string
  sortBy?: string
  direction?: string
  sort?: string // format: 'date-desc', 'date-asc', 'number-desc', 'number-asc'
}

const OJOISearchPage: CustomScreen<OJOISearchProps> = ({
  initialAdverts,
  categories,
  departments,
  defaultSearchParams,
  institutions,
  organization,
  locale,
  todayISO,
}) => {
  const { formatMessage } = useIntl()
  const { linkResolver } = useLinkResolver()
  const router = useRouter()
  const today = useMemo(() => new Date(todayISO), [todayISO])

  const [listView, setListView] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => setHydrated(true), [])

  const baseUrl = linkResolver('ojoihome', [], locale).href
  const searchUrl = linkResolver('ojoisearch', [], locale).href

  const [localSearchValue, setLocalSearchValue] = useState(
    defaultSearchParams.q,
  )

  const [sortBy, direction] = defaultSearchParams.sort?.split('-') ?? []

  const { adverts, paging, loading, error, refetch } = useAdverts({
    vars: {
      department: [defaultSearchParams.deild],
      category: [defaultSearchParams.malaflokkur],
      involvedParty: [defaultSearchParams.stofnun],
      type: [defaultSearchParams.tegund],
      dateFrom: defaultSearchParams.dagsFra,
      dateTo: defaultSearchParams.dagsTil,
      search: defaultSearchParams.q,
      page: defaultSearchParams.sida,
      pageSize: defaultSearchParams.staerd,
      year: defaultSearchParams.year,
      sortBy: sortBy,
      direction: direction,
    },
    fallbackData: initialAdverts,
  })

  const [searchState, setSearchState] = useState({
    q: defaultSearchParams.q,
    deild: defaultSearchParams.deild,
    tegund: defaultSearchParams.tegund,
    timabil: defaultSearchParams.timabil,
    malaflokkur: defaultSearchParams.malaflokkur,
    stofnun: defaultSearchParams.stofnun,
    dagsFra: defaultSearchParams.dagsFra,
    dagsTil: defaultSearchParams.dagsTil,
    sida: defaultSearchParams.sida ?? 1,
    year: defaultSearchParams.year,
    sort: defaultSearchParams.sort,
    staerd: defaultSearchParams.staerd,
  })

  const updateSearchStateHandler = useCallback(
    (
      key: keyof typeof searchState,
      value: string | number | Date | undefined,
    ) => {
      setSearchState((prev) => {
        const parsed =
          typeof value === 'string'
            ? value.trim()
            : typeof value === 'number'
            ? value
            : value instanceof Date
            ? value
            : undefined

        const shouldClearType = key === 'deild' && parsed !== prev.deild

        const RESET_ON_CHANGE: Array<keyof typeof prev> = [
          'q',
          'deild',
          'tegund',
          'malaflokkur',
          'stofnun',
          'dagsFra',
          'dagsTil',
          'year',
          'staerd', // items per page change -> go back to page 1
          'sort',
        ]

        const RESET_SORTING_ON_CHANGE: Array<keyof typeof prev> = [
          'q',
          'deild',
          'tegund',
          'malaflokkur',
          'stofnun',
          'dagsFra',
          'dagsTil',
          'year',
        ]
        const isResetKey = RESET_ON_CHANGE.includes(key)

        const nextPage =
          key === 'sida'
            ? typeof parsed === 'number'
              ? parsed
              : 1 // direct page change
            : isResetKey
            ? 1
            : prev.sida

        const next = {
          ...prev,
          [key]: parsed,
          sida: nextPage,
          ...(shouldClearType ? { tegund: '' } : {}),
          ...(RESET_SORTING_ON_CHANGE.includes(key) ? { sort: undefined } : {}),
        }

        if (hydrated) {
          const qObj = removeEmptyFromObject({
            ...next,
            [key]:
              parsed instanceof Date
                ? parsed.toISOString().split('T')[0]
                : parsed,
          })

          router.replace({ pathname: searchUrl, query: qObj }, undefined, {
            shallow: true,
          })

          const [sortBy, direction] = next.sort?.split('-') ?? []

          refetch({
            input: {
              department: [next.deild].filter(Boolean),
              category: [next.malaflokkur].filter(Boolean),
              involvedParty: [next.stofnun].filter(Boolean),
              type: next.tegund ? next.tegund.split(',') : [],
              dateFrom: next.dagsFra,
              dateTo: next.dagsTil,
              search: next.q,
              page: next.sida,
              pageSize: next.staerd,
              year: next.year,
              sortBy: sortBy,
              direction: direction,
            },
          })
        }

        return next
      })
    },
    [hydrated, refetch, router, searchUrl],
  )

  const debouncedSetQ = useMemo(
    () =>
      debounce((q: string) => updateSearchStateHandler('q', q), DEBOUNCE_MS, {
        leading: false,
        trailing: true,
      }),
    [updateSearchStateHandler],
  )
  useEffect(() => () => debouncedSetQ.cancel(), [debouncedSetQ])

  const resetFilter = () => {
    router.replace(searchUrl, {}, { shallow: true })
    setLocalSearchValue('')
    setSearchState({
      q: '',
      deild: '',
      tegund: '',
      timabil: '',
      malaflokkur: '',
      stofnun: '',
      dagsFra: undefined,
      dagsTil: undefined,
      sida: 1,
      staerd: 20,
      year: undefined,
      sort: undefined,
    })

    refetch({
      input: {
        department: [],
        category: [],
        involvedParty: [],
        type: [],
        dateFrom: undefined,
        dateTo: undefined,
        search: '',
        page: undefined,
        pageSize: undefined,
        year: undefined,
        sortBy: undefined,
        direction: undefined,
      },
    })
  }
  const { types } = useTypes({
    initalDepartmentId: searchState.deild,
  })

  const categoriesOptions = mapEntityToOptions(categories)
  const departmentsOptions = mapEntityToOptions(departments)
  const typesOptions = mapEntityToOptions(types)
  const institutionsOptions = mapEntityToOptions(institutions)
  const yearOptions = mapYearOptions()

  const breadcrumbItems = [
    {
      title: formatMessage(m.breadcrumb.frontpage),
      href: linkResolver('homepage', [], locale).href,
    },
    {
      title: organization?.title ?? '',
      href: baseUrl,
    },
    {
      title: formatMessage(m.search.breadcrumbTitle),
    },
  ]

  const debouncedSearch = useMemo(
    () => debounce(updateSearchStateHandler, debounceTime.search),
    [updateSearchStateHandler],
  )

  useEffect(() => {
    return () => debouncedSearch.cancel()
  }, [debouncedSearch])

  return (
    <OJOIWrapper
      pageTitle={formatMessage(m.search.title)}
      pageDescription={formatMessage(m.search.description)}
      organization={organization ?? undefined}
      pageFeaturedImage={formatMessage(m.home.featuredImage)}
      goBackUrl={baseUrl}
      sidebarContent={
        <Box
          component="form"
          background="blue100"
          padding={[2, 2, 3]}
          borderRadius="large"
          action={searchUrl}
        >
          <Stack space={[1, 1, 2]}>
            <Text variant="h4">Leit</Text>

            <Input
              name="q"
              placeholder={formatMessage(m.search.inputPlaceholder)}
              size="xs"
              id="search-input-ojoi"
              value={localSearchValue}
              onKeyDown={(e) => {
                if (e.key === 'Enter') debouncedSetQ.flush()
              }}
              onBlur={() => debouncedSetQ.flush()}
              loading={loading}
              onChange={(e) => {
                const v = e.target.value
                setLocalSearchValue(v)
                debouncedSetQ(v)
              }}
            />

            <Divider weight={'blueberry200'} />

            <Box display="flex" justifyContent={'spaceBetween'}>
              <Text variant="h4">{formatMessage(m.search.filterTitle)}</Text>
              <Button
                type="button"
                as="button"
                variant="text"
                onClick={resetFilter}
                size="small"
              >
                {formatMessage(m.search.clearFilter)}
              </Button>
            </Box>

            <Select
              name="deild"
              label={formatMessage(m.search.departmentLabel)}
              size="xs"
              instanceId="ojoi-department-select"
              inputId="ojoi-department-select-input"
              placeholder={formatMessage(m.search.departmentPlaceholder)}
              options={[
                { ...emptyOption(formatMessage(m.search.departmentAll)) },
                ...departmentsOptions,
              ]}
              isClearable
              value={findValueOption(departmentsOptions, searchState.deild)} // <—
              onChange={(v) =>
                updateSearchStateHandler('deild', v?.value ?? '')
              }
            />

            <Select
              name="tegund"
              instanceId="ojoisearch-tegund"
              inputId="ojoisearch-tegund-input"
              label={formatMessage(m.search.typeLabel)}
              size="xs"
              placeholder={formatMessage(m.search.typePlaceholder)}
              options={[
                { ...emptyOption(formatMessage(m.search.typeAll)) },
                ...typesOptions,
              ]}
              isClearable
              value={findValueOption(typesOptions, searchState.tegund)}
              onChange={(v) =>
                updateSearchStateHandler('tegund', v?.value ?? '')
              }
            />

            <Select
              name="malaflokkur"
              instanceId="ojoisearch-malaflokkur"
              inputId="ojoisearch-malaflokkur-input"
              label={formatMessage(m.search.categoriesLabel)}
              size="xs"
              placeholder={formatMessage(m.search.categoriesPlaceholder)}
              options={[
                { ...emptyOption(formatMessage(m.search.categoriesAll)) },
                ...categoriesOptions,
              ]}
              isClearable
              isSearchable
              value={findValueOption(
                categoriesOptions,
                searchState.malaflokkur,
              )}
              onChange={(v) =>
                updateSearchStateHandler('malaflokkur', v?.value ?? '')
              }
            />

            <DatePicker
              size="xs"
              locale="is"
              id="ojoisearch-dagsFra"
              name="dagsFra"
              label={formatMessage(m.search.dateFromLabel)}
              placeholderText={formatMessage(m.search.dateFromPlaceholder)}
              minDate={new Date('1950-01-01')}
              maxDate={
                searchState.dagsTil ? new Date(searchState.dagsTil) : undefined
              }
              selected={
                searchState.dagsFra ? new Date(searchState.dagsFra) : undefined
              }
              handleChange={(date) => updateSearchStateHandler('dagsFra', date)}
            />

            <DatePicker
              size="xs"
              locale="is"
              id="ojoisearch-dagsTil"
              name="dagsTil"
              label={formatMessage(m.search.dateToLabel)}
              placeholderText={formatMessage(m.search.dateToPlaceholder)}
              minDate={
                searchState.dagsFra ? new Date(searchState.dagsFra) : undefined
              }
              maxDate={today}
              selected={
                searchState.dagsTil ? new Date(searchState.dagsTil) : undefined
              }
              handleChange={(date) => updateSearchStateHandler('dagsTil', date)}
            />

            <Select
              name="stofnun"
              instanceId="ojoisearch-stofnun"
              inputId="ojoisearch-stofnun-input"
              label={formatMessage(m.search.institutionLabel)}
              size="xs"
              placeholder={formatMessage(m.search.institutionPlaceholder)}
              options={[
                { ...emptyOption(formatMessage(m.search.institutionAll)) },
                ...institutionsOptions,
              ]}
              isClearable
              isSearchable
              value={findValueOption(institutionsOptions, searchState.stofnun)}
              onChange={(v) =>
                updateSearchStateHandler('stofnun', v?.value ?? '')
              }
            />

            <Select
              name="year"
              instanceId="ojoisearch-year"
              inputId="ojoisearch-year-input"
              label={formatMessage(m.search.chooseYear)}
              size="xs"
              placeholder={formatMessage(m.search.allYears)}
              options={[
                { ...emptyOption(formatMessage(m.search.allYears)) },
                ...yearOptions,
              ]}
              isClearable
              isSearchable
              value={findValueOption(yearOptions, searchState.year)}
              onChange={(v) => updateSearchStateHandler('year', v?.value ?? '')}
            />
          </Stack>
        </Box>
      }
      breadcrumbItems={breadcrumbItems}
    >
      {!!error && (
        <Box marginBottom={3}>
          <AlertMessage
            title={formatMessage(m.search.errorFetchingAdvertsTitle)}
            message={formatMessage(m.search.errorFetchingAdvertsMessage)}
            type="error"
          />
        </Box>
      )}
      {loading ? (
        <SkeletonLoader
          repeat={5}
          height={200}
          borderRadius="large"
          space={3}
        />
      ) : adverts?.length ? (
        <Stack space={3}>
          <Inline justifyContent="spaceBetween">
            <Button
              onClick={() => setListView(!listView)}
              size="small"
              iconType="outline"
              icon={listView ? 'copy' : 'menu'}
              variant="utility"
            >
              {listView
                ? formatMessage(m.search.cardView)
                : formatMessage(m.search.listView)}
            </Button>
            <DropdownMenu
              menuClassName={styles.searchDropdown}
              icon="swapVertical"
              items={[
                {
                  title: formatMessage(m.search.publicationDateSortNew),
                  icon:
                    searchState.sort === 'date-desc' ? 'checkmark' : undefined,
                  onClick: () => {
                    if (searchState.sort === 'date-desc') {
                      updateSearchStateHandler('sort', undefined)
                    } else {
                      updateSearchStateHandler('sort', 'date-desc')
                    }
                  },
                },
                {
                  title: formatMessage(m.search.publicationDateSortOld),
                  icon:
                    searchState.sort === 'date-asc' ? 'checkmark' : undefined,
                  onClick: () => {
                    if (searchState.sort === 'date-asc') {
                      updateSearchStateHandler('sort', undefined)
                    } else {
                      updateSearchStateHandler('sort', 'date-asc')
                    }
                  },
                },
                {
                  title: formatMessage(m.search.numberSortNew),
                  icon:
                    searchState.sort === 'number-desc'
                      ? 'checkmark'
                      : undefined,
                  onClick: () => {
                    if (searchState.sort === 'number-desc') {
                      updateSearchStateHandler('sort', undefined)
                    } else {
                      updateSearchStateHandler('sort', 'number-desc')
                    }
                  },
                },
                {
                  title: formatMessage(m.search.numberSortOld),
                  icon:
                    searchState.sort === 'number-asc' ? 'checkmark' : undefined,
                  onClick: () => {
                    if (searchState.sort === 'number-asc') {
                      updateSearchStateHandler('sort', undefined)
                    } else {
                      updateSearchStateHandler('sort', 'number-asc')
                    }
                  },
                },
              ]}
              menuLabel={formatMessage(m.search.sortBy)}
              title={formatMessage(m.search.sortBy)}
            />
          </Inline>

          {listView ? (
            <OJOISearchListView adverts={adverts} locale={locale} />
          ) : (
            <OJOISearchGridView adverts={adverts} locale={locale} />
          )}
          {searchState.sida && (
            <Pagination
              page={searchState.sida}
              itemsPerPage={searchState.staerd}
              totalItems={paging?.totalItems}
              totalPages={paging?.totalPages}
              renderLink={(page, className, children) => (
                <button
                  className={className}
                  onClick={() => {
                    try {
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    } catch {
                      // noop
                    }
                    updateSearchStateHandler('sida', page ?? 1)
                  }}
                >
                  {children}
                </button>
              )}
            />
          )}
        </Stack>
      ) : (
        <Box padding={[2, 3, 4]} border={'standard'} borderRadius="large">
          <Text variant="h3" as="h2">
            {formatMessage(m.search.notFoundTitle)}
          </Text>
          <Text>{formatMessage(m.search.notFoundMessage)}</Text>
        </Box>
      )}
    </OJOIWrapper>
  )
}

interface OJOISearchProps {
  initialAdverts?: OfficialJournalOfIcelandAdvertsResponse['adverts']
  categories?: Array<OfficialJournalOfIcelandAdvertCategory>
  departments?: Array<OfficialJournalOfIcelandAdvertEntity>
  types?: Array<OfficialJournalOfIcelandAdvertType>
  institutions?: Array<OfficialJournalOfIcelandAdvertEntity>
  organization?: Query['getOrganization']
  defaultSearchParams: OJOISearchParams
  locale: Locale
  todayISO: string
}

const OJOISearch: CustomScreen<OJOISearchProps> = ({
  initialAdverts,
  categories,
  departments,
  types,
  institutions,
  organization,
  locale,
  customPageData,
  defaultSearchParams,
  todayISO,
}) => {
  return (
    <OJOISearchPage
      initialAdverts={initialAdverts}
      categories={categories}
      departments={departments}
      types={types}
      institutions={institutions}
      organization={organization}
      locale={locale}
      customPageData={customPageData}
      defaultSearchParams={defaultSearchParams}
      todayISO={todayISO}
    />
  )
}

OJOISearch.getProps = async ({ apolloClient, locale, query }) => {
  const getStringFromQuery = (key?: string | string[]) => {
    if (typeof key === 'string') {
      return key
    }

    if (Array.isArray(key)) {
      return key[0]
    }

    return ''
  }

  let dateFrom: string | undefined
  let dateTo: string | undefined
  let page: number | undefined
  let pageSize: number | undefined
  let year: string | undefined
  const todayISO = new Date().toISOString().split('T')[0]

  if (query.dagsFra && typeof query.dagsFra === 'string') {
    const isValid = !Number.isNaN(Date.parse(query.dagsFra))
    if (isValid) {
      dateFrom = new Date(query.dagsFra).toISOString().split('T')[0]
    }
  }

  if (query.dagsTil && typeof query.dagsTil === 'string') {
    const isValid = !Number.isNaN(Date.parse(query.dagsTil))
    if (isValid) {
      dateTo = new Date(query.dagsTil).toISOString().split('T')[0]
    }
  }

  if (query.year && typeof query.year === 'string') {
    year = query.year
  }

  if (query.sida && typeof query.sida === 'string') {
    const check = !Number.isNaN(parseInt(query.sida))

    if (check) {
      page = parseInt(query.sida)
    }
  }

  if (query.pageSize && typeof query.pageSize === 'string') {
    const check = !Number.isNaN(parseInt(query.pageSize))

    if (check) {
      pageSize = parseInt(query.pageSize)
    }
  }

  const defaultParams = {
    deild: getStringFromQuery(query.deild),
    dagsFra: dateFrom,
    dagsTil: dateTo,
    malaflokkur: getStringFromQuery(query.malaflokkur),
    q: getStringFromQuery(query.q),
    stofnun: getStringFromQuery(query.stofnun),
    tegund: getStringFromQuery(query.tegund),
    timabil: getStringFromQuery(query.timabil),
    sida: page ?? 1,
    year,
    pageSize,
    sort: getStringFromQuery(query.sort),
  }

  const [
    {
      data: { officialJournalOfIcelandAdverts },
    },
    {
      data: { officialJournalOfIcelandCategories },
    },
    {
      data: { officialJournalOfIcelandDepartments },
    },
    {
      data: { officialJournalOfIcelandInstitutions },
    },
    {
      data: { getOrganization },
    },
  ] = await Promise.all([
    apolloClient.query<Query, QueryOfficialJournalOfIcelandAdvertsArgs>({
      query: ADVERTS_QUERY,
      fetchPolicy: 'cache-first',
      notifyOnNetworkStatusChange: false,
      variables: {
        input: {
          category: [defaultParams.malaflokkur],
          dateFrom: defaultParams.dagsFra,
          dateTo: defaultParams.dagsTil,
          department: [defaultParams.deild],
          involvedParty: [defaultParams.stofnun],
          page: defaultParams.sida,
          pageSize: defaultParams.pageSize,
          search: defaultParams.q,
          type: [defaultParams.tegund],
          year: defaultParams.year,
          sortBy: defaultParams.sort?.split('-')[0],
          direction: defaultParams.sort?.split('-')[1],
        },
      },
    }),
    apolloClient.query<Query, QueryOfficialJournalOfIcelandCategoriesArgs>({
      query: CATEGORIES_QUERY,
      variables: {
        params: {
          pageSize: 1000,
        },
      },
    }),
    apolloClient.query<Query, QueryOfficialJournalOfIcelandDepartmentsArgs>({
      query: DEPARTMENTS_QUERY,
      variables: {
        params: {},
      },
    }),

    apolloClient.query<Query, QueryOfficialJournalOfIcelandInstitutionsArgs>({
      query: INSTITUTIONS_QUERY,
      variables: {
        params: {
          pageSize: 1000,
        },
      },
    }),
    apolloClient.query<Query, QueryGetOrganizationArgs>({
      query: GET_ORGANIZATION_QUERY,
      variables: {
        input: {
          slug: ORGANIZATION_SLUG,
          lang: locale as ContentLanguage,
        },
      },
    }),
  ])

  if (!getOrganization?.hasALandingPage) {
    throw new CustomNextError(404, 'Organization page not found')
  }

  return {
    initialAdverts: officialJournalOfIcelandAdverts?.adverts,
    categories: officialJournalOfIcelandCategories?.categories,
    departments: officialJournalOfIcelandDepartments?.departments,

    institutions: officialJournalOfIcelandInstitutions?.institutions,
    organization: getOrganization,
    locale: locale as Locale,
    showSearchInHeader: false,
    themeConfig: {
      footerVersion: 'organization',
    },
    todayISO,
    defaultSearchParams: {
      deild: defaultParams.deild,
      dagsFra: defaultParams.dagsFra,
      dagsTil: defaultParams.dagsTil,
      malaflokkur: defaultParams.malaflokkur,
      q: defaultParams.q,
      stofnun: defaultParams.stofnun,
      tegund: defaultParams.tegund,
      timabil: defaultParams.timabil,
      sida: defaultParams.sida,
      staerd: defaultParams.pageSize,
      year: defaultParams.year,
      sort: defaultParams.sort,
    },
  }
}

export default withMainLayout(
  withCustomPageWrapper(
    CustomPageUniqueIdentifier.OfficialJournalOfIceland,
    OJOISearch,
  ),
)
