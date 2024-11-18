import { type FC } from 'react'

import withApollo from '@island.is/web/graphql/withApollo'
import { withLocale } from '@island.is/web/i18n'
import type { LayoutProps } from '@island.is/web/layouts/main'
import OrganizationSubPageGenericListItem, {
  OrganizationSubPageGenericListItemProps,
} from '@island.is/web/screens/GenericList/OrganizationSubpageGenericListItem'
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
import PublishedMaterial, {
  type PublishedMaterialProps,
} from '@island.is/web/screens/Organization/PublishedMaterial/PublishedMaterial'
import SubPage, {
  type SubPageProps,
} from '@island.is/web/screens/Organization/SubPage'
import { Screen as ScreenType } from '@island.is/web/types'
import { CustomNextError } from '@island.is/web/units/errors'
import { getServerSidePropsWrapper } from '@island.is/web/utils/getServerSidePropsWrapper'

enum PageType {
  FRONTPAGE = 'frontpage',
  SUBPAGE = 'subpage',
  ALL_NEWS = 'news',
  PUBLISHED_MATERIAL = 'published-material',
  ALL_EVENTS = 'events',
  NEWS_DETAILS = 'news-details',
  EVENT_DETAILS = 'event-details',
  GENERIC_LIST_ITEM = 'generic-list-item',
}

const pageMap: Record<PageType, FC<any>> = {
  [PageType.FRONTPAGE]: (props) => <Home {...props} />,
  [PageType.SUBPAGE]: (props) => <SubPage {...props} />,
  [PageType.ALL_NEWS]: (props) => <OrganizationNewsList {...props} />,
  [PageType.PUBLISHED_MATERIAL]: (props) => <PublishedMaterial {...props} />,
  [PageType.ALL_EVENTS]: (props) => <OrganizationEventList {...props} />,
  [PageType.NEWS_DETAILS]: (props) => <OrganizationNewsArticle {...props} />,
  [PageType.EVENT_DETAILS]: (props) => <OrganizationEventArticle {...props} />,
  [PageType.GENERIC_LIST_ITEM]: (props) => (
    <OrganizationSubPageGenericListItem {...props} />
  ),
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
}

export const Component: ScreenType<Props> = ({ page }: Props) => {
  return pageMap[page.type](page.props)
}

Component.getProps = async (context) => {
  const slugs = context.query.slugs as string[]
  const locale = context.locale || 'is'

  // Frontpage
  if (slugs.length === 1) {
    return {
      page: {
        type: PageType.FRONTPAGE,
        props: await Home.getProps?.(context),
      },
    }
  }

  if (slugs.length === 2) {
    if (locale !== 'is') {
      if (slugs[1] === 'news') {
        return {
          page: {
            type: PageType.ALL_NEWS,
            props: await OrganizationNewsList.getProps?.(context),
          },
        }
      }
      if (slugs[1] === 'events') {
        return {
          page: {
            type: PageType.ALL_EVENTS,
            props: await OrganizationEventList.getProps?.(context),
          },
        }
      }
      if (slugs[1] === 'published-material') {
        return {
          page: {
            type: PageType.PUBLISHED_MATERIAL,
            props: await PublishedMaterial.getProps?.(context),
          },
        }
      }
    } else {
      if (slugs[1] === 'frett') {
        return {
          page: {
            type: PageType.ALL_NEWS,
            props: await OrganizationNewsList.getProps?.(context),
          },
        }
      }
      if (slugs[1] === 'vidburdir') {
        return {
          page: {
            type: PageType.ALL_EVENTS,
            props: await OrganizationEventList.getProps?.(context),
          },
        }
      }
      if (slugs[1] === 'utgefid-efni') {
        return {
          page: {
            type: PageType.PUBLISHED_MATERIAL,
            props: await PublishedMaterial.getProps?.(context),
          },
        }
      }
    }

    // Subpage
    const props = await SubPage.getProps?.(context)
    return {
      page: {
        type: PageType.SUBPAGE,
        props,
      },
    }
  }

  if (slugs.length === 3) {
    if (locale !== 'is') {
      if (slugs[1] === 'news') {
        return {
          page: {
            type: PageType.NEWS_DETAILS,
            props: await OrganizationNewsArticle.getProps?.(context),
          },
        }
      }
      if (slugs[1] === 'events') {
        return {
          page: {
            type: PageType.EVENT_DETAILS,
            props: await OrganizationEventArticle.getProps?.(context),
          },
        }
      }
    } else {
      if (slugs[1] === 'frett') {
        return {
          page: {
            type: PageType.NEWS_DETAILS,
            props: await OrganizationNewsArticle.getProps?.(context),
          },
        }
      }
      if (slugs[1] === 'vidburdir') {
        return {
          page: {
            type: PageType.EVENT_DETAILS,
            props: await OrganizationEventArticle.getProps?.(context),
          },
        }
      }
    }

    return {
      page: {
        type: PageType.GENERIC_LIST_ITEM,
        props: await OrganizationSubPageGenericListItem.getProps?.(context),
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
