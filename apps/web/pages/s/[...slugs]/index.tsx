import { type FC } from 'react'

import type {
  Query,
  QueryGetOrganizationPageArgs,
} from '@island.is/web/graphql/schema'
import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import type { LayoutProps } from '@island.is/web/layouts/main'
import OrganizationSubPageGenericListItem, {
  OrganizationSubPageGenericListItemProps,
} from '@island.is/web/screens/GenericList/OrganizationSubPageGenericListItem'
import OrganizationCategory, {
  type OrganizationCategoryProps,
} from '@island.is/web/screens/Organization/Category/Category'
import CourseDetails, {
  type CourseDetailsProps,
} from '@island.is/web/screens/Organization/Courses/CourseDetails'
import CourseList, {
  type CourseListProps,
} from '@island.is/web/screens/Organization/Courses/CourseList'
import Home, {
  type HomeProps,
} from '@island.is/web/screens/Organization/Home/Home'
import OrganizationEventArticle, {
  type OrganizationEventArticleProps,
} from '@island.is/web/screens/Organization/OrganizationEvents/OrganizationEventArticle'
import OrganizationEventList, {
  type OrganizationEventListProps,
} from '@island.is/web/screens/Organization/OrganizationEvents/OrganizationEventList'
import OrganizationNewsArticle, {
  type OrganizationNewsArticleProps,
} from '@island.is/web/screens/Organization/OrganizationNews/OrganizationNewsArticle'
import OrganizationNewsList, {
  type OrganizationNewsListProps,
} from '@island.is/web/screens/Organization/OrganizationNews/OrganizationNewsList'
import OrganizationParentSubpage, {
  type OrganizationParentSubpageProps,
} from '@island.is/web/screens/Organization/ParentSubpage'
import PublishedMaterial, {
  type PublishedMaterialProps,
} from '@island.is/web/screens/Organization/PublishedMaterial/PublishedMaterial'
import StandaloneHome, {
  type StandaloneHomeProps,
} from '@island.is/web/screens/Organization/Standalone/Home'
import StandaloneLevel1Sitemap, {
  type StandaloneLevel1SitemapProps,
} from '@island.is/web/screens/Organization/Standalone/Level1Sitemap'
import StandaloneLevel2Sitemap, {
  type StandaloneLevel2SitemapProps,
} from '@island.is/web/screens/Organization/Standalone/Level2Sitemap'
import StandaloneParentSubpage, {
  StandaloneParentSubpageProps,
} from '@island.is/web/screens/Organization/Standalone/ParentSubpage'
import SubPage, {
  type SubPageProps,
} from '@island.is/web/screens/Organization/SubPage'
import { GET_ORGANIZATION_PAGE_QUERY } from '@island.is/web/screens/queries'
import type { Screen as ScreenType } from '@island.is/web/types'
import { CustomNextError } from '@island.is/web/units/errors'
import { extractNamespaceFromOrganization } from '@island.is/web/utils/extractNamespaceFromOrganization'
import { getServerSidePropsWrapper } from '@island.is/web/utils/getServerSidePropsWrapper'

