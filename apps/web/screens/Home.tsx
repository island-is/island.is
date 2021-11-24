/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext } from 'react'
import { Box, Stack, Inline, Tag, Link } from '@island.is/island-ui/core'
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
  FrontpageSlider as FrontpageSliderType,
} from '@island.is/web/graphql/schema'
import {
  GET_CATEGORIES_QUERY,
  GET_FRONTPAGE_QUERY,
  GET_NEWS_QUERY,
} from './queries'
import {
  IntroductionSection,
  LifeEventsCardsSection,
  Section,
  Categories,
  SearchInput,
  FrontpageSlider,
  LatestNewsSectionSlider,
} from '@island.is/web/components'
import { withMainLayout } from '@island.is/web/layouts/main'
import { GlobalContext } from '@island.is/web/context'
import { QueryGetNewsArgs } from '@island.is/api/schema'
import { LinkType, useLinkResolver } from '../hooks/useLinkResolver'
import { FRONTPAGE_NEWS_TAG_ID } from '@island.is/web/constants'

interface HomeProps {
  categories: GetArticleCategoriesQuery['getArticleCategories']
  news: GetNewsQuery['getNews']['items']
  page: GetFrontpageQuery['getFrontpage']
}

const Home: Screen<HomeProps> = ({ categories, news, page }) => {
  const namespace = JSON.parse(page.namespace.fields)
  const { activeLocale, t } = useI18n()
  const { globalNamespace } = useContext(GlobalContext)
  const n = useNamespace(namespace)
  const gn = useNamespace(globalNamespace)
  const { linkResolver } = useLinkResolver()

  if (typeof document === 'object') {
    document.documentElement.lang = activeLocale
  }
  const cards = categories.map(
    ({ __typename: typename, title, slug, description }) => {
      return {
        title,
        description,
        link: linkResolver(typename as LinkType, [slug]),
      }
    },
  )

  const searchContent = (
    <Box display="flex" flexDirection="column" width="full">
      <Stack space={4}>
        <Box display="inlineFlex" alignItems="center" width="full">
          <SearchInput
            id="search_input_home"
            openOnFocus
            size="medium"
            colored={false}
            activeLocale={activeLocale}
            quickContentLabel={n('quickContentLabel', 'Beint að efninu')}
            placeholder={n('heroSearchPlaceholder')}
          />
        </Box>
        <Inline space={2}>
          {page.featured.map(({ title, attention, thing }) => {
            const cardUrl = linkResolver(thing?.type as LinkType, [thing?.slug])
            return cardUrl?.href && cardUrl?.href.length > 0 ? (
              <Tag
                key={title}
                {...(cardUrl.href.startsWith('/')
                  ? {
                      CustomLink: ({ children, ...props }) => (
                        <Link key={title} {...props} {...cardUrl}>
                          {children}
                        </Link>
                      ),
                    }
                  : { href: cardUrl.href })}
                variant="darkerBlue"
                attention={attention}
              >
                {title}
              </Tag>
            ) : (
              <Tag key={title} variant="darkerBlue" attention={attention}>
                {title}
              </Tag>
            )
          })}
        </Inline>
      </Stack>
    </Box>
  )
  return (
    <div id="main-content" style={{ overflow: 'hidden' }}>
      <Section aria-label={t.carouselTitle}>
        <FrontpageSlider
          slides={page.slides as FrontpageSliderType[]}
          searchContent={searchContent}
        />
      </Section>
      <Section
        aria-labelledby="lifeEventsTitle"
        backgroundBleed={{
          bleedAmount: 150,
          bleedDirection: 'bottom',
          fromColor: 'white',
          toColor: 'purple100',
        }}
      >
        <LifeEventsCardsSection
          title={n('lifeEventsTitle')}
          linkTitle={n('seeAllLifeEvents', 'Sjá alla lífsviðburði')}
          lifeEvents={page.lifeEvents}
        />
      </Section>
      <Section
        paddingTop={[8, 8, 6]}
        paddingBottom={[8, 8, 6]}
        background="purple100"
        aria-labelledby="serviceCategoriesTitle"
      >
        <Categories
          title={n('articlesTitle')}
          titleId="serviceCategoriesTitle"
          cards={cards}
        />
      </Section>
      <Section paddingTop={[8, 8, 6]} aria-labelledby="latestNewsTitle">
        <LatestNewsSectionSlider
          label={gn('newsAndAnnouncements')}
          readMoreText={gn('seeMore')}
          items={news}
        />
      </Section>
      <Section paddingY={[8, 8, 8, 10, 15]} aria-labelledby="ourGoalsTitle">
        <IntroductionSection
          subtitle={n('ourGoalsSubTitle')}
          title={n('ourGoalsTitle')}
          titleId="ourGoalsTitle"
          introText={n('ourGoalsIntro')}
          text={n('ourGoalsText')}
          linkText={n('ourGoalsButtonText')}
          linkUrl={{ href: n('ourGoalsLink') }}
        />
      </Section>
    </div>
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

export default withMainLayout(Home, { showSearchInHeader: false })
