import { useEffect, useMemo, useState } from 'react'
import { useIntl } from 'react-intl'
import debounce from 'lodash/debounce'
import { useRouter } from 'next/router'
import { useLazyQuery } from '@apollo/client'

import {
  Box,
  Button,
  DatePicker,
  Divider,
  Input,
  Select,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { debounceTime } from '@island.is/shared/constants'
import { Locale } from '@island.is/shared/types'
import {
  ContentLanguage,
  CustomPageUniqueIdentifier,
  OfficialJournalOfIcelandAdvert,
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
  QueryOfficialJournalOfIcelandTypesArgs,
} from '@island.is/web/graphql/schema'
import { useLinkResolver } from '@island.is/web/hooks'
import { withMainLayout } from '@island.is/web/layouts/main'
import { CustomNextError } from '@island.is/web/units/errors'

import {
  emptyOption,
  findValueOption,
  mapEntityToOptions,
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
  TYPES_QUERY,
} from '../queries/OfficialJournalOfIceland'
import { m } from './messages'

const initialState = {
  sida: '',
  q: '',
  deild: '', // department
  tegund: '', // type
  timabil: '', // dateFrom - dateTo
  malaflokkur: '', // category
  stofnun: '', // involvedParty
  dagsFra: '',
  dagsTil: '',
}

const OJOISearchPage: CustomScreen<OJOISearchProps> = ({
  initialAdverts,
  categories,
  departments,
  types,
  institutions,
  organization,
  locale,
}) => {
  const { formatMessage } = useIntl()
  const router = useRouter()
  const { linkResolver } = useLinkResolver()

  const [adverts, setAdverts] = useState(initialAdverts)

  const [searchState, setSearchState] = useState(initialState)
  const [listView, setListView] = useState(false)

  const baseUrl = linkResolver('ojoihome', [], locale).href
  const searchUrl = linkResolver('ojoisearch', [], locale).href

  const [getAdverts] = useLazyQuery<
    {
      officialJournalOfIcelandAdverts: OfficialJournalOfIcelandAdvertsResponse
    },
    QueryOfficialJournalOfIcelandAdvertsArgs
  >(ADVERTS_QUERY, { fetchPolicy: 'no-cache' })

  useEffect(() => {
    const searchParams = new URLSearchParams(document.location.search)
    setSearchState({
      sida: searchParams.get('sida') ?? '',
      q: searchParams.get('q') ?? '',
      deild: searchParams.get('deild') ?? '',
      tegund: searchParams.get('tegund') ?? '',
      timabil: searchParams.get('timabil') ?? '',
      malaflokkur: searchParams.get('malaflokkur') ?? '',
      stofnun: searchParams.get('stofnun') ?? '',
      dagsFra: searchParams.get('dagsFra') ?? '',
      dagsTil: searchParams.get('dagsTil') ?? '',
    })
  }, [])

  const fetchAdverts = useMemo(() => {
    return debounce((state: typeof initialState) => {
      getAdverts({
        variables: {
          input: {
            search: state.q,
            page: state.sida ? parseInt(state.sida) : undefined,
            department: state.deild ? [state.deild] : undefined,
            type: state.tegund ? [state.tegund] : undefined,
            category: state.malaflokkur ? [state.malaflokkur] : undefined,
            involvedParty: state.stofnun ? [state.stofnun] : undefined,
            dateFrom: state.dagsFra ? new Date(state.dagsFra) : undefined,
            dateTo: state.dagsTil ? new Date(state.dagsTil) : undefined,
          },
        },
      })
        .then((res) => {
          if (res.data) {
            setAdverts(res.data.officialJournalOfIcelandAdverts.adverts)
          } else if (res.error) {
            setAdverts([])
            console.error('Error fetching Adverts', res.error)
          }
        })
        .catch((err) => {
          setAdverts([])
          console.error('Error fetching Adverts', { err })
        })
    }, debounceTime.search)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const isEmpty = !Object.entries(searchState).filter(([_, v]) => !!v).length
    if (isEmpty) {
      setAdverts(initialAdverts)
    } else {
      fetchAdverts(searchState)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchState])

  const breadcrumbItems = [
    {
      title: 'Ísland.is',
      href: linkResolver('homepage', [], locale).href,
    },
    {
      title: organization?.title ?? '',
      href: baseUrl,
    },
    {
      title: 'Leitarniðurstöður',
    },
  ]

  const updateSearchParams = useMemo(() => {
    return debounce((state: Record<string, string>) => {
      router.replace(
        searchUrl,
        {
          query: removeEmptyFromObject(state),
        },
        { shallow: true },
      )
    }, debounceTime.search)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const updateSearchState = (key: keyof typeof initialState, value: string) => {
    const newState = {
      ...searchState,
      [key]: value,
    }
    setSearchState(newState)
    updateSearchParams(newState)
  }

  const resetFilter = () => {
    setSearchState(initialState)
    updateSearchParams(initialState)
    setAdverts(initialAdverts)
  }

  const categoriesOptions = mapEntityToOptions(categories)
  const departmentsOptions = mapEntityToOptions(departments)
  const typesOptions = mapEntityToOptions(types)
  const institutionsOptions = mapEntityToOptions(institutions)

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
              value={searchState.q}
              onChange={(e) => updateSearchState('q', e.target.value)}
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
              placeholder={formatMessage(m.search.departmentPlaceholder)}
              options={[
                { ...emptyOption(formatMessage(m.search.departmentAll)) },
                ...departmentsOptions,
              ]}
              isClearable
              isSearchable
              value={findValueOption(departmentsOptions, searchState.deild)}
              onChange={(v) => updateSearchState('deild', v?.value ?? '')}
            />

            <Select
              name="tegund"
              label={formatMessage(m.search.typeLabel)}
              size="xs"
              placeholder={formatMessage(m.search.typePlaceholder)}
              options={[
                { ...emptyOption(formatMessage(m.search.typeAll)) },
                ...typesOptions,
              ]}
              isClearable
              value={findValueOption(typesOptions, searchState.tegund)}
              onChange={(v) => updateSearchState('tegund', v?.value ?? '')}
            />

            <Select
              name="malaflokkur"
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
              onChange={(v) => updateSearchState('malaflokkur', v?.value ?? '')}
            />

            <DatePicker
              size="xs"
              locale="is"
              name="dagsFra"
              label={formatMessage(m.search.dateFromLabel)}
              placeholderText={formatMessage(m.search.dateFromPlaceholder)}
              selected={
                searchState.dagsFra ? new Date(searchState.dagsFra) : undefined
              }
              minDate={new Date('1950-01-01')}
              maxDate={
                searchState.dagsTil ? new Date(searchState.dagsTil) : undefined
              }
              handleChange={(date) =>
                updateSearchState(
                  'dagsFra',
                  date ? date.toISOString().slice(0, 10) : '',
                )
              }
            />

            <DatePicker
              size="xs"
              locale="is"
              name="dagsTil"
              label={formatMessage(m.search.dateToLabel)}
              placeholderText={formatMessage(m.search.dateToPlaceholder)}
              selected={
                searchState.dagsTil ? new Date(searchState.dagsTil) : undefined
              }
              minDate={
                searchState.dagsFra ? new Date(searchState.dagsFra) : undefined
              }
              maxDate={new Date()}
              handleChange={(date) =>
                updateSearchState(
                  'dagsTil',
                  date ? date.toISOString().slice(0, 10) : '',
                )
              }
            />

            <Select
              name="stofnun"
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
              onChange={(v) => updateSearchState('stofnun', v?.value ?? '')}
            />
          </Stack>
        </Box>
      }
      breadcrumbItems={breadcrumbItems}
    >
      {adverts?.length ? (
        <Stack space={3}>
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

          {listView ? (
            <OJOISearchListView adverts={adverts} locale={locale} />
          ) : (
            <OJOISearchGridView adverts={adverts} locale={locale} />
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
  initialAdverts?: OfficialJournalOfIcelandAdvert[]
  categories?: Array<OfficialJournalOfIcelandAdvertCategory>
  departments?: Array<OfficialJournalOfIcelandAdvertEntity>
  types?: Array<OfficialJournalOfIcelandAdvertType>
  institutions?: Array<OfficialJournalOfIcelandAdvertEntity>
  organization?: Query['getOrganization']
  locale: Locale
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
    />
  )
}

OJOISearch.getProps = async ({ apolloClient, locale }) => {
  const organizationSlug = 'stjornartidindi'

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
      data: { officialJournalOfIcelandTypes },
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
      variables: {
        input: {},
      },
    }),
    apolloClient.query<Query, QueryOfficialJournalOfIcelandCategoriesArgs>({
      query: CATEGORIES_QUERY,
      variables: {
        params: {},
      },
    }),
    apolloClient.query<Query, QueryOfficialJournalOfIcelandDepartmentsArgs>({
      query: DEPARTMENTS_QUERY,
      variables: {
        params: {},
      },
    }),
    apolloClient.query<Query, QueryOfficialJournalOfIcelandTypesArgs>({
      query: TYPES_QUERY,
      variables: {
        params: {},
      },
    }),
    apolloClient.query<Query, QueryOfficialJournalOfIcelandInstitutionsArgs>({
      query: INSTITUTIONS_QUERY,
      variables: {
        params: {},
      },
    }),
    apolloClient.query<Query, QueryGetOrganizationArgs>({
      query: GET_ORGANIZATION_QUERY,
      variables: {
        input: {
          slug: organizationSlug,
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
    types: officialJournalOfIcelandTypes?.types,
    institutions: officialJournalOfIcelandInstitutions?.institutions,
    organization: getOrganization,
    locale: locale as Locale,
    showSearchInHeader: false,
    themeConfig: {
      footerVersion: 'organization',
    },
  }
}

export default withMainLayout(
  withCustomPageWrapper(
    CustomPageUniqueIdentifier.OfficialJournalOfIceland,
    OJOISearch,
  ),
)
