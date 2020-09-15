/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import { Box, Stack, Inline, Tag } from '@island.is/island-ui/core'
import { Categories, SearchInput, LatestNewsSection } from '../components'
import { useI18n } from '../i18n'
import { Screen } from '../types'
import { useNamespace } from '../hooks'
import useRouteNames from '../i18n/useRouteNames'
import FrontpageTabs from '../components/FrontpageTabs/FrontpageTabs'
import {
  QueryGetFrontpageSliderListArgs,
  ContentLanguage,
  GetFrontpageSliderListQuery,
  QueryGetArticleCategoriesArgs,
  GetArticleCategoriesQuery,
  QueryGetNamespaceArgs,
  GetNamespaceQuery,
  GetNewsListQuery,
  GetLifeEventsQuery,
  QueryGetNewsListArgs,
  QueryGetLifeEventsArgs,
} from '../graphql/schema'
import {
  GET_NAMESPACE_QUERY,
  GET_CATEGORIES_QUERY,
  GET_FRONTPAGE_SLIDES_QUERY,
  GET_NEWS_LIST_QUERY,
  GET_LIFE_EVENTS_QUERY,
} from './queries'
import { IntroductionSection } from '../components/IntroductionSection'
import { LifeEventsCardsSection } from '../components/LifeEventsCardsSection'
import { Section } from '../components/Section'
import { Sleeve } from '@island.is/island-ui/core'
import { ContentBlock } from '@island.is/island-ui/core'

interface HomeProps {
  categories: GetArticleCategoriesQuery['getArticleCategories']
  frontpageSlides: GetFrontpageSliderListQuery['getFrontpageSliderList']['items']
  namespace: GetNamespaceQuery['getNamespace']
  news: GetNewsListQuery['getNewsList']['news']
  lifeEvents: GetLifeEventsQuery['getLifeEvents']
}

const Home: Screen<HomeProps> = ({
  categories,
  frontpageSlides,
  namespace,
  news,
  lifeEvents,
}) => {
  const { activeLocale } = useI18n()
  const n = useNamespace(namespace)
  const { makePath } = useRouteNames(activeLocale)

  if (typeof document === 'object') {
    document.documentElement.lang = activeLocale
  }

  const cards = categories.map(({ title, slug, description }) => ({
    title,
    description,
    href: `${makePath('ArticleCategory')}/[slug]`,
    as: makePath('ArticleCategory', slug),
  }))

  const searchContent = (
    <Box display="flex" flexDirection="column" width="full">
      <Stack space={[1, 1, 3]}>
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
        <Inline space={1}>
          {n('featuredArticles', []).map(({ title, url }, index) => (
            <Tag href={url} key={url} variant="darkerBlue">
              {title}
            </Tag>
          ))}
        </Inline>
      </Stack>
    </Box>
  )

  return (
    <>
      <Section paddingY={[0, 0, 3, 3, 6]}>
        <FrontpageTabs tabs={frontpageSlides} searchContent={searchContent} />
      </Section>
      <Box marginTop={0}>
        <Sleeve minHeight={400} sleeveShadow="purple">
          <Box>
            <ContentBlock width="large">
              <Section paddingTop={[8, 8, 6]}>
                <LifeEventsCardsSection
                  title={n('lifeEventsTitle')}
                  lifeEvents={lifeEvents}
                />
              </Section>
            </ContentBlock>
          </Box>
        </Sleeve>
      </Box>
      <Box marginTop={0} background="purple100">
        <Section paddingTop={[8, 8, 6]}>
          <Categories title={n('articlesTitle')} cards={cards} />
        </Section>
      </Box>
      <Section paddingTop={[8, 8, 6]}>
        <LatestNewsSection label="Fréttir og tilkynningar" items={news} />
      </Section>
      <Section paddingY={[8, 8, 8, 10, 15]}>
        <IntroductionSection
          subtitle="Markmiðið okkar"
          title="Öll opinber þjónusta á einum stað"
          introText="Við vinnum að margvíslegum verkefnum sem öll stuðla að því að gera opinbera þjónustu skilvirkari og notendavænni."
          text="Við viljum að stafræn þjónusta sé aðgengileg, sniðin að notandanum og með skýra framtíðarsýn."
          linkText="Nánar um Stafrænt Ísland"
          linkUrl="/um-island-is"
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
        getNewsList: { news },
      },
    },
    {
      data: { getLifeEvents },
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
    apolloClient.query<GetNewsListQuery, QueryGetNewsListArgs>({
      query: GET_NEWS_LIST_QUERY,
      variables: {
        input: {
          perPage: 3,
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
      .then((res) => {
        // map data here to reduce data processing in component
        const namespaceObject = JSON.parse(res.data.getNamespace.fields)

        // featuredArticles is a csv in contentful seperated by : where the first value is the title and the second is the url
        return {
          ...namespaceObject,
          featuredArticles: namespaceObject.featuredArticles.map(
            (featuredArticle) => {
              const [title = '', url = ''] = featuredArticle.split(':')
              return { title, url }
            },
          ),
        }
      }),
  ])

  return {
    news,
    lifeEvents: getLifeEvents,
    frontpageSlides: items,
    categories: getArticleCategories,
    namespace,
    showSearchInHeader: false,
  }
}

export default Home
