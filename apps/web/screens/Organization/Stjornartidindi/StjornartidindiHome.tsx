import { useMemo } from 'react'
import { Locale } from 'locale'
import NextLink from 'next/link'

import {
  Box,
  Breadcrumbs,
  CategoryCard,
  GridColumn,
  GridContainer,
  GridRow,
  Stack,
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

import {
  StjornartidindiHomeIntro,
  StjornartidindiWrapper,
} from '../../../components/Stjornartidindi'
import { Screen } from '../../../types'
import {
  GET_NAMESPACE_QUERY,
  GET_ORGANIZATION_PAGE_QUERY,
  GET_ORGANIZATION_QUERY,
} from '../../queries'

const StjornartidindiHomePage: Screen<StjornartidindiHomeProps> = ({
  organizationPage,
  organization,
  namespace,
  locale,
}) => {
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
  ]

  const searchUrl = '/s/stjornartidindi/leit'

  return (
    <StjornartidindiWrapper
      pageTitle={organizationPage?.title ?? ''}
      pageDescription={organizationPage?.description}
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      organizationPage={organizationPage!}
      pageFeaturedImage={organizationPage?.featuredImage ?? undefined}
    >
      <Stack space={SLICE_SPACING}>
        <StjornartidindiHomeIntro
          organizationPage={organizationPage}
          organization={organization}
          namespace={namespace}
          searchPlaceholder="Leitaðu í stjórnartíðindum"
          searchUrl={searchUrl}
          quickLinks={[
            { title: 'A deild', href: searchUrl + '?deild=a-deild' },
            {
              title: 'B deild',
              href: searchUrl + '?deild=b-deild',
              variant: 'purple',
            },
          ]}
          breadCrumbs={
            breadcrumbItems && (
              <Breadcrumbs
                items={breadcrumbItems ?? []}
                renderLink={(link, item) => {
                  return item?.href ? (
                    <NextLink href={item?.href} legacyBehavior>
                      {link}
                    </NextLink>
                  ) : (
                    link
                  )
                }}
              />
            )
          }
        />

        <Box background="blue100" paddingTop={8} paddingBottom={8}>
          <GridContainer>
            <Box>
              <Text variant="h3">Yfirflokkar</Text>
            </Box>

            <GridRow>
              <GridColumn
                key={'1'}
                span={['1/1', '1/2', '1/2', '1/3', '1/4']}
                paddingTop={3}
                paddingBottom={4}
              >
                <CategoryCard
                  href={searchUrl + '?flokkur=domstolar'}
                  heading={'Dómstólar og réttarfar'}
                  text={
                    'Hæstiréttur, lögmenn, lögreglumál, lögfræði, kjaradómur, refsilög o.fl.'
                  }
                />
              </GridColumn>

              <GridColumn
                key={'1'}
                span={['1/1', '1/2', '1/2', '1/3', '1/4']}
                paddingTop={3}
                paddingBottom={4}
              >
                <CategoryCard
                  href={searchUrl + '?flokkur=sjavarutvegur'}
                  heading={'Sjávarútvegur, fiskveiðar og fiskirækt'}
                  text={'Sjávarútvegur, Veiði - friðun, fiskeldi og hafnarmál.'}
                />
              </GridColumn>
            </GridRow>
          </GridContainer>
        </Box>

        {organizationPage?.bottomSlices.map((slice, index) => (
          <SliceMachine
            key={slice.id}
            slice={slice}
            namespace={namespace}
            slug={organizationPage.slug}
            marginBottom={index === organizationPage.slices.length - 1 ? 5 : 0}
          />
        ))}
      </Stack>
    </StjornartidindiWrapper>
  )
}

interface StjornartidindiHomeProps {
  organizationPage?: Query['getOrganizationPage']
  organization?: Query['getOrganization']
  namespace: Record<string, string>
  locale: Locale
}

const StjornartidindiHome: Screen<StjornartidindiHomeProps> = ({
  organizationPage,
  organization,
  namespace,
  locale,
}) => {
  return (
    <StjornartidindiHomePage
      namespace={namespace}
      organizationPage={organizationPage}
      organization={organization}
      locale={locale}
    />
  )
}

StjornartidindiHome.getProps = async ({ apolloClient, locale /*, req*/ }) => {
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

export default withMainLayout(StjornartidindiHome)
