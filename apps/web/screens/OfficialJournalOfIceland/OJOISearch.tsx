import { useEffect, useMemo, useState } from 'react'
import { Locale } from 'locale'
import debounce from 'lodash/debounce'
import { useRouter } from 'next/router'
import { useLazyQuery } from '@apollo/client'

import {
  MinistryOfJusticeAdvert,
  MinistryOfJusticeAdvertCategory,
  MinistryOfJusticeAdvertEntity,
  MinistryOfJusticeAdvertsResponse,
  MinistryOfJusticeAdvertType,
  QueryMinistryOfJusticeInvolvedPartiesArgs,
  QueryMinistryOfJusticeTypesArgs,
} from '@island.is/api/schema'
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
import { getThemeConfig } from '@island.is/web/components'
import {
  ContentLanguage,
  Query,
  QueryGetNamespaceArgs,
  QueryGetOrganizationPageArgs,
  QueryMinistryOfJusticeAdvertsArgs,
  QueryMinistryOfJusticeCategoriesArgs,
  QueryMinistryOfJusticeDepartmentsArgs,
} from '@island.is/web/graphql/schema'
import { useLinkResolver, useNamespace } from '@island.is/web/hooks'
import useContentfulId from '@island.is/web/hooks/useContentfulId'
import { withMainLayout } from '@island.is/web/layouts/main'
import { CustomNextError } from '@island.is/web/units/errors'

import {
  baseUrl,
  emptyOption,
  findValueOption,
  mapEntityToOptions,
  OJOIWrapper,
  removeEmptyFromObject,
  searchUrl,
} from '../../components/OfficialJournalOfIceland'
import { OJOISearchGridView } from '../../components/OfficialJournalOfIceland/OJOISearchGridView'
import { OJOISearchListView } from '../../components/OfficialJournalOfIceland/OJOISearchListView'
import { Screen } from '../../types'
import {
  GET_NAMESPACE_QUERY,
  GET_ORGANIZATION_PAGE_QUERY,
  GET_ORGANIZATION_QUERY,
} from '../queries'
import {
  ADVERTS_QUERY,
  CATEGORIES_QUERY,
  DEPARTMENTS_QUERY,
  INVOLVED_PARTIES_QUERY,
  TYPES_QUERY,
} from '../queries/OfficialJournalOfIceland'

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

const OJOISearchPage: Screen<OJOISearchProps> = ({
  initialAdverts,
  categories,
  departments,
  types,
  involvedParties,
  organizationPage,
  organization,
  namespace,
  locale,
}) => {
  const router = useRouter()
  const { linkResolver } = useLinkResolver()
  const n = useNamespace(namespace)
  useContentfulId(organizationPage?.id)

  const [adverts, setAdverts] = useState(initialAdverts)

  const organizationNamespace = useMemo(() => {
    return JSON.parse(organization?.namespace?.fields || '{}')
  }, [organization?.namespace?.fields])

  const o = useNamespace(organizationNamespace)

  const [searchState, setSearchState] = useState(initialState)
  const [listView, setListView] = useState(false)

  const [getAdverts] = useLazyQuery<
    { ministryOfJusticeAdverts: MinistryOfJusticeAdvertsResponse },
    QueryMinistryOfJusticeAdvertsArgs
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
            setAdverts(res.data.ministryOfJusticeAdverts.adverts)
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
      title: organizationPage?.title ?? '',
      href: linkResolver(
        'organizationpage',
        [organizationPage?.slug ?? ''],
        locale,
      ).href,
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
  const involvedPartiesOptions = mapEntityToOptions(involvedParties)

  return (
    <OJOIWrapper
      pageTitle={n('searchPageTitle', 'Leit í Stjórnartíðindum')}
      pageDescription={organizationPage?.description}
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      organizationPage={organizationPage!}
      pageFeaturedImage={organizationPage?.featuredImage ?? undefined}
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
              placeholder="Leit í Stjórnartíðindum"
              size="xs"
              value={searchState.q}
              onChange={(e) => updateSearchState('q', e.target.value)}
            />

            <Divider weight={'blueberry200'} />

            <Box display="flex" justifyContent={'spaceBetween'}>
              <Text variant="h4">Síun</Text>
              <Button
                type="button"
                as="button"
                variant="text"
                onClick={resetFilter}
                size="small"
              >
                Hreinsa síun
              </Button>
            </Box>

            <Select
              name="deild"
              label="Deild"
              size="xs"
              placeholder="Veldu deild"
              options={[
                { ...emptyOption('Allar deildir') },
                ...departmentsOptions,
              ]}
              isClearable
              isSearchable
              value={findValueOption(departmentsOptions, searchState.deild)}
              onChange={(v) => updateSearchState('deild', v?.value ?? '')}
            />

            <Select
              name="tegund"
              label="Tegund"
              size="xs"
              placeholder="Veldu tegund"
              options={[{ ...emptyOption('Allar tegundir') }, ...typesOptions]}
              isClearable
              value={findValueOption(typesOptions, searchState.tegund)}
              onChange={(v) => updateSearchState('tegund', v?.value ?? '')}
            />

            <Select
              name="malaflokkur"
              label="Málaflokkur"
              size="xs"
              placeholder="Veldu málaflokk"
              options={[
                { ...emptyOption('Allir flokkar') },
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
              label="Dags. frá"
              placeholderText="Veldu upphafsdagsetningu"
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
              label="Dags. til"
              placeholderText="Veldu lokadagsetningu"
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
              label="Stofnun"
              size="xs"
              placeholder="Veldu stofnun"
              options={[
                { ...emptyOption('Allir stofnanir') },
                ...involvedPartiesOptions,
              ]}
              isClearable
              isSearchable
              value={findValueOption(
                involvedPartiesOptions,
                searchState.stofnun,
              )}
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
            {listView ? 'Sýna sem spjöld' : 'Sýna sem listi'}
          </Button>

          {listView ? (
            <OJOISearchListView adverts={adverts} />
          ) : (
            <OJOISearchGridView adverts={adverts} />
          )}
        </Stack>
      ) : (
        <Box padding={[2, 3, 4]} border={'standard'} borderRadius="large">
          <Text variant="h3" as="h2">
            Engin mál fundust
          </Text>
          <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Text>
        </Box>
      )}
    </OJOIWrapper>
  )
}

