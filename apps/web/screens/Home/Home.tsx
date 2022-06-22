import React, { useContext } from 'react'
import { Box, GridContainer } from '@island.is/island-ui/core'
import { useI18n } from '@island.is/web/i18n'
import { Screen } from '@island.is/web/types'
import { useNamespace } from '@island.is/web/hooks'
import {
  ContentLanguage,
  QueryGetArticleCategoriesArgs,
  GetArticleCategoriesQuery,
  GetFrontpageQuery,
  QueryGetFrontpageArgs,
  GetNewsQuery,
} from '@island.is/web/graphql/schema'
import {
  GET_CATEGORIES_QUERY,
  GET_FRONTPAGE_QUERY,
  GET_NEWS_QUERY,
} from '@island.is/web/screens/queries'
import {
  SearchSection,
  CategoryItems,
  NewLinks,
  NewsItems,
  LifeEventsSection,
  WatsonChatPanel,
} from '@island.is/web/components'
import { withMainLayout } from '@island.is/web/layouts/main'
import { GlobalContext } from '@island.is/web/context'
import { QueryGetNewsArgs } from '@island.is/api/schema'
import { FRONTPAGE_NEWS_TAG_ID } from '@island.is/web/constants'
import { watsonConfig } from './config'

interface HomeProps {
  categories: GetArticleCategoriesQuery['getArticleCategories']
  news: GetNewsQuery['getNews']['items']
  page: GetFrontpageQuery['getFrontpage']
}

const Home: Screen<HomeProps> = ({ categories, news, page }) => {
  const namespace = JSON.parse(page.namespace.fields)
  const { activeLocale } = useI18n()
  const { globalNamespace } = useContext(GlobalContext)
  const n = useNamespace(namespace)
  const gn = useNamespace(globalNamespace)

  if (typeof document === 'object') {
    document.documentElement.lang = activeLocale
  }

  return (
    <Box id="main-content" width="full" overflow="hidden">
      <Box
        component="section"
        aria-labelledby="search-section-title"
        borderBottomWidth="standard"
        borderStyle="solid"
        borderColor="blue200"
      >
        <SearchSection
          headingId="search-section-title"
          quickContentLabel={n('quickContentLabel', 'Beint að efninu')}
          placeholder={n('heroSearchPlaceholder')}
          activeLocale={activeLocale}
          page={page}
          browserVideoUnsupported={n(
            'browserVideoUnsupported',
            'Vafrinn þinn getur ekki spilað HTML myndbönd.',
          )}
        />
      </Box>
      <Box
        component="section"
        paddingTop={6}
        paddingBottom={3}
        position="relative"
        background="white"
        aria-labelledby="life-events-title"
      >
        <LifeEventsSection
          heading={n('lifeEventsTitle')}
          headingId="life-events-title"
          items={page?.lifeEvents ?? []}
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
          heading={n('articlesTitle')}
          headingId="categories-title"
          items={categories}
        />
      </Box>
      <Box
        component="section"
        paddingTop={[8, 8, 6]}
        aria-labelledby="news-items-title"
      >
        <NewsItems
          heading={gn('newsAndAnnouncements')}
          headingTitle="news-items-title"
          seeMoreText={gn('seeMore')}
          items={news}
        />
      </Box>
      <Box
        component="section"
        paddingTop={[4, 4, 6]}
        aria-label={n('newsTickerHeading')}
      >
        <GridContainer>
          <NewLinks
            heading={n('newsTickerHeading')}
            seeMoreText={n('newsTickerSeeMore')}
            items={(page.linkList?.links ?? [])
              .filter((x) => x.date)
              .map(({ date, text, url }) => {
                return {
                  text,
                  date: new Date(date),
                  href: url,
                }
              })}
          />
        </GridContainer>
      </Box>
      <WatsonChatPanel {...watsonConfig} />
    </Box>
  )
}

Home.getInitialProps = async ({ apolloClient, locale }) => {
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
          tag: FRONTPAGE_NEWS_TAG_ID,
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
  ])

  return {
    news,
    categories: getArticleCategories,
    page: getFrontpage,
    showSearchInHeader: false,
  }
}

export default withMainLayout(Home, {
  showSearchInHeader: false,
  showFooterIllustration: true,
})
