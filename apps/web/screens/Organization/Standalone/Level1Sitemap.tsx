import {
  CategoryCard,
  GridColumn,
  GridContainer,
  GridRow,
  Stack,
} from '@island.is/island-ui/core'
import { Text } from '@island.is/island-ui/core'
import type { SpanType } from '@island.is/island-ui/core/types'
import {
  ContentLanguage,
  OrganizationPage,
  Query,
  QueryGetOrganizationPageArgs,
  QueryGetOrganizationPageStandaloneSitemapLevel1Args,
} from '@island.is/web/graphql/schema'
import useContentfulId from '@island.is/web/hooks/useContentfulId'
import { StandaloneLayout } from '@island.is/web/layouts/organization/standalone'
import type { Screen, ScreenContext } from '@island.is/web/types'
import { CustomNextError } from '@island.is/web/units/errors'

import {
  GET_ORGANIZATION_PAGE_QUERY,
  GET_ORGANIZATION_PAGE_STANDALONE_SITEMAP_LEVEL1_QUERY,
} from '../../queries'

const GRID_COLUMN_SPAN: SpanType = ['1/1', '1/1', '1/1', '1/2', '1/3']

const LanguageToggleSetup = (props: { ids: string[] }) => {
  useContentfulId(...props.ids)
  return null
}

type StandaloneLevel1SitemapScreenContext = ScreenContext & {
  organizationPage?: Query['getOrganizationPage']
}

export interface StandaloneLevel1SitemapProps {
  organizationPage: OrganizationPage
  categoryTitle: string
  items: {
    label: string
    href: string
    description?: string | null
  }[]
}

const StandaloneLevel1Sitemap: Screen<
  StandaloneLevel1SitemapProps,
  StandaloneLevel1SitemapScreenContext
> = ({ organizationPage, categoryTitle, items }) => {
  return (
    <StandaloneLayout
      organizationPage={organizationPage}
      seo={{
        title: `${categoryTitle} | ${organizationPage.title}`,
      }}
    >
      <LanguageToggleSetup ids={[organizationPage.id]} />
      <GridContainer>
        <GridRow>
          <GridColumn span={['9/9', '9/9', '7/9']} offset={['0', '0', '1/9']}>
            <Stack space={3}>
              <Text variant="h1" as="h1">
                {categoryTitle}
              </Text>
              <GridRow rowGap={3}>
                {items.map(({ label, description, href }, index) => (
                  <GridColumn span={GRID_COLUMN_SPAN} key={index}>
                    <CategoryCard
                      heading={label}
                      headingAs="h2"
                      headingVariant="h3"
                      text={description ?? ''}
                      href={href}
                    />
                  </GridColumn>
                ))}
              </GridRow>
            </Stack>
          </GridColumn>
        </GridRow>
      </GridContainer>
    </StandaloneLayout>
  )
}

StandaloneLevel1Sitemap.getProps = async ({
  apolloClient,
  locale,
  query,
  organizationPage,
}) => {
  const [organizationPageSlug, categorySlug] = (query.slugs ?? []) as string[]

  const [
    {
      data: { getOrganizationPage },
    },
    {
      data: { getOrganizationPageStandaloneSitemapLevel1 },
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
      QueryGetOrganizationPageStandaloneSitemapLevel1Args
    >({
      query: GET_ORGANIZATION_PAGE_STANDALONE_SITEMAP_LEVEL1_QUERY,
      variables: {
        input: {
          organizationPageSlug,
          categorySlug,
          lang: locale as ContentLanguage,
        },
      },
    }),
  ])

  if (!getOrganizationPage) {
    throw new CustomNextError(404, 'Organization page was not found')
  }

  if (!getOrganizationPageStandaloneSitemapLevel1) {
    throw new CustomNextError(
      404,
      'Organization page standalone level 1 sitemap was not found',
    )
  }

  const categoryTitle = organizationPage?.topLevelNavigation?.links.find(
    (link) => categorySlug === link.href.split('/').pop(),
  )?.label

  if (!categoryTitle) {
    throw new CustomNextError(
      404,
      'Organization page standalone level 1 category was not found',
    )
  }

  return {
    organizationPage: getOrganizationPage,
    categoryTitle,
    items: getOrganizationPageStandaloneSitemapLevel1.childLinks,
  }
}

export default StandaloneLevel1Sitemap