interface OJOISearchProps {
  initialAdverts?: MinistryOfJusticeAdvert[]
  categories?: Array<MinistryOfJusticeAdvertCategory>
  departments?: Array<MinistryOfJusticeAdvertEntity>
  types?: Array<MinistryOfJusticeAdvertType>
  involvedParties?: Array<MinistryOfJusticeAdvertEntity>
  organizationPage?: Query['getOrganizationPage']
  organization?: Query['getOrganization']
  namespace: Record<string, string>
  locale: Locale
}

const OJOISearch: Screen<OJOISearchProps> = ({
  initialAdverts,
  categories,
  departments,
  types,
  involvedParties,
  organizationPage,
  organization,
  namespace,
  locale,
}) => {
  return (
    <OJOISearchPage
      initialAdverts={initialAdverts}
      categories={categories}
      departments={departments}
      types={types}
      involvedParties={involvedParties}
      namespace={namespace}
      organizationPage={organizationPage}
      organization={organization}
      locale={locale}
    />
  )
}

OJOISearch.getProps = async ({ apolloClient, locale }) => {
  const organizationSlug = 'stjornartidindi'

  const [
    {
      data: { ministryOfJusticeAdverts },
    },
    {
      data: { ministryOfJusticeCategories },
    },
    {
      data: { ministryOfJusticeDepartments },
    },
    {
      data: { ministryOfJusticeTypes },
    },
    {
      data: { ministryOfJusticeInvolvedParties },
    },
    {
      data: { getOrganizationPage },
    },
    {
      data: { getOrganization },
    },
    namespace,
  ] = await Promise.all([
    apolloClient.query<Query, QueryMinistryOfJusticeAdvertsArgs>({
      query: ADVERTS_QUERY,
      variables: {
        input: {
          search: '',
        },
      },
    }),
    apolloClient.query<Query, QueryMinistryOfJusticeCategoriesArgs>({
      query: CATEGORIES_QUERY,
      variables: {
        params: {
          search: '',
        },
      },
    }),
    apolloClient.query<Query, QueryMinistryOfJusticeDepartmentsArgs>({
      query: DEPARTMENTS_QUERY,
      variables: {
        params: {
          search: '',
        },
      },
    }),
    apolloClient.query<Query, QueryMinistryOfJusticeTypesArgs>({
      query: TYPES_QUERY,
      variables: {
        params: {
          search: '',
        },
      },
    }),
    apolloClient.query<Query, QueryMinistryOfJusticeInvolvedPartiesArgs>({
      query: INVOLVED_PARTIES_QUERY,
      variables: {
        params: {
          search: '',
        },
      },
    }),
    apolloClient.query<Query, QueryGetOrganizationPageArgs>({
      query: GET_ORGANIZATION_PAGE_QUERY,
      variables: {
        input: {
          slug: organizationSlug,
          lang: locale as ContentLanguage,
        },
      },
    }),
    apolloClient.query<Query, QueryGetOrganizationPageArgs>({
      query: GET_ORGANIZATION_QUERY,
      variables: {
        input: {
          slug: organizationSlug,
          lang: locale as ContentLanguage,
        },
      },
    }),
    apolloClient
      .query<Query, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: {
            namespace: 'OrganizationPages',
            lang: locale,
          },
        },
      })
      .then((variables) =>
        variables?.data?.getNamespace?.fields
          ? JSON.parse(variables.data.getNamespace.fields)
          : {},
      ),
  ])

  if (!getOrganizationPage && !getOrganization?.hasALandingPage) {
    throw new CustomNextError(404, 'Organization page not found')
  }

  return {
    initialAdverts: ministryOfJusticeAdverts.adverts,
    categories: ministryOfJusticeCategories?.categories,
    departments: ministryOfJusticeDepartments?.departments,
    types: ministryOfJusticeTypes?.types,
    involvedParties: ministryOfJusticeInvolvedParties?.involvedParties,
    organizationPage: getOrganizationPage,
    organization: getOrganization,
    namespace,
    locale: locale as Locale,
    showSearchInHeader: false,
    ...getThemeConfig(
      getOrganizationPage?.theme ?? 'landing_page',
      getOrganization ?? getOrganizationPage?.organization,
    ),
  }
}

export default withMainLayout(OJOISearch)
