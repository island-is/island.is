import { useEffect, useMemo, useState } from 'react'
import { Locale } from 'locale'
import debounce from 'lodash/debounce'
import { useRouter } from 'next/router'

import {
  Box,
  Button,
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
  MinistryOfJusticeAdvertsResponse,
  Query,
  QueryGetNamespaceArgs,
  QueryGetOrganizationPageArgs,
  QueryMinistryOfJusticeAdvertsArgs,
} from '@island.is/web/graphql/schema'
import { useLinkResolver, useNamespace } from '@island.is/web/hooks'
import useContentfulId from '@island.is/web/hooks/useContentfulId'
import { withMainLayout } from '@island.is/web/layouts/main'
import { CustomNextError } from '@island.is/web/units/errors'

import {
  baseUrl,
  deildOptions,
  emptyOption,
  findValueOption,
  malaflokkurOptions,
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
import { ADVERTS_QUERY } from '../queries/OfficialJournalOfIceland'

const initialState = {
  q: '',
  deild: '',
  tegund: '',
  timabil: '',
  malaflokkur: '',
  stofnun: '',
}

const OJOISearchPage: Screen<OJOISearchProps> = ({
  initialAdverts,
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

  useEffect(() => {
    const searchParams = new URLSearchParams(document.location.search)
    setSearchState({
      q: searchParams.get('q') ?? '',
      deild: searchParams.get('deild') ?? '',
      tegund: searchParams.get('tegund') ?? '',
      timabil: searchParams.get('timabil') ?? '',
      malaflokkur: searchParams.get('malaflokkur') ?? '',
      stofnun: searchParams.get('stofnun') ?? '',
    })
  }, [])

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

  const updateSearchState = (key: string, value: string) => {
    const newState = {
      ...searchState,
      [key]: value,
    }
    setSearchState(newState)
    updateSearchParams(newState)

    // TODO: implement search
    if (key === 'q' && value) {
      setAdverts([])
    } else {
      setAdverts(initialAdverts)
    }
  }

  const resetFilter = () => {
    setSearchState(initialState)
    updateSearchParams(initialState)
    setAdverts(initialAdverts)
  }

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
              options={[{ ...emptyOption('Allar deildir') }, ...deildOptions]}
              isClearable
              value={findValueOption(deildOptions, searchState.deild)}
              onChange={(v) => updateSearchState('deild', v?.value ?? '')}
            />

            <Select
              name="malaflokkur"
              label="Málaflokkur"
              size="xs"
              placeholder="Veldu málaflokk"
              options={[
                { ...emptyOption('Allir flokkar') },
                ...malaflokkurOptions,
              ]}
              isClearable
              value={findValueOption(
                malaflokkurOptions,
                searchState.malaflokkur,
              )}
              onChange={(v) => updateSearchState('malaflokkur', v?.value ?? '')}
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
  initialAdverts?: MinistryOfJusticeAdvertsResponse['adverts']
  organizationPage?: Query['getOrganizationPage']
  organization?: Query['getOrganization']
  namespace: Record<string, string>
  locale: Locale
}

const OJOISearch: Screen<OJOISearchProps> = ({
  initialAdverts,
  organizationPage,
  organization,
  namespace,
  locale,
}) => {
  return (
    <OJOISearchPage
      initialAdverts={initialAdverts}
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
