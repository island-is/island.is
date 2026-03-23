import React, { useContext, useMemo } from 'react'

import { Box } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { Locale } from '@island.is/shared/types'
import {
  CategoryItems,
  DigitalIcelandLatestNewsSlice,
  LifeEventsSection,
  OrganizationsSection,
  SearchSection,
  WebChat,
} from '@island.is/web/components'
import { FRONTPAGE_NEWS_TAG_SLUG } from '@island.is/web/constants'
import { GlobalContext } from '@island.is/web/context'
import {
  ContentLanguage,
  GetArticleCategoriesQuery,
  GetFrontpageQuery,
  GetNewsQuery,
  GetOrganizationsQuery,
  GetWebChatQuery,
  LifeEventPage,
  QueryGetArticleCategoriesArgs,
  QueryGetFrontpageArgs,
  QueryGetNewsArgs,
  QueryGetOrganizationsArgs,
  QueryGetWebChatArgs,
} from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import { useI18n } from '@island.is/web/i18n'
import { withMainLayout } from '@island.is/web/layouts/main'
import {
  GET_CATEGORIES_QUERY,
  GET_FRONTPAGE_QUERY,
  GET_NEWS_QUERY,
  GET_ORGANIZATIONS_QUERY,
} from '@island.is/web/screens/queries'
import { Screen } from '@island.is/web/types'

import { getOrganizationLink } from '../../utils/organization'
import { GET_WEB_CHAT } from '../queries/WebChat'

const LIFE_EVENTS_INDICATOR = {
  outerColor: theme.color.purple200,
  activeColor: theme.color.purple400,
  inactiveColor: theme.color.white,
}

const CATEGORIES_INDICATOR = {
  outerColor: theme.color.blue200,
  activeColor: theme.color.blue400,
  inactiveColor: theme.color.blue300,
}

const ORGANIZATIONS_INDICATOR = {
  outerColor: theme.color.overlay,
  activeColor: theme.color.blue400,
  inactiveColor: theme.color.blue300,
}

interface HomeProps {
  categories: GetArticleCategoriesQuery['getArticleCategories']
  news: GetNewsQuery['getNews']['items']
  organizations: GetOrganizationsQuery['getOrganizations']['items']
  page?: GetFrontpageQuery['getFrontpage']
  locale: Locale
  webChat: GetWebChatQuery['getWebChat']
}

const Home: Screen<HomeProps> = ({
  categories,
  news,
  organizations,
  page,
  locale,
  webChat,
}) => {
  const namespace = JSON.parse(page?.namespace?.fields || '{}')
  const { activeLocale } = useI18n()
  const { globalNamespace } = useContext(GlobalContext)
  const n = useNamespace(namespace)
  const gn = useNamespace(globalNamespace)

  const organizationItems = useMemo(
    () =>
      organizations
        .filter(
          (org) => org.showsUpOnTheOrganizationsPage && org.hasALandingPage,
        )
        .map((org) => ({
          title: org.title,
          href: getOrganizationLink(
            {
              hasALandingPage: org.hasALandingPage ?? undefined,
              slug: org.slug,
              link: org.link ?? undefined,
            },
            locale,
          ),
          logoUrl: org.logo?.url,
          logoAlt: org.logo?.title,
          tags: org.tag.map((t) => ({ id: t.id, title: t.title })),
        })),
    [organizations, locale],
  )

  if (typeof document === 'object') {
    document.documentElement.lang = activeLocale
  }

  return (
    // overflow: clip prevents scroll container creation unlike overflow: hidden
    <Box id="main-content" width="full" style={{ overflow: 'clip' }}>
      <Box
        component="section"
        aria-labelledby="search-section-title"
        borderBottomWidth="standard"
        borderStyle="solid"
        borderColor="purple100"
      >
        <SearchSection
          headingId="search-section-title"
          quickContentLabel={n('quickContentLabel', 'Beint að efninu')}
          placeholder={n(
            'heroSearchPlaceholder',
            activeLocale === 'is' ? 'Leitaðu á Ísland.is' : 'Search Ísland.is',
          )}
          activeLocale={activeLocale}
          page={page}
          browserVideoUnsupported={n(
            'browserVideoUnsupported',
            activeLocale === 'is'
              ? 'Vafrinn þinn getur ekki spilað HTML myndbönd.'
              : 'Your browser can not play HTML videos',
          )}
        />
      </Box>
      <Box
        component="section"
        paddingTop={6}
        paddingBottom={3}
        position="relative"
        background="purple100"
        aria-labelledby="life-events-title"
      >
        <LifeEventsSection
          heading={n(
            'lifeEventsTitle',
            activeLocale === 'is' ? 'Lífsviðburðir' : 'Life events',
          )}
          headingId="life-events-title"
          items={(page?.lifeEvents as LifeEventPage[]) ?? []}
          seeMoreText={n(
            'seeMoreLifeEvents',
            activeLocale === 'is'
              ? 'Skoða alla lífsviðburði'
              : 'See all life events',
          )}
          cardsButtonTitle={n(
            'LifeEventsCardsButtonTitle',
            activeLocale === 'is' ? 'Skoða lífsviðburð' : 'See life event',
          )}
          whiteCards
          indicator={LIFE_EVENTS_INDICATOR}
        />
      </Box>
      <Box
        component="section"
        paddingTop={[5, 5, 8]}
        paddingBottom={[2, 2, 5]}
        background="blue100"
        aria-labelledby="categories-title"
      >
        <CategoryItems
          heading={n(
            'articlesTitle',
            activeLocale === 'is' ? 'Þjónustuflokkar' : 'Services',
          )}
          headingId="categories-title"
          items={categories}
          viewCategoryText={n(
            'viewCategoryLink',
            activeLocale === 'is' ? 'Skoða þjónustuflokk' : 'View category',
          )}
          seeMoreText={n(
            'seeAllCategories',
            activeLocale === 'is'
              ? 'Skoða alla þjónustuflokka'
              : 'See all categories',
          )}
          seeMoreHref="/flokkur"
          indicator={CATEGORIES_INDICATOR}
        />
      </Box>
      <Box
        component="section"
        paddingTop={[5, 5, 8]}
        paddingBottom={[2, 2, 5]}
        aria-labelledby="organizations-title"
      >
        <OrganizationsSection
          heading={n(
            'organizationsTitle',
            activeLocale === 'is'
              ? 'Stofnanir á Ísland.is'
              : 'Organizations on Ísland.is',
          )}
          headingId="organizations-title"
          items={organizationItems}
          seeMoreText={n(
            'seeAllOrganizations',
            activeLocale === 'is'
              ? 'Skoða allar stofnanir'
              : 'See all organizations',
          )}
          seeMoreHref="/s"
          indicator={ORGANIZATIONS_INDICATOR}
        />
      </Box>
      <Box paddingTop={[8, 8, 6]}>
        <DigitalIcelandLatestNewsSlice
          slice={{
            title: gn(
              'newsAndAnnouncements',
              activeLocale === 'is'
                ? 'Fréttir og tilkynningar'
                : 'News and announcements',
            ),
            news: news,
            readMoreText: gn(
              'seeMore',
              activeLocale === 'is' ? 'Sjá meira' : 'See more',
            ),
          }}
          seeMoreLinkVariant="frontpage"
        />
      </Box>
      <WebChat webChat={webChat} />
    </Box>
  )
}

