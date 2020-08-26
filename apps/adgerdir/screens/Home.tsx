/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import { ContentBlock, Box, Typography, Stack } from '@island.is/island-ui/core'
import { Content } from '@island.is/island-ui/contentful'
import { Categories, Sleeve, GroupedPages, CardsSlider } from '../components'
import { withApollo } from '../graphql'
import { useI18n } from '../i18n'
import {
  Query,
  QueryGetNamespaceArgs,
  ContentLanguage,
  QueryGetAdgerdirPagesArgs,
} from '@island.is/api/schema'
import {
  GET_NAMESPACE_QUERY,
  GET_ADGERDIR_PAGES_QUERY,
  GET_ADGERDIR_FRONTPAGE_QUERY,
} from './queries'
import { Screen } from '../types'
import { useNamespace } from '../hooks'
import { Locale } from '../i18n/I18n'
import { ColorSchemeContext } from '@island.is/adgerdir/context'
import Head from 'next/head'

interface HomeProps {
  frontpage: Query['getAdgerdirFrontpage']
  items: Query['getAdgerdirPages']
  namespace: Query['getNamespace']
}

const Home: Screen<HomeProps> = ({ frontpage, items, namespace }) => {
  const { activeLocale } = useI18n()
  const n = useNamespace(namespace)

  if (typeof document === 'object') {
    document.documentElement.lang = activeLocale
  }

  const { items: cards } = items

  const cardsMany = [
    ...cards,
    ...cards,
    ...cards,
    ...cards,
    ...cards,
    { title: 'blabla', description: 'blöblö' },
  ]
  const cardsFew = [...cards]

  return (
    <>
      <Head>
        <title>Viðspyrna fyrir Ísland</title>
      </Head>
      <Box paddingY={6}>
        <Box paddingX={[3, 3, 6, 0]}>
          <ContentBlock width="small">
            <Stack space={3}>
              <Typography variant="eyebrow" as="h2" color="roseTinted400">
                Viðspyrna
              </Typography>
              <Typography variant="h1" as="h1">
                {frontpage.title}
              </Typography>
              <Typography variant="intro" as="p">
                {frontpage.description}
              </Typography>
            </Stack>
          </ContentBlock>
        </Box>
        <Content document={frontpage.content} />
      </Box>
      <ColorSchemeContext.Provider value={{ colorScheme: 'red' }}>
        <Box marginBottom={10}>
          <Sleeve>
            <Box background="red100">
              <ContentBlock width="large">
                <Categories items={cardsMany} />
              </ContentBlock>
            </Box>
          </Sleeve>
        </Box>
      </ColorSchemeContext.Provider>
      <ColorSchemeContext.Provider value={{ colorScheme: 'purple' }}>
        <Box width="full" overflow="hidden" marginBottom={10}>
          <ContentBlock width="large">
            <Box padding={[3, 3, 6]}>
              <GroupedPages
                topContent={
                  <Stack space={3}>
                    <Typography variant="eyebrow" as="h2" color="roseTinted400">
                      Viðspyrna
                    </Typography>
                    <Typography variant="h2" as="h3">
                      {frontpage.title}
                    </Typography>
                    <Typography variant="p" as="p">
                      {frontpage.description}
                    </Typography>
                  </Stack>
                }
                bottomContent={<CardsSlider />}
              />
            </Box>
          </ContentBlock>
        </Box>
      </ColorSchemeContext.Provider>
      <ColorSchemeContext.Provider value={{ colorScheme: 'red' }}>
        <Box width="full" overflow="hidden" marginBottom={10}>
          <ContentBlock width="large">
            <Box padding={[3, 3, 6]}>
              <GroupedPages
                topContent={
                  <Stack space={3}>
                    <Typography variant="eyebrow" as="h2" color="roseTinted400">
                      Viðspyrna
                    </Typography>
                    <Typography variant="h2" as="h3">
                      {frontpage.title}
                    </Typography>
                    <Typography variant="p" as="p">
                      {frontpage.description}
                    </Typography>
                  </Stack>
                }
                bottomContent={<CardsSlider />}
              />
            </Box>
          </ContentBlock>
        </Box>
      </ColorSchemeContext.Provider>
      <ColorSchemeContext.Provider value={{ colorScheme: 'blue' }}>
        <Box width="full" overflow="hidden" marginBottom={10}>
          <ContentBlock width="large">
            <Box padding={[3, 3, 6]}>
              <GroupedPages
                topContent={
                  <Stack space={3}>
                    <Typography variant="eyebrow" as="h2" color="roseTinted400">
                      Viðspyrna
                    </Typography>
                    <Typography variant="h2" as="h3">
                      {frontpage.title}
                    </Typography>
                    <Typography variant="p" as="p">
                      {frontpage.description}
                    </Typography>
                  </Stack>
                }
                bottomContent={<CardsSlider />}
              />
            </Box>
          </ContentBlock>
        </Box>
      </ColorSchemeContext.Provider>
      <Box style={{ height: '800px' }}></Box>
    </>
  )
}

Home.getInitialProps = async ({ apolloClient, locale }) => {
  const [
    {
      data: { getAdgerdirFrontpage },
    },
    {
      data: { getAdgerdirPages },
    },
    namespace,
  ] = await Promise.all([
    apolloClient.query<Query, QueryGetAdgerdirPagesArgs>({
      query: GET_ADGERDIR_FRONTPAGE_QUERY,
      variables: {
        input: {
          lang: locale as ContentLanguage,
        },
      },
    }),
    apolloClient.query<Query, QueryGetAdgerdirPagesArgs>({
      query: GET_ADGERDIR_PAGES_QUERY,
      variables: {
        input: {
          lang: locale as ContentLanguage,
        },
      },
    }),
    apolloClient
      .query<Query, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: {
            namespace: 'Homepage',
            lang: locale,
          },
        },
      })
      .then((variables) => {
        // map data here to reduce data processing in component
        const namespaceObject = JSON.parse(variables.data.getNamespace.fields)

        // featuredArticles is a csv in contentful seperated by : where the first value is the title and the second is the url
        return {
          ...namespaceObject,
          featuredArticles: namespaceObject['featuredArticles'].map(
            (featuredArticle) => {
              const [title = '', url = ''] = featuredArticle.split(':')
              return { title, url }
            },
          ),
        }
      }),
  ])

  return {
    frontpage: getAdgerdirFrontpage,
    items: getAdgerdirPages,
    namespace,
    showSearchInHeader: false,
  }
}

export default withApollo(Home)
