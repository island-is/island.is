import {
  ActionCard,
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
} from '@island.is/web/graphql/schema'
import { linkResolver } from '@island.is/web/hooks'
import { Screen } from '@island.is/web/types'
import { CustomNextError } from '@island.is/web/units/errors'

import { GET_ORGANIZATION_PAGE_QUERY } from '../../queries'
import StandaloneLayout from './StandaloneLayout/StandaloneLayout'

export interface StandaloneSitemapProps {
  organizationPage: OrganizationPage
  heading: string
  cards: { label: string; description: string; slug: string }[]
}

const StandaloneSitemap: Screen<StandaloneSitemapProps> = ({
  organizationPage,
  heading,
  cards,
}) => {
  return (
    <StandaloneLayout organizationPage={organizationPage}>
      <GridContainer>
        <Stack space={2}>
          <Text variant="h1" as="h1">
            {heading}
          </Text>
          <Stack space={2}>
            {cards.map((card) => (
              <ActionCard
                key={card.label}
                heading={card.label}
                text={card.description}
              />
            ))}
          </Stack>
        </Stack>
      </GridContainer>
    </StandaloneLayout>
  )
}

StandaloneSitemap.getProps = async ({ apolloClient, locale, query }) => {
  const [
    {
      data: { getOrganizationPage },
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
  ])

  if (!getOrganizationPage) {
    throw new CustomNextError(404, 'Organization page not found')
  }

  const activeLink = getOrganizationPage.topLevelNavigation?.links.find(
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
    cards: [
      {
        label: 'Titill',
        description: 'Lýsing',
        slug: '1',
      },
      {
        label: 'Titill',
        description: 'Lýsing',
        slug: '2',
      },
      {
        label: 'Titill',
        description: 'Lýsing',
        slug: '3',
      },
    ],
  }
}

export default StandaloneSitemap
