/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext } from 'react'
import { Box, Stack, Inline, Tag } from '@island.is/island-ui/core'
import { useI18n } from '@island.is/web/i18n'
import { Screen } from '@island.is/web/types'
import { useNamespace } from '@island.is/web/hooks'
import Link from 'next/link'
import {
  QueryGetFrontpageSliderListArgs,
  ContentLanguage,
  GetFrontpageSliderListQuery,
  QueryGetArticleCategoriesArgs,
  GetArticleCategoriesQuery,
  QueryGetNamespaceArgs,
  GetNamespaceQuery,
  GetLifeEventsQuery,
  GetHomepageQuery,
  QueryGetLifeEventsArgs,
  QueryGetHomepageArgs,
  GetNewsQuery,
} from '@island.is/web/graphql/schema'
import {
  GET_NAMESPACE_QUERY,
  GET_CATEGORIES_QUERY,
  GET_FRONTPAGE_SLIDES_QUERY,
  GET_LIFE_EVENTS_QUERY,
  GET_HOMEPAGE_QUERY,
  GET_NEWS_QUERY,
} from './queries'
import {
  IntroductionSection,
  LifeEventsCardsSection,
  Section,
  Categories,
  SearchInput,
  FrontpageTabs,
  LatestNewsSection,
} from '@island.is/web/components'
import { withMainLayout } from '@island.is/web/layouts/main'
import { GlobalContext } from '@island.is/web/context'
import { QueryGetNewsArgs } from '@island.is/api/schema'
import { LinkType, useLinkResolver } from '../hooks/useLinkResolver'

interface HomeProps {
  categories: GetArticleCategoriesQuery['getArticleCategories']
  frontpageSlides: GetFrontpageSliderListQuery['getFrontpageSliderList']['items']
  namespace: GetNamespaceQuery['getNamespace']
  news: GetNewsQuery['getNews']['items']
  lifeEvents: GetLifeEventsQuery['getLifeEvents']
  page: GetHomepageQuery['getHomepage']
}

const Home: Screen<HomeProps> = ({
  categories,
  frontpageSlides,
  namespace,
  news,
  lifeEvents,
  page,
}) => {
  const { activeLocale, t } = useI18n()
  const { globalNamespace } = useContext(GlobalContext)
  const n = useNamespace(namespace)
  const gn = useNamespace(globalNamespace)
  const { linkResolver } = useLinkResolver()

  if (!lifeEvents || !lifeEvents.length) {
    return null
  }

  if (typeof document === 'object') {
    document.documentElement.lang = activeLocale
  }

  const cards = categories.map(({ __typename, title, slug, description }) => {
    const cardUrl = linkResolver(__typename as LinkType, [slug])
    return {
      title,
      description,
      href: cardUrl.href,
      as: cardUrl.as,
    }
  })

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
            placeholder={n('heroSearchPlaceholder')}
          />
        </Box>
        <Inline space={2}>
          {page.featuredThings.map(({ title, attention, thing }) => {
            const cardUrl = linkResolver(thing.__typename as LinkType, [
              thing.slug,
            ])

            return cardUrl.href && cardUrl.href.length > 0 ? (
              <Link key={title} href={cardUrl.href} as={cardUrl.as}>
                <Tag variant="darkerBlue" attention={attention}>
                  {title}
                </Tag>
              </Link>
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

  const LIFE_EVENTS_THRESHOLD = 6
  const includeLifeEventSectionBleed =
    lifeEvents.length <= LIFE_EVENTS_THRESHOLD
  const showSleeve = lifeEvents.length > LIFE_EVENTS_THRESHOLD

  return (
    <>
      <Section paddingY={[0, 0, 4, 4, 6]} aria-label={t.carouselTitle}>
        <FrontpageTabs tabs={frontpageSlides} searchContent={searchContent} />
      </Section>
      <Section
        aria-labelledby="lifeEventsTitle"
        paddingTop={4}
        backgroundBleed={
          includeLifeEventSectionBleed && {
            bleedAmount: 100,
            mobileBleedAmount: 50,
            bleedDirection: 'bottom',
            fromColor: 'white',
            toColor: 'purple100',
            bleedInMobile: true,
          }
        }
      >
        <LifeEventsCardsSection
          title={n('lifeEventsTitle')}
          titleId="lifeEventsTitle"
          lifeEvents={lifeEvents}
          showSleeve={showSleeve}
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
        <LatestNewsSection
          label={gn('newsAndAnnouncements')}
          labelId="latestNewsTitle"
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
          linkUrl={n('ourGoalsLink')}
        />
      </Section>
    </>
  )
}

Home.getInitialProps = async ({ apolloClient, locale }) => {
  const [
    {
      data: {
        getFrontpageSliderList: { items },
      },
    },
    {
      data: { getArticleCategories },
    },
    {
      data: {
        getNews: { items: news },
      },
    },
    {
      data: { getLifeEvents },
    },
    {
      data: { getHomepage },
    },
    namespace,
  ] = await Promise.all([
    apolloClient.query<
      GetFrontpageSliderListQuery,
      QueryGetFrontpageSliderListArgs
    >({
      query: GET_FRONTPAGE_SLIDES_QUERY,
      variables: {
        input: {
          lang: locale as ContentLanguage,
        },
      },
    }),
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
        },
      },
    }),
    apolloClient.query<GetLifeEventsQuery, QueryGetLifeEventsArgs>({
      query: GET_LIFE_EVENTS_QUERY,
      variables: {
        input: {
          lang: locale as ContentLanguage,
        },
      },
    }),
    apolloClient.query<GetHomepageQuery, QueryGetHomepageArgs>({
      query: GET_HOMEPAGE_QUERY,
      variables: {
        input: {
          lang: locale as ContentLanguage,
        },
      },
    }),
    apolloClient
      .query<GetNamespaceQuery, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: {
            namespace: 'Homepage',
            lang: locale,
          },
        },
      })
      .then((res) => JSON.parse(res.data.getNamespace.fields)),
  ])

  return {
    news,
    lifeEvents: getLifeEvents,
    frontpageSlides: items,
    categories: getArticleCategories,
    page: getHomepage,
    namespace,
    showSearchInHeader: false,
  }
}

export default withMainLayout(Home, { showSearchInHeader: false })
