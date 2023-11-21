import { useMemo } from 'react'
import NextLink from 'next/link'

import {
  Article,
  GetArticlesQuery,
  GetArticlesQueryVariables,
  Query,
  SortField,
} from '@island.is/web/graphql/schema'
import { useLinkResolver, useNamespace } from '@island.is/web/hooks'
import {
  Box,
  Breadcrumbs,
  GridColumn,
  GridContainer,
  GridRow,
  Inline,
  Text,
} from '@island.is/island-ui/core'
import {
  FeaturedArticlesSlice,
  HeadWithSocialSharing,
  IconTitleCard,
} from '@island.is/web/components'
import { useQuery } from '@apollo/client'
import { GET_ARTICLES_QUERY } from '@island.is/web/screens/queries'
import { useI18n } from '@island.is/web/i18n'
import useContentfulId from '@island.is/web/hooks/useContentfulId'
import useLocalLinkTypeResolver from '@island.is/web/hooks/useLocalLinkTypeResolver'
import { LandingPageFooter } from './index'

const ARTICLES_PAGE_SIZE = 10

const parseOrganizationLinkHref = (organization: Query['getOrganization']) => {
  let link = organization?.link
  if (link?.includes('://')) {
    link = link.split('://')[1]
  }
  if (link && link[link.length - 1] === '/') {
    link = link?.slice(0, link.length - 1)
  }
  return link
}

interface LandingPageProps {
  organization: Query['getOrganization']
  namespace: Record<string, string>
}

const LandingPage = ({ organization, namespace }: LandingPageProps) => {
  const { activeLocale } = useI18n()
  const n = useNamespace(namespace)

  const organizationNamespace = useMemo(() => {
    return JSON.parse(organization?.namespace?.fields || '{}')
  }, [organization?.namespace?.fields])

  const o = useNamespace(organizationNamespace)
  useContentfulId(organization?.id)
  useLocalLinkTypeResolver()

  const { linkResolver } = useLinkResolver()

  const parsedLinkHref = parseOrganizationLinkHref(organization)
  const linkTitle = `${n(
    'landingPageTitleCardHeading',
    'Opinber vefur stofnunar er',
  )} ${parsedLinkHref}`

  const articleResponse = useQuery<GetArticlesQuery, GetArticlesQueryVariables>(
    GET_ARTICLES_QUERY,
    {
      variables: {
        input: {
          lang: activeLocale,
          organization: organization?.slug,
          sort: SortField.Popular,
          size: ARTICLES_PAGE_SIZE + 1,
        },
      },
    },
  )

  return (
    <>
      <HeadWithSocialSharing
        title={organization?.title ?? ''}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore make web strict
        description={organization?.description}
      />
      <Box marginBottom={5}>
        <GridContainer>
          <GridRow>
            <GridColumn
              span={['12/12', '12/12', '10/12']}
              offset={['0', '0', '1/12']}
            >
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
                      src={organization.logo.url}
                      alt="organization-logo"
                    />
                  )}
                  <Text variant="h1" color="blueberry600">
                    {organization?.title}
                  </Text>
                </Inline>
              </Box>

              {linkTitle && organization?.link && (
                <Box marginBottom={8}>
                  <IconTitleCard
                    heading={linkTitle}
                    href={organization.link}
                    imgSrc={o(
                      'landingPageTitleCardImageSrc',
                      'https://images.ctfassets.net/8k0h54kbe6bj/dMv61A2SII5Y6AACjOzFo/63d1627ccf2113ae137c401725b1b35b/T__lva_og_kaffibolli.svg',
                    )}
                    alt={o('landingPageTitleCardImageAlt', '')}
                  />
                </Box>
              )}

              {organization?.description && (
                <Box
                  paddingY={4}
                  borderTopWidth="standard"
                  borderColor="standard"
                >
                  <Text variant="default">{organization.description}</Text>
                </Box>
              )}

              {articleResponse?.data?.getArticles && (
                <FeaturedArticlesSlice
                  slice={{
                    articles: [],
                    id: `featured-articles-${organization?.slug}`,
                    resolvedArticles: articleResponse.data.getArticles.slice(
                      0,
                      ARTICLES_PAGE_SIZE,
                    ) as Article[],
                    sortBy: SortField.Popular,
                    title: n(
                      'agencyServicesTitle',
                      'Efni stofnunar sem komið er á Ísland.is',
                    ),
                    automaticallyFetchArticles: true,
                    hasBorderAbove: true,
                    image: null,
                    link:
                      articleResponse.data.getArticles.length >
                      ARTICLES_PAGE_SIZE
                        ? {
                            date: new Date().toISOString(),
                            id: `featured-articles-${organization?.slug}-link`,
                            text: n(
                              'landingPageSeeMoreArticles',
                              'Sjá allt efni',
                            ),
                            url: `${
                              linkResolver('search').href
                            }?q=*&organization=${organization?.slug}`,
                          }
                        : null,
                  }}
                  namespace={namespace}
                />
              )}
            </GridColumn>
          </GridRow>
        </GridContainer>
        <LandingPageFooter footerItems={organization?.footerItems} />
      </Box>
    </>
  )
}

export default LandingPage
