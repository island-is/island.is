import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Locale } from 'locale'
import { useRouter } from 'next/router'

import {
  ActionCard,
  Box,
  CategoryCard,
  GridColumn,
  GridContainer,
  GridRow,
  Inline,
  Input,
  Select,
  Stack,
  Tag,
  Text,
} from '@island.is/island-ui/core'
import { getThemeConfig, SliceMachine } from '@island.is/web/components'
import { SLICE_SPACING } from '@island.is/web/constants'
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

import { StjornartidindiWrapper } from '../../../components/Stjornartidindi'
import { Screen } from '../../../types'
import {
  GET_NAMESPACE_QUERY,
  GET_ORGANIZATION_PAGE_QUERY,
  GET_ORGANIZATION_QUERY,
} from '../../queries'

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

  const searchUrl = '/s/stjornartidindi/leit'

  return (
    <StjornartidindiWrapper
      pageTitle={organizationPage?.title ?? ''}
      pageDescription={organizationPage?.description}
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      organizationPage={organizationPage!}
      pageFeaturedImage={organizationPage?.featuredImage ?? undefined}
      sidebarContent={
        <Box
          component="form"
          background="blue100"
          padding={2}
          borderRadius="large"
          action={searchUrl}
        >
          <Text variant="h4" marginBottom={2}>
            Leit
          </Text>

          <Input name="q" placeholder="Leit í Stjórnartíðindum" size="sm" />

          <hr />

          <Text variant="h4" marginBottom={2}>
            Síun
          </Text>
          <Box marginBottom={2}>
            <Select
              name="deild"
              label="Deild"
              size="sm"
              placeholder="Veldu deild"
              options={[
                { label: 'A deild', value: 'a-deild' },
                { label: 'B deild', value: 'b-deild' },
              ]}
              isClearable
            />
          </Box>

          <Box marginBottom={2}>
            <Select
              name="malaflokkur"
              label="Málaflokkur"
              size="sm"
              placeholder="Veldu málaflokk"
              options={[
                { label: 'Almannavarnir', value: 'almannavarnir' },
                { label: 'Sakamál', value: 'sakamal' },
              ]}
              isClearable
            />
          </Box>
        </Box>
      }
      breadcrumbItems={breadcrumbItems}
    >
      <Stack space={SLICE_SPACING}>
        <ActionCard
          eyebrow="Skipulagsstofnun"
          heading={'1383/2023'}
          tag={{
            label: 'Innviðarráðuneyti A-deild - Útg. 12. 07.2023',
            outlined: false,
            variant: 'white',
          }}
          text={
            'LÖG um breytingu á lögum um almennar íbúðir og lögum um húsnæðismál (almennar íbúðir vegna náttúruhamfara í Grindavíkurbæ).'
          }
          cta={{
            icon: 'arrowForward',
            label: 'Skoða nánar',
            variant: 'text',
            size: 'small',
            onClick: () => {
              router.push(searchUrl + '/test')
            },
          }}
        >
          <Box marginTop={3}>
            <Inline space={1}>
              <Tag variant="white" outlined disabled>
                Skipulagsmál
              </Tag>
              <Tag variant="white" outlined disabled>
                Sveitarfélag Hornafjarðar{' '}
              </Tag>
            </Inline>
          </Box>
        </ActionCard>
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

StjornartidindiSearch.getProps = async ({ apolloClient, locale /*, req*/ }) => {
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
