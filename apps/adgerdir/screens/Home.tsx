/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'

import {
  Box,
  GridContainer,
  GridRow,
  GridColumn,
  ContentBlock,
  Typography,
  Stack,
} from '@island.is/island-ui/core'
import { Content } from '@island.is/island-ui/contentful'
import {
  Articles,
  Sleeve,
  GroupedPages,
  CardsSlider,
  FeaturedNews,
} from '@island.is/adgerdir/components'
import { withApollo } from '../graphql'
import { useI18n } from '../i18n'
import {
  Query,
  QueryGetNamespaceArgs,
  ContentLanguage,
  QueryGetAdgerdirPagesArgs,
  QueryGetAdgerdirTagsArgs,
} from '@island.is/api/schema'
import {
  GET_ADGERDIR_TAGS_QUERY,
  GET_NAMESPACE_QUERY,
  GET_ADGERDIR_PAGES_QUERY,
  GET_ADGERDIR_FRONTPAGE_QUERY,
} from './queries'
import { Screen } from '../types'
// import { useNamespace } from '../hooks'
// import { Locale } from '../i18n/I18n'
import { ColorSchemeContext } from '@island.is/adgerdir/context'
import Head from 'next/head'

interface HomeProps {
  frontpage: Query['getAdgerdirFrontpage']
  pages: Query['getAdgerdirPages']
  tags: Query['getAdgerdirTags']
  namespace: Query['getNamespace']
}

const Home: Screen<HomeProps> = ({ frontpage, pages, tags, namespace }) => {
  const { activeLocale } = useI18n()
  // const n = useNamespace(namespace)

  if (typeof document === 'object') {
    document.documentElement.lang = activeLocale
  }

  // console.log('frontpage', frontpage)
  const { items: pagesItems } = pages
  const { items: tagsItems } = tags

  return (
    <>
      <Head>
        <title>Viðspyrna fyrir Ísland</title>
      </Head>
      <Box paddingY={10} paddingX={[1, 2]}>
        <GridContainer>
          <GridRow>
            <GridColumn span={[12, 12, 12, 12, 7]} offset={[0, 0, 0, 0, 1]}>
              <ContentBlock width="small">
                <Stack space={3}>
                  <Typography variant="eyebrow" as="h2" color="purple400">
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
              <Content document={frontpage.content} />
            </GridColumn>
          </GridRow>
        </GridContainer>
      </Box>
      <ColorSchemeContext.Provider value={{ colorScheme: 'red' }}>
        <Box marginBottom={10}>
          <Sleeve>
            <Box background="red100">
              <ContentBlock width="large">
                <Articles tags={tagsItems} items={pagesItems} />
              </ContentBlock>
            </Box>
          </Sleeve>
        </Box>
      </ColorSchemeContext.Provider>
      {frontpage.slices.map((slice, index) => {
        switch (slice.__typename) {
          case 'AdgerdirFeaturedNewsSlice':
            return <FeaturedNews key={index} items={slice.featured} />
          case 'AdgerdirGroupSlice':
            return (
              <ColorSchemeContext.Provider
                key={index}
                value={{ colorScheme: 'purple' }}
              >
                <Box width="full" overflow="hidden" marginBottom={10}>
                  <ContentBlock width="large">
                    <Box padding={[0, 3, 6]}>
                      <GroupedPages
                        topContent={
                          <Stack space={3}>
                            <Typography
                              variant="eyebrow"
                              as="h2"
                              color="roseTinted400"
                            >
                              {slice.subtitle}
                            </Typography>
                            <Typography variant="h2" as="h3">
                              {slice.title}
                            </Typography>
                            <Typography variant="p" as="p">
                              {slice.description}
                            </Typography>
                          </Stack>
                        }
                        bottomContent={
                          <CardsSlider items={slice.pages} key="purple" />
                        }
                      />
                    </Box>
                  </ContentBlock>
                </Box>
              </ColorSchemeContext.Provider>
            )
        }

        return null
      })}
    </>
  )
}

Home.getInitialProps = async ({ apolloClient, locale }) => {
  const [
    {
      data: { getAdgerdirFrontpage },
    },
    {
      data: { getAdgerdirTags },
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
    apolloClient.query<Query, QueryGetAdgerdirTagsArgs>({
      query: GET_ADGERDIR_TAGS_QUERY,
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
    tags: getAdgerdirTags,
    pages: getAdgerdirPages,
    namespace,
    showSearchInHeader: false,
  }
}

export default withApollo(Home)
