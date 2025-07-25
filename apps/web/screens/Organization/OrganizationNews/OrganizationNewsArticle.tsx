import { useRouter } from 'next/router'

import { BreadCrumbItem, NavigationItem } from '@island.is/island-ui/core'
import { Locale } from '@island.is/shared/types'
import {
  getThemeConfig,
  HeadWithSocialSharing,
  NewsArticle,
  OrganizationWrapper,
} from '@island.is/web/components'
import {
  ContentLanguage,
  GetNamespaceQuery,
  GetSingleNewsItemQuery,
  OrganizationPage,
  Query,
  QueryGetNamespaceArgs,
  QueryGetOrganizationPageArgs,
  QueryGetSingleNewsArgs,
} from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import { useLinkResolver } from '@island.is/web/hooks'
import useContentfulId from '@island.is/web/hooks/useContentfulId'
import { useLocalLinkTypeResolver } from '@island.is/web/hooks/useLocalLinkTypeResolver'
import { withMainLayout } from '@island.is/web/layouts/main'
import {
  GET_NAMESPACE_QUERY,
  GET_ORGANIZATION_PAGE_QUERY,
  GET_SINGLE_NEWS_ITEM_QUERY,
} from '@island.is/web/screens/queries'
import type { Screen, ScreenContext } from '@island.is/web/types'
import { CustomNextError } from '@island.is/web/units/errors'
import { extractNamespaceFromOrganization } from '@island.is/web/utils/extractNamespaceFromOrganization'

export interface OrganizationNewsArticleProps {
  newsItem: GetSingleNewsItemQuery['getSingleNews']
  namespace: GetNamespaceQuery['getNamespace']
  organizationPage: OrganizationPage
  locale: Locale
}

type OrganizationNewsArticleScreenContext = ScreenContext & {
  organizationPage?: Query['getOrganizationPage']
}

const OrganizationNewsArticle: Screen<
  OrganizationNewsArticleProps,
  OrganizationNewsArticleScreenContext
> = ({ newsItem, namespace, organizationPage, locale }) => {
  const router = useRouter()
  const { linkResolver } = useLinkResolver()
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  const n = useNamespace(namespace)
  useContentfulId(organizationPage.id, newsItem?.id)
  useLocalLinkTypeResolver()

  // We only display breadcrumbs and highlighted nav item if the news item belongs to this organization
  const newsBelongToOrganization =
    !!newsItem?.organization?.slug &&
    !!organizationPage?.organization?.slug &&
    newsItem.organization.slug === organizationPage.organization.slug

  const overviewPath: string = router.asPath.substring(
    0,
    router.asPath.lastIndexOf('/'),
  )

  const currentNavItem = organizationPage.menuLinks.find(
    ({ primaryLink }) => primaryLink?.url === overviewPath,
  )
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  const newsOverviewTitle: string = currentNavItem
    ? currentNavItem.primaryLink?.text
    : n('newsTitle', 'Fréttir og tilkynningar')

  const isNewsletter = newsItem?.genericTags?.some(
    (x) => x.slug === 'frettabref',
  )

  const newsletterTitle = newsItem?.genericTags?.find(
    (x) => x.slug === 'frettabref',
  )?.title

  const breadCrumbs: BreadCrumbItem[] = [
    {
      title: 'Ísland.is',
      href: linkResolver('homepage', [], locale).href,
      typename: 'homepage',
    },
    {
      title: organizationPage.title,
      href: linkResolver('organizationpage', [organizationPage.slug], locale)
        .href,
      typename: 'organizationpage',
    },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore make web strict
    ...(newsBelongToOrganization && !isNewsletter
      ? [
          {
            isTag: true,
            title: newsOverviewTitle,
            href: linkResolver('organizationnewsoverview', [
              organizationPage.slug,
            ]).href,
            typename: 'organizationnewsoverview',
          },
        ]
      : []),
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore make web strict
    ...(isNewsletter
      ? [
          {
            isTag: true,
            title: newsletterTitle,
            href:
              linkResolver('organizationnewsoverview', [organizationPage.slug])
                .href + '?tag=frettabref',
            typename: 'organizationnewsoverview',
          },
        ]
      : []),
  ]
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  const navList: NavigationItem[] = organizationPage.menuLinks.map(
    ({ primaryLink, childrenLinks }) => ({
      title: primaryLink?.text,
      href: primaryLink?.url,
      active: newsBelongToOrganization && primaryLink?.url === overviewPath,
      items: childrenLinks.map(({ text, url }) => ({
        title: text,
        href: url,
      })),
    }),
  )

  return (
    <>
      <OrganizationWrapper
        pageTitle={organizationPage.title}
        organizationPage={organizationPage}
        breadcrumbItems={breadCrumbs}
        showReadSpeaker={false}
        navigationData={{
          title: n('navigationTitle', 'Efnisyfirlit'),
          items: navList,
        }}
      >
        <NewsArticle newsItem={newsItem} />
      </OrganizationWrapper>
      <HeadWithSocialSharing
        title={`${newsItem?.title} | ${organizationPage.title}`}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore make web strict
        description={newsItem?.intro}
        imageUrl={newsItem?.image?.url}
        imageWidth={newsItem?.image?.width.toString()}
        imageHeight={newsItem?.image?.height.toString()}
      />
    </>
  )
}

