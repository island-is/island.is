import {
  Box,
  BreadCrumbItem,
  Breadcrumbs,
  Hidden,
  NavigationItem,
} from '@island.is/island-ui/core'
import { Screen } from '@island.is/web/types'
import {
  GET_NAMESPACE_QUERY,
  GET_SINGLE_NEWS_ITEM_QUERY,
} from '@island.is/web/screens/queries'
import { withMainLayout } from '@island.is/web/layouts/main'
import useContentfulId from '@island.is/web/hooks/useContentfulId'
import {
  ContentLanguage,
  GetSingleNewsItemQuery,
  QueryGetSingleNewsArgs,
  QueryGetNamespaceArgs,
  GetNamespaceQuery,
  Query,
} from '@island.is/web/graphql/schema'
import {
  getThemeConfig,
  HeadWithSocialSharing,
  NewsArticle,
  OrganizationWrapper,
} from '@island.is/web/components'
import { useNamespace } from '@island.is/web/hooks'
import { LinkType, useLinkResolver } from '../../hooks/useLinkResolver'

import { CustomNextError } from '../../units/errors'
import { useRouter } from 'next/router'
import { useLocalLinkTypeResolver } from '@island.is/web/hooks/useLocalLinkTypeResolver'
import { ProjectWrapper } from '../Project/components/ProjectWrapper'
import { getParentPage } from './NewsList'
import { ProjectHeader } from '../Project/components/ProjectHeader'
import { getSidebarNavigationComponent } from '../Project/utils'

interface NewsItemProps {
  newsItem: GetSingleNewsItemQuery['getSingleNews']
  namespace: GetNamespaceQuery['getNamespace']
  parentPage: Query['getOrganizationPage'] | Query['getProjectPage']
}

const NewsItem: Screen<NewsItemProps> = ({
  newsItem,
  namespace,
  parentPage,
}) => {
  const Router = useRouter()
  const { linkResolver } = useLinkResolver()
  const n = useNamespace(namespace)
  useContentfulId(parentPage.id, newsItem?.id)
  useLocalLinkTypeResolver()

  // We only display breadcrumbs and highlighted nav item if the news has the
  // primary news tag of the organization
  const isOrganizationNews = newsItem.genericTags.some(
    (x) => x.slug === parentPage.newsTag.slug,
  )

  const overviewPath: string = Router.asPath.substring(
    0,
    Router.asPath.lastIndexOf('/'),
  )

  const menuLinks =
    parentPage.__typename === 'ProjectPage'
      ? parentPage.sidebarLinks
      : parentPage.menuLinks

  const currentNavItem = menuLinks.find(
    ({ primaryLink }) => primaryLink.url === overviewPath,
  )

  const newsOverviewTitle: string = currentNavItem
    ? currentNavItem.primaryLink.text
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
      href: linkResolver('homepage').href,
      typename: 'homepage',
    },
    {
      title: parentPage.title,
      href: linkResolver(parentPage.__typename.toLowerCase() as LinkType, [
        parentPage.slug,
      ]).href,
      typename: parentPage.__typename.toLowerCase() as LinkType,
    },
    ...(isOrganizationNews
      ? [
          {
            isTag: true,
            title: newsOverviewTitle,
            href: linkResolver('organizationnewsoverview', [parentPage.slug])
              .href,
            typename: 'organizationnewsoverview',
          },
        ]
      : []),
    ...(isNewsletter
      ? [
          {
            isTag: true,
            title: newsletterTitle,
            href:
              linkResolver('organizationnewsoverview', [parentPage.slug]).href +
              '?tag=frettabref',
            typename: 'organizationnewsoverview',
          },
        ]
      : []),
  ]

  const navList: NavigationItem[] = menuLinks.map(
    ({ primaryLink, childrenLinks }) => ({
      title: primaryLink.text,
      href: primaryLink.url,
      active: isOrganizationNews && primaryLink.url === overviewPath,
      items: childrenLinks.map(({ text, url }) => ({
        title: text,
        href: url,
      })),
    }),
  )

  const socialHead = (
    <HeadWithSocialSharing
      title={`${newsItem.title} | ${parentPage.title}`}
      description={newsItem.intro}
      imageUrl={newsItem.image?.url}
      imageWidth={newsItem.image?.width.toString()}
      imageHeight={newsItem.image?.height.toString()}
    />
  )

  const content = <NewsArticle newsItem={newsItem} />

  const baseRouterPath = Router.asPath.split('?')[0].split('#')[0]

  if (parentPage.__typename === 'ProjectPage') {
    const projectPageSidebarNavigationComponent = getSidebarNavigationComponent(
      parentPage,
      baseRouterPath,
      n('navigationTitle', 'Efnisyfirlit'),
    )
    return (
      <>
        {socialHead}
        <ProjectHeader projectPage={parentPage} />
        <ProjectWrapper
          withSidebar={menuLinks?.length > 0}
          sidebarContent={projectPageSidebarNavigationComponent()}
        >
          <Hidden above="sm">
            <Box>
              <Box marginY={2}>
                {projectPageSidebarNavigationComponent(true)}
              </Box>
            </Box>
          </Hidden>
          <Box marginBottom={3}>
            <Breadcrumbs items={breadCrumbs} />
          </Box>
          {content}
        </ProjectWrapper>
      </>
    )
  }

  return (
    <>
      <OrganizationWrapper
        pageTitle={parentPage.title}
        organizationPage={parentPage}
        breadcrumbItems={breadCrumbs}
        navigationData={{
          title: n('navigationTitle', 'Efnisyfirlit'),
          items: navList,
        }}
      >
        {content}
      </OrganizationWrapper>
      {socialHead}
    </>
  )
}

NewsItem.getInitialProps = async ({
  apolloClient,
  locale,
  query,
  pathname,
}) => {
  const parentPage = await getParentPage(
    apolloClient,
    pathname,
    locale,
    (query?.slug as string) ?? '',
  )

  if (!parentPage) {
    throw new CustomNextError(
      404,
      `Could not find parent page with slug: ${query.slug}`,
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
          slug: query.newsSlug as string,
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
      .then((variables) => {
        // map data here to reduce data processing in component
        return JSON.parse(variables.data.getNamespace.fields)
      }),
  ])

  if (!newsItem) {
    throw new CustomNextError(404, 'News not found')
  }

  return {
    parentPage: parentPage,
    newsItem,
    namespace,
    ...getThemeConfig(parentPage.theme, parentPage.slug),
  }
}

export default withMainLayout(NewsItem)
