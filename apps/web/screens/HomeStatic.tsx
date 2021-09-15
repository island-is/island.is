import React, { useContext } from 'react'
import { Box, Stack, Inline, Tag, Link } from '@island.is/island-ui/core'
import { Screen } from '@island.is/web/types'
import { Locale } from '@island.is/shared/types'
import { useNamespace } from '@island.is/web/hooks'
import fs from 'fs'
import util from 'util'
import {
  GetArticleCategoriesQuery,
  GetFrontpageQuery,
  GetNewsQuery,
  FrontpageSlider as FrontpageSliderType,
} from '@island.is/web/graphql/schema'
import {
  IntroductionSection,
  LifeEventsCardsSection,
  Section,
  Categories,
  SearchInput,
  FrontpageSlider,
  LatestNewsSectionSlider,
} from '@island.is/web/components'
import { GlobalContext } from '@island.is/web/context'
import { LinkType, useLinkResolver } from '../hooks/useLinkResolver'
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  GetStaticPaths,
  GetStaticPathsContext,
  GetStaticPathsResult,
  GetStaticProps,
  GetStaticPropsContext,
  GetStaticPropsResult,
  InferGetStaticPropsType,
} from 'next'
import initApollo from '../graphql/client'
import I18n from '../i18n/I18n'
import { ApolloProvider } from '@apollo/client'
import { getHomeData, getMainLayoutData } from '../data'
import { Layout, LayoutProps } from '../layouts/main'

interface HomeProps {
  categories: GetArticleCategoriesQuery['getArticleCategories']
  news: GetNewsQuery['getNews']['items']
  page: GetFrontpageQuery['getFrontpage']
  layoutProps: LayoutProps
  locale: Locale
}

export const HomeStatic: Screen<HomeProps> = ({
  categories,
  news,
  page,
  layoutProps,
  locale = 'is',
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const namespace = JSON.parse(page.namespace.fields)
  // const { activeLocale, t } = useI18n()
  const { globalNamespace } = useContext(GlobalContext)
  const n = useNamespace(namespace)
  const gn = useNamespace(globalNamespace)
  const { linkResolver } = useLinkResolver()

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
            activeLocale={'is'}
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
    <ApolloProvider client={initApollo({}, locale)}>
      <I18n locale={'is'} translations={{ FOO: 'bar' }}>
        <Layout {...layoutProps}>
          <div id="main-content" style={{ overflow: 'hidden' }}>
            <Section aria-label={'carousel-title'}>
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
            <Section
              paddingY={[8, 8, 8, 10, 15]}
              aria-labelledby="ourGoalsTitle"
            >
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
        </Layout>
      </I18n>
    </ApolloProvider>
  )
}

export const getStaticPaths: GetStaticPaths = async (
  context: GetStaticPathsContext,
): Promise<GetStaticPathsResult> => {
  return {
    paths: [
      {
        params: {
          foo: 'bar',
        },
        locale: 'is',
      },
    ],
    fallback: 'blocking',
  }
}

// export const getServerSideProps: GetServerSideProps = async (
//   context: GetServerSidePropsContext,
// ): Promise<GetServerSidePropsResult<HomeProps>> => {
//   const { locale } = context
//   const [homeData, layoutData] = await Promise.all([
//     getHomeData(locale as Locale),
//     getMainLayoutData(locale as Locale),
//   ])

//   return {
//     props: {
//       ...homeData,
//       layoutProps: layoutData,
//       locale: locale as Locale,
//     },
//   }
// }

export const getStaticProps: GetStaticProps = async (
  context: GetStaticPropsContext,
): Promise<GetStaticPropsResult<HomeProps>> => {
  // const { locale } = context
  // const [homeData, layoutData] = await Promise.all([
  //   getHomeData(locale as Locale),
  //   getMainLayoutData(locale as Locale),
  // ])

  // const data = {
  //   ...homeData,
  //   layoutProps: layoutData,
  //   locale: locale as Locale,
  // }

  // const writeFile = util.promisify(fs.writeFile)

  // const jsonContent = JSON.stringify(data)
  // console.log('jsonContent:', jsonContent)

  // const fn = async () => {
  //   await writeFile('homestatic.json', jsonContent)
  // }

  // fn()

  const readFile = util.promisify(fs.readFile)

  const json = await readFile(process.cwd() + '/homestatic.json', 'utf8')

  return {
    props: JSON.parse(json),
    // props: data,
    revalidate: 300,
  }
}

export default HomeStatic
