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
  Query,
  QueryGetNamespaceArgs,
  QueryGetOrganizationPageArgs,
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
  mockAdverts,
  removeEmptyFromObject,
  searchUrl,
  StjornartidindiWrapper,
} from '../../../components/Stjornartidindi'
import { Screen } from '../../../types'
import {
  GET_NAMESPACE_QUERY,
  GET_ORGANIZATION_PAGE_QUERY,
  GET_ORGANIZATION_QUERY,
} from '../../queries'
import { StjornartidindiSearchGridView } from './StjornartidindiSearchGridView'
import { StjornartidindiSearchListView } from './StjornartidindiSearchListView'

const initialState = {
  q: '',
  deild: '',
  tegund: '',
  timabil: '',
  malaflokkur: '',
  stofnun: '',
}

const StjornartidindiSearchPage: Screen<StjornartidindiSearchProps> = ({
  organizationPage,
  organization,
  namespace,
  locale,
}) => {
  const router = useRouter()
  const { linkResolver } = useLinkResolver()
  const n = useNamespace(namespace)
  useContentfulId(organizationPage?.id)

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
  }

  const resetFilter = () => {
    setSearchState(initialState)
    updateSearchParams(initialState)
  }

  return (
    <StjornartidindiWrapper
      pageTitle={'Leit í Stjórnartíðindum'}
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
          <StjornartidindiSearchListView adverts={mockAdverts} />
        ) : (
          <StjornartidindiSearchGridView adverts={mockAdverts} />
        )}
      </Stack>
    </StjornartidindiWrapper>
  )
}

interface StjornartidindiSearchProps {
  organizationPage?: Query['getOrganizationPage']
  organization?: Query['getOrganization']
  namespace: Record<string, string>
  locale: Locale
}

const StjornartidindiSearch: Screen<StjornartidindiSearchProps> = ({
  organizationPage,
  organization,
  namespace,
  locale,
}) => {
  return (
    <StjornartidindiSearchPage
      namespace={namespace}
      organizationPage={organizationPage}
      organization={organization}
      locale={locale}
    />
  )
}

StjornartidindiSearch.getProps = async ({ apolloClient, locale }) => {
  const organizationSlug = 'stjornartidindi'

  const [
    {
      data: { getOrganizationPage },
    },
    {
      data: { getOrganization },
    },
    namespace,
  ] = await Promise.all([
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

export default withMainLayout(StjornartidindiSearch)
