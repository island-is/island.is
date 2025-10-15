import { useRouter } from 'next/router'

import { CategoryCard, Stack, Text } from '@island.is/island-ui/core'
import { OrganizationWrapper } from '@island.is/web/components'
import {
  OrganizationPage,
  OrganizationPageNavigationLinksCategory,
  Query,
  QueryGetContentSlugArgs,
  QueryGetNamespaceArgs,
  QueryGetOrganizationPageArgs,
} from '@island.is/web/graphql/schema'
import { useLinkResolver, useNamespace } from '@island.is/web/hooks'
import { withMainLayout } from '@island.is/web/layouts/main'
import type { Screen, ScreenContext } from '@island.is/web/types'
import { CustomNextError } from '@island.is/web/units/errors'

import {
  GET_CONTENT_SLUG,
  GET_NAMESPACE_QUERY,
  GET_ORGANIZATION_PAGE_QUERY,
} from '../../queries'
import { getSubpageNavList } from '../SubPage'

export interface OrganizationCategoryProps {
  organizationPage: OrganizationPage
  namespace: Record<string, string>
  activeCategory: OrganizationPageNavigationLinksCategory
}

type OrganizationCategoryScreenContext = ScreenContext & {
  organizationPage?: Query['getOrganizationPage']
}

const OrganizationCategory: Screen<
  OrganizationCategoryProps,
  OrganizationCategoryScreenContext
> = ({ organizationPage, namespace, activeCategory }) => {
  const router = useRouter()
  const n = useNamespace(namespace)
  const { linkResolver } = useLinkResolver()

  return (
    <OrganizationWrapper
      organizationPage={organizationPage}
      navigationData={{
        items: getSubpageNavList(organizationPage, router),
        title: n('navigationTitle', 'Efnisyfirlit'),
      }}
      pageTitle={activeCategory.label}
      showReadSpeaker={false}
      breadcrumbItems={[
        {
          title: 'Ísland.is',
          href: linkResolver('homepage').href,
        },
        {
          title: organizationPage?.title ?? '',
          href: linkResolver('organizationpage', [organizationPage?.slug ?? ''])
            .href,
        },
      ]}
      mainContent={
        <Stack space={4}>
          <Stack space={2}>
            <Text variant="h1" as="h1">
              {activeCategory.label}
            </Text>
            {Boolean(activeCategory.description) && (
              <Text>{activeCategory.description}</Text>
            )}
          </Stack>
          <Stack space={3}>
            {activeCategory.childLinks.map((link, index) => (
              <CategoryCard
                key={`${index}-${link.href}`}
                heading={link.label}
                text={link.description ?? ''}
                href={link.href}
                headingAs="h2"
              />
            ))}
          </Stack>
        </Stack>
      }
    />
  )
}

OrganizationCategory.getProps = async ({
  query,
  apolloClient,
  locale,
  organizationPage: _organizationPage,
}) => {
  const [organizationPageSlug, categorySlug] = query.slugs as string[]

  const [organizationPageResponse, namespace] = await Promise.all([
    _organizationPage
      ? { data: { getOrganizationPage: _organizationPage } }
      : apolloClient.query<Query, QueryGetOrganizationPageArgs>({
          query: GET_ORGANIZATION_PAGE_QUERY,
          variables: {
            input: {
              slug: organizationPageSlug,
              lang: locale,
              subpageSlugs: [categorySlug],
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
        variables.data.getNamespace?.fields
          ? JSON.parse(variables.data.getNamespace.fields)
          : {},
      ),
  ])

  if (!organizationPageResponse?.data?.getOrganizationPage) {
    throw new CustomNextError(
      404,
      `Organization page with slug: "${organizationPageSlug}" was not found`,
    )
  }

  const activeCategory =
    organizationPageResponse.data.getOrganizationPage.navigationLinks
      ?.activeCategory

  if (!activeCategory) {
    throw new CustomNextError(
      404,
      `Active category with slug: "${categorySlug}" was not found`,
    )
  }

  const otherOrganizationPageSlug = await apolloClient.query<
    Query,
    QueryGetContentSlugArgs
  >({
    query: GET_CONTENT_SLUG,
    variables: {
      input: {
        id: organizationPageResponse.data.getOrganizationPage.id,
      },
    },
  })

  const slugResponse = otherOrganizationPageSlug.data.getContentSlug?.slug

  return {
    organizationPage: organizationPageResponse.data.getOrganizationPage,
    namespace,
    activeCategory,
    languageToggleHrefOverride: {
      is: slugResponse?.is
        ? `/s/${slugResponse.is}/${activeCategory.icelandicSlug}`
        : undefined,
      en: slugResponse?.en
        ? `/en/o/${slugResponse.en}/${activeCategory.englishSlug}`
        : undefined,
    },
  }
}

export default withMainLayout(OrganizationCategory, {
  footerVersion: 'organization',
})
