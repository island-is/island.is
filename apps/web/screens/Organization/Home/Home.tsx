/* eslint-disable jsx-a11y/anchor-is-valid */
import { useMemo } from 'react'
import NextLink from 'next/link'

import {
  Box,
  Breadcrumbs,
  GridContainer,
  Inline,
  NavigationItem,
  Text,
} from '@island.is/island-ui/core'
import { LinkType, useLinkResolver, useNamespace } from '@island.is/web/hooks'
import {
  getThemeConfig,
  SliceMachine,
  OrganizationWrapper,
  IconTitleCard,
} from '@island.is/web/components'
import { CustomNextError } from '@island.is/web/units/errors'
import useContentfulId from '@island.is/web/hooks/useContentfulId'
import { withMainLayout } from '@island.is/web/layouts/main'
import {
  ContentLanguage,
  Query,
  QueryGetNamespaceArgs,
  QueryGetOrganizationPageArgs,
} from '@island.is/web/graphql/schema'

import { Screen } from '../../../types'
import {
  GET_NAMESPACE_QUERY,
  GET_ORGANIZATION_PAGE_QUERY,
  GET_ORGANIZATION_QUERY,
} from '../../queries'
import { LandingPage, LandingPageFooter } from './LandingPage'

const parseOrganizationLinkHref = (organization: Query['getOrganization']) => {
  if (!organization?.link) return ''
  let link = organization.link
  if (link.includes('://')) {
    link = link.split('://')[1]
  }
  if (link[link.length - 1] === '/') {
    link = link.slice(0, link.length - 1)
  }
  return link
}

const OrganizationHomePage: Screen<HomeProps> = ({
  organizationPage,
  organization,
  namespace,
}) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  const n = useNamespace(namespace)
  useContentfulId(organizationPage?.id)
  const { linkResolver } = useLinkResolver()
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  const navList: NavigationItem[] =
    organizationPage?.menuLinks.map(({ primaryLink, childrenLinks }) => ({
      title: primaryLink?.text,
      href: primaryLink?.url,
      active: false,
      items: childrenLinks.map(({ text, url }) => ({
        title: text,
        href: url,
      })),
    })) ?? []

  const parsedLinkHref = parseOrganizationLinkHref(organization)
  const linkTitle = parsedLinkHref
    ? `${n(
        'landingPageTitleCardHeading',
        'Opinber vefur stofnunar er',
      )} ${parsedLinkHref}`
    : ''

  const organizationNamespace = useMemo(() => {
    return JSON.parse(organization?.namespace?.fields || '{}')
  }, [organization?.namespace?.fields])

  const o = useNamespace(organizationNamespace)

  return (
    <OrganizationWrapper
      showExternalLinks={true}
      pageTitle={organizationPage?.title ?? ''}
      pageDescription={organizationPage?.description}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore make web strict
      organizationPage={organizationPage}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore make web strict
      pageFeaturedImage={organizationPage?.featuredImage}
      fullWidthContent={true}
      minimal={organizationPage?.theme === 'landing_page'}
      navigationData={{
        title: n('navigationTitle', 'Efnisyfirlit'),
        items: navList,
      }}
      mainContent={
        <Box>
          {organizationPage?.theme === 'landing_page' && (
            <GridContainer>
              <Box marginBottom={3}>
                <Breadcrumbs
                  items={[
                    {
                      title: 'Ísland.is',
                      href: linkResolver('homepage').href,
                    },
                    {
                      title: n(
                        'landingPageOrganizationsBreadcrumbTitle',
                        'Opinberir aðilar',
                      ),
                      href: linkResolver('organizations').href,
                    },
                  ]}
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
              </Box>
              <Box marginBottom={5}>
                <Inline space={1} alignY="center">
                  {organization?.logo?.url && (
                    <img
                      width={70}
                      height={70}
                      src={organization?.logo.url}
                      alt="organization-logo"
                    />
                  )}
                  <Text variant="h1" color="blueberry600">
                    {organization?.title}
                  </Text>
                </Inline>
              </Box>

              <Box marginBottom={8}>
                <IconTitleCard
                  heading={linkTitle}
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore make web strict
                  href={organization?.link}
                  imgSrc={o(
                    'landingPageTitleCardImageSrc',
                    'https://images.ctfassets.net/8k0h54kbe6bj/dMv61A2SII5Y6AACjOzFo/63d1627ccf2113ae137c401725b1b35b/T__lva_og_kaffibolli.svg',
                  )}
                  alt={o('landingPageTitleCardImageAlt', '')}
                />
              </Box>
              {organization?.description && (
                <Box
                  paddingY={4}
                  borderTopWidth="standard"
                  borderColor="standard"
                >
                  <Text variant="default">{organization?.description}</Text>
                </Box>
              )}
            </GridContainer>
          )}
          {organizationPage?.slices?.map((slice, index) => {
            return (
              <SliceMachine
                key={slice.id}
                slice={slice}
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore make web strict
                namespace={namespace}
                slug={organizationPage.slug}
                fullWidth={organizationPage.theme === 'landing_page'}
                marginBottom={
                  index === organizationPage.slices.length - 1 ? 5 : 0
                }
                paddingTop={
                  !organizationPage.description && index === 0 ? 0 : 6
                }
              />
            )
          })}
        </Box>
      }
    >
      {organizationPage?.bottomSlices.map((slice) => (
        <SliceMachine
          key={slice.id}
          slice={slice}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore make web strict
          namespace={namespace}
          slug={organizationPage.slug}
          fullWidth={true}
          params={{
            latestNewsSliceBackground:
              organizationPage.theme === 'landing_page' ? 'white' : 'purple100',
            latestNewsSliceColorVariant:
              organizationPage.theme === 'landing_page' ? 'blue' : 'default',
          }}
        />
      ))}
      {organizationPage?.theme === 'landing_page' && (
        <LandingPageFooter
          footerItems={organizationPage.organization?.footerItems}
        />
      )}
    </OrganizationWrapper>
  )
}

interface HomeProps {
  organizationPage?: Query['getOrganizationPage']
  organization?: Query['getOrganization']
  namespace: Query['getNamespace']
}

const Home: Screen<HomeProps> = ({
  organizationPage,
  organization,
  namespace,
}) => {
  const isLandingPage =
    !organizationPage && !!organization && organization?.hasALandingPage
  if (isLandingPage)
    return (
      <LandingPage
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore make web strict
        namespace={namespace}
        organization={organization}
      />
    )
  return (
    <OrganizationHomePage
      namespace={namespace}
      organizationPage={organizationPage}
      organization={organization}
    />
  )
}

Home.getProps = async ({ apolloClient, locale, query }) => {
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
          slug: query.slug as string,
          lang: locale as ContentLanguage,
        },
      },
    }),
    apolloClient.query<Query, QueryGetOrganizationPageArgs>({
      query: GET_ORGANIZATION_QUERY,
      variables: {
        input: {
          slug: query.slug as string,
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
    showSearchInHeader: false,
    ...getThemeConfig(
      getOrganizationPage?.theme ?? 'landing_page',
      getOrganization ?? getOrganizationPage?.organization,
    ),
  }
}

export default withMainLayout(Home)
