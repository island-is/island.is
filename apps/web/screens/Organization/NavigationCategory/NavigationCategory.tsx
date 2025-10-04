import { CategoryCard, Link, Stack, Text } from '@island.is/island-ui/core'
import {
  getThemeConfig,
  OrganizationWrapper,
  Webreader,
} from '@island.is/web/components'
import type {
  OrganizationPage,
  Query,
  QueryGetOrganizationPageStandaloneSitemapLevel1Args,
} from '@island.is/web/graphql/schema'
import { useLinkResolver } from '@island.is/web/hooks'
import { withMainLayout } from '@island.is/web/layouts/main'
import type { Screen, ScreenContext } from '@island.is/web/types'

import { GET_ORGANIZATION_PAGE_STANDALONE_SITEMAP_LEVEL1_QUERY } from '../../queries/Organization'

export interface NavigationCategoryProps {
  organizationPage: OrganizationPage
  navigationCategory: {
    label: string
    href: string
  }
  links: {
    label: string
    href: string
    description?: string | null
  }[]
}

type NavigationCategoryScreenContext = ScreenContext & {
  organizationPage: OrganizationPage
  navigationCategory: {
    label: string
    href: string
    description?: string | null
  }
  navigationCategorySlug: string
}

const NavigationCategory: Screen<
  NavigationCategoryProps,
  NavigationCategoryScreenContext
> = ({ organizationPage, navigationCategory, links }) => {
  const { linkResolver } = useLinkResolver()
  return (
    <OrganizationWrapper
      organizationPage={organizationPage}
      pageTitle={organizationPage.title}
      navigationData={{
        title: organizationPage.title,
        items: [], // TODO: add navigation items
      }}
      showReadSpeaker={false}
      breadcrumbItems={[
        {
          title: 'Ísland.is',
          href: linkResolver('homepage').href,
        },
        {
          title: organizationPage.title,
          href: linkResolver('organizationpage', [organizationPage.slug]).href,
        },
      ]}
    >
      <Stack space={3}>
        <Stack space={0}>
          <Text variant="h1" as="h1">
            {navigationCategory.label}
          </Text>
          <Webreader readClass="rs_read" />
        </Stack>
        <Stack space={4}>
          {links.map((link) => (
            <CategoryCard
              key={link.href}
              heading={link.label}
              href={link.href}
              text={link.description ?? ''}
            />
          ))}
        </Stack>
      </Stack>
    </OrganizationWrapper>
  )
}

NavigationCategory.getProps = async ({
  apolloClient,
  navigationCategory,
  organizationPage,
  navigationCategorySlug,
  locale,
}) => {
  const { data } = await apolloClient.query<
    Query,
    QueryGetOrganizationPageStandaloneSitemapLevel1Args
  >({
    query: GET_ORGANIZATION_PAGE_STANDALONE_SITEMAP_LEVEL1_QUERY,
    variables: {
      input: {
        organizationPageSlug: organizationPage.slug,
        categorySlug: navigationCategorySlug,
        lang: locale,
      },
    },
  })
  const links =
    data.getOrganizationPageStandaloneSitemapLevel1?.childLinks ?? []

  return {
    organizationPage,
    navigationCategory,
    links,
    ...getThemeConfig(organizationPage?.theme, organizationPage?.organization),
  }
}

export default withMainLayout(NavigationCategory)
