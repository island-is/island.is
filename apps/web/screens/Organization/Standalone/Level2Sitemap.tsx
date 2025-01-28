import { useMemo } from 'react'

import {
  BreadCrumbItem,
  Breadcrumbs,
  GridColumn,
  GridContainer,
  GridRow,
  LinkV2,
  Stack,
} from '@island.is/island-ui/core'
import { Text } from '@island.is/island-ui/core'
import {
  ContentLanguage,
  OrganizationPage,
  OrganizationPageStandaloneSitemapLevel2,
  OrganizationPageTopLevelNavigationLink,
  Query,
  QueryGetOrganizationPageArgs,
  QueryGetOrganizationPageStandaloneSitemapLevel2Args,
} from '@island.is/web/graphql/schema'
import useContentfulId from '@island.is/web/hooks/useContentfulId'
import { StandaloneLayout } from '@island.is/web/layouts/organization/standalone'
import type { Screen, ScreenContext } from '@island.is/web/types'
import { CustomNextError } from '@island.is/web/units/errors'

import {
  GET_ORGANIZATION_PAGE_QUERY,
  GET_ORGANIZATION_PAGE_STANDALONE_SITEMAP_LEVEL2_QUERY,
} from '../../queries'

const LanguageToggleSetup = (props: { ids: string[] }) => {
  useContentfulId(...props.ids)
  return null
}

type StandaloneLevel2SitemapScreenContext = ScreenContext & {
  organizationPage?: Query['getOrganizationPage']
}

export interface StandaloneLevel2SitemapProps {
  organizationPage: OrganizationPage
  category?: OrganizationPageTopLevelNavigationLink
  sitemap: OrganizationPageStandaloneSitemapLevel2
}

const StandaloneLevel2Sitemap: Screen<
  StandaloneLevel2SitemapProps,
  StandaloneLevel2SitemapScreenContext
> = ({ organizationPage, category, sitemap }) => {
  const breadcrumbItems: BreadCrumbItem[] = useMemo(() => {
    const items: BreadCrumbItem[] = []

    if (category) {
      items.push({
        title: category.label,
        href: category.href,
      })
    }
    return items
  }, [category])

  return (
    <StandaloneLayout
      organizationPage={organizationPage}
      seo={{
        title: `${sitemap.label} | ${organizationPage.title}`,
      }}
    >
      <LanguageToggleSetup ids={[organizationPage.id]} />
      <GridContainer>
        <GridRow>
          <GridColumn span={['9/9', '9/9', '7/9']} offset={['0', '0', '1/9']}>
            <Stack space={1}>
              <Breadcrumbs items={breadcrumbItems} />
              <Stack space={3}>
                <Text variant="h1" as="h1">
                  {sitemap.label}
                </Text>
                <Stack space={3}>
                  {sitemap.childCategories.map(({ label, childLinks }) => (
                    <Stack space={1} key={label}>
                      <Text variant="h3" as="h2">
                        {label}
                      </Text>
                      <Stack space={1}>
                        {childLinks.map((link) => (
                          <LinkV2
                            key={link.label}
                            href={link.href}
                            color="blue400"
                          >
                            {link.label}
                          </LinkV2>
                        ))}
                      </Stack>
                    </Stack>
                  ))}
                </Stack>
              </Stack>
            </Stack>
          </GridColumn>
        </GridRow>
      </GridContainer>
    </StandaloneLayout>
  )
}

StandaloneLevel2Sitemap.getProps = async ({
  apolloClient,
  locale,
  query,
  organizationPage,
}) => {
  const [organizationPageSlug, categorySlug, subcategorySlug] = (query.slugs ??
    []) as string[]

  const [
    {
      data: { getOrganizationPage },
    },
    {
      data: { getOrganizationPageStandaloneSitemapLevel2 },
    },
  ] = await Promise.all([
    !organizationPage
      ? apolloClient.query<Query, QueryGetOrganizationPageArgs>({
          query: GET_ORGANIZATION_PAGE_QUERY,
          variables: {
            input: {
              slug: organizationPageSlug,
              lang: locale as ContentLanguage,
            },
          },
        })
      : {
          data: { getOrganizationPage: organizationPage },
        },
    apolloClient.query<
      Query,
      QueryGetOrganizationPageStandaloneSitemapLevel2Args
    >({
      query: GET_ORGANIZATION_PAGE_STANDALONE_SITEMAP_LEVEL2_QUERY,
      variables: {
        input: {
          organizationPageSlug,
          categorySlug,
          subcategorySlug,
          lang: locale as ContentLanguage,
        },
      },
    }),
  ])

  if (!getOrganizationPage) {
    throw new CustomNextError(404, 'Organization page was not found')
  }

  if (!getOrganizationPageStandaloneSitemapLevel2) {
    throw new CustomNextError(
      404,
      'Organization page standalone level 2 sitemap was not found',
    )
  }

  const category = organizationPage?.topLevelNavigation?.links.find(
    (link) => categorySlug === link.href.split('/').pop(),
  )

  return {
    organizationPage: getOrganizationPage,
    category,
    sitemap: getOrganizationPageStandaloneSitemapLevel2,
  }
}

export default StandaloneLevel2Sitemap
