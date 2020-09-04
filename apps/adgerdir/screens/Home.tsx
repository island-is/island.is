/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import Head from 'next/head'
import {
  Box,
  ContentBlock,
  Typography,
  Stack,
  Breadcrumbs,
} from '@island.is/island-ui/core'
import { Content } from '@island.is/adgerdir/units'
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
import { ArticleLayout } from './Layouts/Layouts'
import { ColorSchemeContext } from '@island.is/adgerdir/context'

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

  const { items: pagesItems } = pages
  const { items: tagsItems } = tags

  let groupSliceCount = 0

  return (
    <>
      <Head>
        <title>Viðspyrna fyrir Ísland</title>
      </Head>
      <ArticleLayout sidebar={null}>
        <Stack space={2}>
          <Breadcrumbs color="blue400">
            <span>Viðspyrna</span>
          </Breadcrumbs>
          <Typography variant="h1" as="h1">
            {frontpage.title}
          </Typography>
          <Typography variant="intro" as="p">
            {frontpage.description}
          </Typography>
          <Content document={frontpage.content} />
        </Stack>
      </ArticleLayout>
      <ColorSchemeContext.Provider value={{ colorScheme: 'red' }}>
        <Box marginBottom={10}>
          <Sleeve minHeight={400}>
            <Box background="red100">
              <ContentBlock width="large">
                <Articles
                  tags={tagsItems}
                  items={pagesItems}
                  namespace={namespace}
                />
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
            groupSliceCount++

            return (
              <ColorSchemeContext.Provider
                key={index}
                value={{
                  colorScheme: groupSliceCount % 2 ? 'blue' : 'purple',
                }}
              >
                <Box width="full" overflow="hidden" marginBottom={10}>
                  <ContentBlock width="large">
                    <Box padding={[0, 3, 6]}>
                      <GroupedPages
                        topContent={
                          <Stack space={2}>
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
                        bottomContent={<CardsSlider items={slice.pages} />}
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
            namespace: 'Vidspyrna',
            lang: locale,
          },
        },
      })
      .then((variables) => JSON.parse(variables.data.getNamespace.fields)),
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