enum PageType {
  FRONTPAGE = 'frontpage',
  STANDALONE_FRONTPAGE = 'standalone-frontpage',
  STANDALONE_PARENT_SUBPAGE = 'standalone-parent-subpage',
  STANDALONE_LEVEL1_SITEMAP = 'standalone-level1-sitemap',
  STANDALONE_LEVEL2_SITEMAP = 'standalone-level2-sitemap',
  PARENT_SUBPAGE = 'parent-subpage',
  SUBPAGE = 'subpage',
  ALL_NEWS = 'news',
  PUBLISHED_MATERIAL = 'published-material',
  ALL_EVENTS = 'events',
  NEWS_DETAILS = 'news-details',
  EVENT_DETAILS = 'event-details',
  GENERIC_LIST_ITEM = 'generic-list-item',
  CATEGORY = 'category',
  COURSE_LIST = 'course-list',
  COURSE_DETAILS = 'course-details',
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const pageMap: Record<PageType, FC<any>> = {
  [PageType.FRONTPAGE]: (props) => <Home {...props} />,
  [PageType.STANDALONE_FRONTPAGE]: (props) => <StandaloneHome {...props} />,
  [PageType.STANDALONE_PARENT_SUBPAGE]: (props) => (
    <StandaloneParentSubpage {...props} />
  ),
  [PageType.STANDALONE_LEVEL1_SITEMAP]: (props) => (
    <StandaloneLevel1Sitemap {...props} />
  ),
  [PageType.STANDALONE_LEVEL2_SITEMAP]: (props) => (
    <StandaloneLevel2Sitemap {...props} />
  ),
  [PageType.PARENT_SUBPAGE]: (props) => (
    <OrganizationParentSubpage {...props} />
  ),
  [PageType.SUBPAGE]: (props) => <SubPage {...props} />,
  [PageType.ALL_NEWS]: (props) => <OrganizationNewsList {...props} />,
  [PageType.PUBLISHED_MATERIAL]: (props) => <PublishedMaterial {...props} />,
  [PageType.ALL_EVENTS]: (props) => <OrganizationEventList {...props} />,
  [PageType.NEWS_DETAILS]: (props) => <OrganizationNewsArticle {...props} />,
  [PageType.EVENT_DETAILS]: (props) => <OrganizationEventArticle {...props} />,
  [PageType.GENERIC_LIST_ITEM]: (props) => (
    <OrganizationSubPageGenericListItem {...props} />
  ),
  [PageType.CATEGORY]: (props) => <OrganizationCategory {...props} />,
  [PageType.COURSE_LIST]: (props) => <CourseList {...props} />,
  [PageType.COURSE_DETAILS]: (props) => <CourseDetails {...props} />,
}

interface Props {
  page:
    | {
        type: PageType.FRONTPAGE
        props: {
          layoutProps: LayoutProps
          componentProps: HomeProps
        }
      }
    | {
        type: PageType.STANDALONE_FRONTPAGE
        props: StandaloneHomeProps
      }
    | {
        type: PageType.STANDALONE_PARENT_SUBPAGE
        props: StandaloneParentSubpageProps
      }
    | {
        type: PageType.STANDALONE_LEVEL1_SITEMAP
        props: StandaloneLevel1SitemapProps
      }
    | {
        type: PageType.STANDALONE_LEVEL2_SITEMAP
        props: StandaloneLevel2SitemapProps
      }
    | {
        type: PageType.PARENT_SUBPAGE
        props: {
          layoutProps: LayoutProps
          componentProps: OrganizationParentSubpageProps
        }
      }
    | {
        type: PageType.SUBPAGE
        props: {
          layoutProps: LayoutProps
          componentProps: SubPageProps
        }
      }
    | {
        type: PageType.ALL_NEWS
        props: {
          layoutProps: LayoutProps
          componentProps: OrganizationNewsListProps
        }
      }
    | {
        type: PageType.PUBLISHED_MATERIAL
        props: {
          layoutProps: LayoutProps
          componentProps: PublishedMaterialProps
        }
      }
    | {
        type: PageType.ALL_EVENTS
        props: {
          layoutProps: LayoutProps
          componentProps: OrganizationEventListProps
        }
      }
    | {
        type: PageType.NEWS_DETAILS
        props: {
          layoutProps: LayoutProps
          componentProps: OrganizationNewsArticleProps
        }
      }
    | {
        type: PageType.EVENT_DETAILS
        props: {
          layoutProps: LayoutProps
          componentProps: OrganizationEventArticleProps
        }
      }
    | {
        type: PageType.GENERIC_LIST_ITEM
        props: OrganizationSubPageGenericListItemProps
      }
    | {
        type: PageType.CATEGORY
        props: {
          layoutProps: LayoutProps
          componentProps: OrganizationCategoryProps
        }
      }
    | {
        type: PageType.COURSE_LIST
        props: {
          layoutProps: LayoutProps
          componentProps: CourseListProps
        }
      }
    | {
        type: PageType.COURSE_DETAILS
        props: {
          layoutProps: LayoutProps
          componentProps: CourseDetailsProps
        }
      }
}

export const Component: ScreenType<Props> = ({ page }: Props) => {
  return pageMap[page.type](page.props)
}

Component.getProps = async (context) => {
  const slugs = context.query.slugs as string[]
  const locale = context.locale || 'is'

  const {
    data: { getOrganizationPage: organizationPage },
  } = await context.apolloClient.query<Query, QueryGetOrganizationPageArgs>({
    query: GET_ORGANIZATION_PAGE_QUERY,
    variables: {
      input: {
        slug: slugs[0],
        lang: locale,
        subpageSlugs: slugs.slice(1),
      },
    },
  })

  if (!organizationPage) {
    if (slugs.length === 1) {
      return {
        page: {
          type: PageType.FRONTPAGE,
          props: await Home.getProps(context),
        },
      }
    }
    throw new CustomNextError(404, 'Organization page was not found')
  }

  const modifiedContext = { ...context, organizationPage }

  const isStandaloneTheme = organizationPage.theme === 'standalone'

  const organizationNamespace = extractNamespaceFromOrganization(
    organizationPage.organization,
  )

  if (slugs.length === 1) {
    if (isStandaloneTheme) {
      return {
        page: {
          type: PageType.STANDALONE_FRONTPAGE,
          props: await StandaloneHome.getProps(modifiedContext),
        },
      }
    }

    return {
      page: {
        type: PageType.FRONTPAGE,
        props: await Home.getProps(modifiedContext),
      },
    }
  }

  if (slugs.length === 2) {
    if (locale !== 'is') {
      if (slugs[1] === 'news') {
        return {
          page: {
            type: PageType.ALL_NEWS,
            props: await OrganizationNewsList.getProps(modifiedContext),
          },
        }
      }
      if (slugs[1] === 'events') {
        return {
          page: {
            type: PageType.ALL_EVENTS,
            props: await OrganizationEventList.getProps(modifiedContext),
          },
        }
      }
      if (slugs[1] === 'published-material') {
        return {
          page: {
            type: PageType.PUBLISHED_MATERIAL,
            props: await PublishedMaterial.getProps(modifiedContext),
          },
        }
      }
      if (
        slugs[1] === 'courses' &&
        Boolean(organizationNamespace['organizationCourseListEnabled'])
      ) {
        return {
          page: {
            type: PageType.COURSE_LIST,
            props: await CourseList.getProps(modifiedContext),
          },
        }
      }
    } else {
      if (slugs[1] === 'frett') {
        return {
          page: {
            type: PageType.ALL_NEWS,
            props: await OrganizationNewsList.getProps(modifiedContext),
          },
        }
      }
      if (slugs[1] === 'vidburdir') {
        return {
          page: {
            type: PageType.ALL_EVENTS,
            props: await OrganizationEventList.getProps(modifiedContext),
          },
        }
      }
      if (slugs[1] === 'utgefid-efni') {
        return {
          page: {
            type: PageType.PUBLISHED_MATERIAL,
            props: await PublishedMaterial.getProps(modifiedContext),
          },
        }
      }
      if (
        slugs[1] === 'namskeid' &&
        Boolean(organizationNamespace['organizationCourseListEnabled'])
      ) {
        return {
          page: {
            type: PageType.COURSE_LIST,
            props: await CourseList.getProps(modifiedContext),
          },
        }
      }
    }

    if (
      isStandaloneTheme &&
      organizationPage.topLevelNavigation?.links.some(
        (link) => slugs[1] === link.href.split('/').pop(),
      )
    ) {
      return {
        page: {
          type: PageType.STANDALONE_LEVEL1_SITEMAP,
          props: await StandaloneLevel1Sitemap.getProps(modifiedContext),
        },
      }
    }

    try {
      if (isStandaloneTheme) {
        return {
          page: {
            type: PageType.STANDALONE_PARENT_SUBPAGE,
            props: await StandaloneParentSubpage.getProps(modifiedContext),
          },
        }
      }
      return {
        page: {
          type: PageType.PARENT_SUBPAGE,
          props: await OrganizationParentSubpage.getProps(modifiedContext),
        },
      }
    } catch (error) {
      if (!(error instanceof CustomNextError)) {
        throw error
      }
    }

    try {
      return {
        page: {
          type: PageType.SUBPAGE,
          props: await SubPage.getProps(modifiedContext),
        },
      }
    } catch (error) {
      if (!(error instanceof CustomNextError)) {
        throw error
      }
      return {
        page: {
          type: PageType.CATEGORY,
          props: await OrganizationCategory.getProps(modifiedContext),
        },
      }
    }
  }

  if (slugs.length === 3) {
    if (locale !== 'is') {
      if (slugs[1] === 'news') {
        return {
          page: {
            type: PageType.NEWS_DETAILS,
            props: await OrganizationNewsArticle.getProps(modifiedContext),
          },
        }
      }
      if (slugs[1] === 'events') {
        return {
          page: {
            type: PageType.EVENT_DETAILS,
            props: await OrganizationEventArticle.getProps(modifiedContext),
          },
        }
      }
      if (
        slugs[1] === 'courses' &&
        Boolean(organizationNamespace['organizationCourseDetailsEnabled'])
      ) {
        return {
          page: {
            type: PageType.COURSE_DETAILS,
            props: await CourseDetails.getProps(modifiedContext),
          },
        }
      }
    } else {
      if (slugs[1] === 'frett') {
        return {
          page: {
            type: PageType.NEWS_DETAILS,
            props: await OrganizationNewsArticle.getProps(modifiedContext),
          },
        }
      }
      if (slugs[1] === 'vidburdir') {
        return {
          page: {
            type: PageType.EVENT_DETAILS,
            props: await OrganizationEventArticle.getProps(modifiedContext),
          },
        }
      }
      if (
        slugs[1] === 'namskeid' &&
        Boolean(organizationNamespace['organizationCourseDetailsEnabled'])
      ) {
        return {
          page: {
            type: PageType.COURSE_DETAILS,
            props: await CourseDetails.getProps(modifiedContext),
          },
        }
      }
    }

    if (
      isStandaloneTheme &&
      organizationPage.topLevelNavigation?.links.some(
        (link) => slugs[1] === link.href.split('/').pop(),
      )
    ) {
      try {
        return {
          page: {
            type: PageType.STANDALONE_LEVEL2_SITEMAP,
            props: await StandaloneLevel2Sitemap.getProps(modifiedContext),
          },
        }
      } catch (error) {
        if (!(error instanceof CustomNextError)) {
          throw error
        }
      }
    }

    try {
      if (isStandaloneTheme) {
        return {
          page: {
            type: PageType.STANDALONE_PARENT_SUBPAGE,
            props: await StandaloneParentSubpage.getProps(modifiedContext),
          },
        }
      }
      return {
        page: {
          type: PageType.PARENT_SUBPAGE,
          props: await OrganizationParentSubpage.getProps(modifiedContext),
        },
      }
    } catch (error) {
      if (!(error instanceof CustomNextError)) {
        throw error
      }
    }

    return {
      page: {
        type: PageType.GENERIC_LIST_ITEM,
        props: await OrganizationSubPageGenericListItem.getProps(
          modifiedContext,
        ),
      },
    }
  }

  if (slugs.length === 4) {
    return {
      page: {
        type: PageType.GENERIC_LIST_ITEM,
        props: await OrganizationSubPageGenericListItem.getProps(
          modifiedContext,
        ),
      },
    }
  }

  throw new CustomNextError(404)
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore make web strict
const Screen = withApollo(withLocale('is')(Component))

export const getServerSideProps = getServerSidePropsWrapper(Screen)

export default Screen
