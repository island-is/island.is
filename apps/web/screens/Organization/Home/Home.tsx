/* eslint-disable jsx-a11y/anchor-is-valid */
import { useMemo } from 'react'
import NextLink from 'next/link'

import {
  Box,
  Breadcrumbs,
  GridContainer,
  NavigationItem,
  Text,
} from '@island.is/island-ui/core'
import { LinkType, useLinkResolver, useNamespace } from '@island.is/web/hooks'
import {
  getThemeConfig,
  SliceMachine,
  OrganizationWrapper,
  SearchBox,
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
import { GET_NAMESPACE_QUERY, GET_ORGANIZATION_PAGE_QUERY } from '../../queries'
import { getCustomAlertBanners } from './utils'
import { LandingPageFooter } from './LandingPageFooter'

interface HomeProps {
  organizationPage: Query['getOrganizationPage']
  namespace: Query['getNamespace']
}

const WITH_SEARCH = [
  'syslumenn',
  'district-commissioner',

  'sjukratryggingar',
  'health-insurance-in-iceland',

  'utlendingastofnun',
  'directorate-of-immigration',
]

const Home: Screen<HomeProps> = ({ organizationPage, namespace }) => {
  const n = useNamespace(namespace)
  useContentfulId(organizationPage.id)

  const organizationNamespace = useMemo(() => {
    return JSON.parse(organizationPage?.organization?.namespace?.fields ?? '{}')
  }, [organizationPage?.organization?.namespace?.fields])
  const o = useNamespace(organizationNamespace)

  const { linkResolver } = useLinkResolver()

  const navList: NavigationItem[] = organizationPage.menuLinks.map(
    ({ primaryLink, childrenLinks }) => ({
      title: primaryLink.text,
      href: primaryLink.url,
      active: false,
      items: childrenLinks.map(({ text, url }) => ({
        title: text,
        href: url,
      })),
    }),
  )

  return (
    <OrganizationWrapper
      showExternalLinks={true}
      pageTitle={organizationPage.title}
      pageDescription={organizationPage.description}
      organizationPage={organizationPage}
      pageFeaturedImage={organizationPage.featuredImage}
      fullWidthContent={true}
      minimal={organizationPage.theme === 'landing_page'}
      navigationData={{
        title: n('navigationTitle', 'Efnisyfirlit'),
        items: navList,
      }}
      mainContent={
        <Box>
          {organizationPage.theme === 'landing_page' && (
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
                      href: '/s',
                    },
                  ]}
                  renderLink={(link, item) => {
                    return item?.href ? (
                      <NextLink href={item?.href}>{link}</NextLink>
                    ) : (
                      link
                    )
                  }}
                />
              </Box>
              <Box marginBottom={5}>
                <Text variant="h1" color="blueberry600">
                  {organizationPage.title}
                </Text>
              </Box>

              <Box marginBottom={8}>
                <IconTitleCard
                  heading={o('landingPageTitleCardHeading', '')}
                  href={o('landingPageTitleCardHref', '')}
                  imgSrc={o(
                    'landingPageTitleCardImageSrc',
                    'https://images.ctfassets.net/8k0h54kbe6bj/dMv61A2SII5Y6AACjOzFo/63d1627ccf2113ae137c401725b1b35b/T__lva_og_kaffibolli.svg',
                  )}
                  alt={o('landingPageTitleCardImageAlt', '')}
                />
              </Box>
            </GridContainer>
          )}
          {organizationPage.slices.map((slice, index) => {
            const digitalIcelandDetailPageLinkType: LinkType =
              'digitalicelandservicesdetailpage'
            return (
              <SliceMachine
                key={slice.id}
                slice={slice}
                namespace={namespace}
                slug={organizationPage.slug}
                fullWidth={organizationPage.theme === 'landing_page'}
                marginBottom={
                  index === organizationPage.slices.length - 1 ? 5 : 0
                }
                params={{
                  anchorPageLinkType:
                    organizationPage.theme === 'digital_iceland'
                      ? digitalIcelandDetailPageLinkType
                      : undefined,
                }}
                paddingTop={
                  !organizationPage.description && index === 0 ? 0 : 6
                }
              />
            )
          })}
        </Box>
      }
      sidebarContent={
        WITH_SEARCH.includes(organizationPage.slug) && (
          <SearchBox
            id="sidebar"
            organizationPage={organizationPage}
            placeholder={n('searchServices', 'Leitaðu að þjónustu')}
            noResultsText={n(
              'noServicesFound',
              'Engar niðurstöður í þjónustu sýslumanna',
            )}
            searchAllText={n(
              'searchAllServices',
              'Leita í öllu efni Ísland.is',
            )}
          />
        )
      }
    >
      {organizationPage.bottomSlices.map((slice) => (
        <SliceMachine
          key={slice.id}
          slice={slice}
          namespace={namespace}
          slug={organizationPage.slug}
          fullWidth={true}
          params={{
            latestNewsSliceBackground:
              organizationPage.theme === 'landing_page' ? 'white' : 'purple100',
            latestNewsSliceColorVariant:
              organizationPage.theme === 'landing_page'
                ? 'blueberry600'
                : 'default',
          }}
        />
      ))}
      {organizationPage.theme === 'landing_page' && (
        <LandingPageFooter
          footerItems={organizationPage.organization?.footerItems}
        />
      )}
    </OrganizationWrapper>
  )
}

Home.getInitialProps = async ({ apolloClient, locale, query }) => {
  const [
    {
      data: { getOrganizationPage },
    },
    namespace,
    customAlertBanners,
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
    getCustomAlertBanners(query, apolloClient, locale),
  ])

  if (!getOrganizationPage) {
    throw new CustomNextError(404, 'Organization not found')
  }

  return {
    organizationPage: getOrganizationPage,
    namespace,
    showSearchInHeader: false,
    customAlertBanners,
    ...getThemeConfig(getOrganizationPage.theme, getOrganizationPage.slug),
  }
}

export default withMainLayout(Home)