OrganizationNewsArticle.getProps = async ({
  apolloClient,
  locale,
  query,
  organizationPage: _organizationPage,
}) => {
  const [organizationPageSlug, _, newsSlug] = query.slugs as string[]

  const organizationPage = !_organizationPage
    ? (
        await apolloClient.query<Query, QueryGetOrganizationPageArgs>({
          query: GET_ORGANIZATION_PAGE_QUERY,
          variables: {
            input: {
              slug: organizationPageSlug,
              lang: locale as Locale,
            },
          },
        })
      ).data?.getOrganizationPage
    : _organizationPage

  if (!organizationPage) {
    throw new CustomNextError(
      404,
      `Could not find organization page with slug: ${organizationPageSlug}`,
    )
  }

  const [
    {
      data: { getSingleNews: newsItem },
    },
    namespace,
  ] = await Promise.all([
    apolloClient.query<GetSingleNewsItemQuery, QueryGetSingleNewsArgs>({
      query: GET_SINGLE_NEWS_ITEM_QUERY,
      variables: {
        input: {
          slug: newsSlug,
          lang: locale as ContentLanguage,
        },
      },
    }),

    apolloClient
      .query<GetNamespaceQuery, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: {
            lang: locale as ContentLanguage,
            namespace: 'Newspages',
          },
        },
      })
      // map data here to reduce data processing in component
      .then((variables) =>
        variables.data.getNamespace?.fields
          ? JSON.parse(variables.data.getNamespace.fields)
          : {},
      ),
  ])

  if (!newsItem) {
    throw new CustomNextError(404, 'News not found')
  }

  const newsItemBelongsToOrganization =
    Boolean(newsItem.organization?.slug) &&
    Boolean(organizationPage.organization?.slug) &&
    newsItem.organization?.slug === organizationPage.organization?.slug

  if (!newsItemBelongsToOrganization) {
    throw new CustomNextError(
      404,
      `News item ${newsItem.slug} does not belong to organization ${organizationPage.organization?.slug}`,
    )
  }

  const organizationNamespace = extractNamespaceFromOrganization(
    organizationPage.organization,
  )

  return {
    organizationPage: organizationPage,
    newsItem,
    namespace,
    locale: locale as Locale,
    customTopLoginButtonItem: organizationNamespace?.customTopLoginButtonItem,
    ...getThemeConfig(organizationPage?.theme, organizationPage?.organization),
  }
}

export default withMainLayout(OrganizationNewsArticle)
