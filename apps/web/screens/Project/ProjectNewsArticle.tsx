import { useRouter } from 'next/router'

import { BreadCrumbItem } from '@island.is/island-ui/core'
import { Locale } from '@island.is/shared/types'
import { HeadWithSocialSharing, NewsArticle } from '@island.is/web/components'
import {
  ContentLanguage,
  GetNamespaceQuery,
  GetSingleNewsItemQuery,
  ProjectPage,
  Query,
  QueryGetNamespaceArgs,
  QueryGetProjectPageArgs,
  QueryGetSingleNewsArgs,
} from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import useContentfulId from '@island.is/web/hooks/useContentfulId'
import { useLocalLinkTypeResolver } from '@island.is/web/hooks/useLocalLinkTypeResolver'
import { withMainLayout } from '@island.is/web/layouts/main'
import {
  GET_NAMESPACE_QUERY,
  GET_SINGLE_NEWS_ITEM_QUERY,
} from '@island.is/web/screens/queries'
import { Screen } from '@island.is/web/types'

import { useLinkResolver } from '../../hooks/useLinkResolver'
import { CustomNextError } from '../../units/errors'
import { GET_PROJECT_PAGE_QUERY } from '../queries/Project'
import { ProjectWrapper } from './components/ProjectWrapper'
import { getThemeConfig } from './utils'

interface ProjectNewsArticleleProps {
  newsItem: GetSingleNewsItemQuery['getSingleNews']
  namespace: GetNamespaceQuery['getNamespace']
  projectPage: ProjectPage
  locale: Locale
}

const ProjectNewsArticle: Screen<ProjectNewsArticleleProps> = ({
  newsItem,
  namespace,
  projectPage,
  locale,
}) => {
  const Router = useRouter()
  const { linkResolver } = useLinkResolver()
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  const n = useNamespace(namespace)
  useContentfulId(projectPage.id, newsItem?.id)
  useLocalLinkTypeResolver()

  const overviewPath: string = Router.asPath.substring(
    0,
    Router.asPath.lastIndexOf('/'),
  )

  const currentNavItem = projectPage.sidebarLinks.find(
    ({ primaryLink }) => primaryLink?.url === overviewPath,
  )
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  const newsOverviewTitle: string = currentNavItem
    ? currentNavItem.primaryLink?.text
    : n('newsTitle', 'Fréttir og tilkynningar')

  const breadCrumbs: BreadCrumbItem[] = [
    {
      title: 'Ísland.is',
      href: linkResolver('homepage', [], locale).href,
      typename: 'homepage',
    },
    {
      title: projectPage.title,
      href: linkResolver('projectpage', [projectPage.slug], locale).href,
      typename: 'projectpage',
    },
    {
      isTag: true,
      title: newsOverviewTitle,
      href: linkResolver('projectnewsoverview', [projectPage.slug]).href,
      typename: 'projectnewsoverview',
    },
  ]

  const indexableBySearchEngine =
    newsItem?.organization?.canPagesBeFoundInSearchResults ?? true

  return (
    <>
      <ProjectWrapper
        projectPage={projectPage}
        breadcrumbItems={breadCrumbs}
        sidebarNavigationTitle={n('navigationTitle', 'Efnisyfirlit')}
        withSidebar={true}
      >
        <NewsArticle newsItem={newsItem} />
      </ProjectWrapper>
      <HeadWithSocialSharing
        title={`${newsItem?.title} | ${projectPage.title}`}
        description={newsItem?.intro || ''}
        imageUrl={newsItem?.image?.url}
        imageWidth={newsItem?.image?.width.toString()}
        imageHeight={newsItem?.image?.height.toString()}
      >
        {!indexableBySearchEngine && (
          <meta name="robots" content="noindex, nofollow" />
        )}
      </HeadWithSocialSharing>
    </>
  )
}

ProjectNewsArticle.getProps = async ({ apolloClient, locale, query }) => {
  const projectPage = (
    await Promise.resolve(
      apolloClient.query<Query, QueryGetProjectPageArgs>({
        query: GET_PROJECT_PAGE_QUERY,
        variables: {
          input: {
            slug: query.slug as string,
            lang: locale as Locale,
          },
        },
      }),
    )
  ).data?.getProjectPage

  if (!projectPage) {
    throw new CustomNextError(
      404,
      `Could not find project page with slug: ${query.slug}`,
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

  const newsItemBelongsToProject = newsItem.genericTags.some(
    (tag) => tag.id === projectPage.newsTag?.id,
  )

  if (!newsItemBelongsToProject) {
    throw new CustomNextError(
      404,
      `News item ${newsItem.slug} does not belong to project ${projectPage.slug}`,
    )
  }

  return {
    projectPage: projectPage,
    newsItem,
    namespace,
    locale: locale as Locale,
    ...getThemeConfig(projectPage),
  }
}

export default withMainLayout(ProjectNewsArticle)
