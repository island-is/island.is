import {
  FocusableBox,
  GridContainer,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { Locale } from '@island.is/shared/types'
import {
  ContentLanguage,
  OrganizationPage,
  Query,
  QueryGetOrganizationPageArgs,
  QueryGetSitemapArgs,
  SitemapLink,
} from '@island.is/web/graphql/schema'
import { linkResolver } from '@island.is/web/hooks'
import { Screen } from '@island.is/web/types'
import { CustomNextError } from '@island.is/web/units/errors'

import { GET_ORGANIZATION_PAGE_QUERY } from '../../../queries'
import { GET_SITEMAP_LEVEL2_QUERY } from '../../../queries/Sitemap'
import StandaloneLayout from '../StandaloneLayout/StandaloneLayout'

export interface StandaloneSitemapLevel2Props {
  organizationPage: OrganizationPage
  heading: string
  cards: SitemapLink[]
}

const StandaloneSitemapLevel2: Screen<StandaloneSitemapLevel2Props> = ({
  organizationPage,
  heading,
  cards,
}) => {
  console.log(cards)
  return (
    <StandaloneLayout
      organizationPage={organizationPage}
      seo={{
        title: `${heading} | ${organizationPage.title}`,
      }}
    >
      <GridContainer>
        <Stack space={2}>
          <Text variant="h2" as="h2">
            {heading}
          </Text>
          <Stack space={2}>
            {cards.map((card) => (
              <div key={card.label}>
                <FocusableBox
                  href={card.href}
                  border="standard"
                  borderRadius="large"
                  borderWidth="standard"
                  paddingX={[3, 3, 4]}
                  paddingY={3}
                >
                  <Stack space={1}>
                    <Text variant="h3" as="h3">
                      {card.label}
                    </Text>
                    <Text>{card.description}</Text>
                  </Stack>
                </FocusableBox>
                {/* TODO: this is temporary */}
                {card.childLinks.map((link) => (
                  <div key={link.label}>
                    <FocusableBox
                      marginLeft={2}
                      href={link.href}
                      border="standard"
                      borderRadius="large"
                      borderWidth="standard"
                      paddingX={[3, 3, 4]}
                      paddingY={3}
                    >
                      <Stack space={1}>
                        <Text variant="h3" as="h3">
                          {link.label}
                        </Text>
                        <Text>{link.description}</Text>
                      </Stack>
                    </FocusableBox>
                    {link.childLinks.map((child) => (
                      <div key={child.label}>
                        <FocusableBox
                          marginLeft={2}
                          href={child.href}
                          border="standard"
                          borderRadius="large"
                          borderWidth="standard"
                          paddingX={[3, 3, 4]}
                          paddingY={3}
                        >
                          <Stack space={1}>
                            <Text variant="h3" as="h3">
                              {child.label}
                            </Text>
                            <Text>{child.description}</Text>
                          </Stack>
                        </FocusableBox>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </Stack>
        </Stack>
      </GridContainer>
    </StandaloneLayout>
  )
}

StandaloneSitemapLevel2.getProps = async ({ apolloClient, locale, query }) => {
  const [
    {
      data: { getOrganizationPage },
    },
    {
      data: { getSitemap },
    },
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
    apolloClient.query<Query, QueryGetSitemapArgs>({
      query: GET_SITEMAP_LEVEL2_QUERY,
      variables: {
        input: {
          rootPageSlug: query.slug as string,
          lang: locale as ContentLanguage,
          slugs: [query.subSlug as string, query.genericListItemSlug as string],
        },
      },
    }),
  ])

  if (!getOrganizationPage) {
    throw new CustomNextError(404, 'Organization page not found')
  }

  if (!getSitemap) {
    throw new CustomNextError(404, 'Organization page has no sitemap')
  }

  const activeLink = getSitemap.links.find(
    (link) =>
      new URL(link.href, 'https://island.is').pathname ===
      linkResolver(
        'organizationsubpage',
        [query.slug as string, query.subSlug as string],
        locale as Locale,
      ).href,
  )

  if (!activeLink) {
    throw new CustomNextError(404, 'Standalone navigation link was not found')
  }

  return {
    organizationPage: getOrganizationPage,
    heading: activeLink.label,
    cards: activeLink.childLinks ?? [],
  }
}

export default StandaloneSitemapLevel2