Home.getProps = async ({ apolloClient, locale }) => {
  const [
    {
      data: { getArticleCategories },
    },
    {
      data: {
        getNews: { items: news },
      },
    },
    {
      data: { getFrontpage },
    },
    {
      data: { getOrganizations },
    },
  ] = await Promise.all([
    apolloClient.query<
      GetArticleCategoriesQuery,
      QueryGetArticleCategoriesArgs
    >({
      query: GET_CATEGORIES_QUERY,
      variables: {
        input: {
          lang: locale as ContentLanguage,
        },
      },
    }),
    apolloClient.query<GetNewsQuery, QueryGetNewsArgs>({
      query: GET_NEWS_QUERY,
      variables: {
        input: {
          size: 3,
          lang: locale as ContentLanguage,
          tags: [FRONTPAGE_NEWS_TAG_SLUG],
        },
      },
    }),
    apolloClient.query<GetFrontpageQuery, QueryGetFrontpageArgs>({
      query: GET_FRONTPAGE_QUERY,
      variables: {
        input: {
          lang: locale as ContentLanguage,
          pageIdentifier: 'frontpage',
        },
      },
    }),
    apolloClient.query<GetOrganizationsQuery, QueryGetOrganizationsArgs>({
      query: GET_ORGANIZATIONS_QUERY,
      variables: {
        input: {
          lang: locale as ContentLanguage,
        },
      },
    }),
  ])

  let webChat = null
  if (getFrontpage?.id) {
    const webChatResponse = await Promise.allSettled([
      apolloClient.query<GetWebChatQuery, QueryGetWebChatArgs>({
        query: GET_WEB_CHAT,
        variables: {
          input: { displayLocationIds: [getFrontpage.id], lang: locale },
        },
      }),
    ])
    webChat =
      webChatResponse?.[0]?.status === 'fulfilled'
        ? webChatResponse[0].value?.data?.getWebChat
        : null
  }

  return {
    news:
      news?.map((item) => ({
        ...item,
        genericTags:
          item?.genericTags?.filter(
            (tag) => tag.slug !== FRONTPAGE_NEWS_TAG_SLUG,
          ) ?? [],
      })) ?? [],
    categories: getArticleCategories,
    organizations: getOrganizations?.items ?? [],
    page: getFrontpage,
    showSearchInHeader: false,
    locale: locale as Locale,
    webChat,
  }
}

export default withMainLayout(Home, {
  showSearchInHeader: false,
  showFooterIllustration: true,
})
