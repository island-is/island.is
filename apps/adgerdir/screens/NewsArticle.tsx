/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
// import cn from 'classnames'
import Link from 'next/link'
import Head from 'next/head'
import {
  ContentBlock,
  Box,
  Typography,
  Stack,
  Breadcrumbs,
} from '@island.is/island-ui/core'
import {
  Query,
  QueryGetAdgerdirNewsArgs,
  QueryGetNamespaceArgs,
  ContentLanguage,
  QueryGetAdgerdirPagesArgs,
  QueryGetAdgerdirTagsArgs,
} from '@island.is/api/schema'
import { Articles } from '@island.is/adgerdir/components'
import {
  GET_NEWS_QUERY,
  GET_NAMESPACE_QUERY,
  GET_ADGERDIR_PAGES_QUERY,
  GET_ADGERDIR_TAGS_QUERY,
} from './queries'
import { ArticleLayout } from '@island.is/adgerdir/screens/Layouts/Layouts'
import { withApollo } from '@island.is/adgerdir/graphql'
import { Screen } from '@island.is/adgerdir/types'
import { Content } from '@island.is/adgerdir/units/Content'
import { CustomNextError } from '@island.is/adgerdir/units/ErrorBoundary'
import { ColorSchemeContext } from '@island.is/adgerdir/context'
import { useNamespace } from '@island.is/adgerdir/hooks'

// import * as cardStyles from '@island.is/adgerdir/components/Card/Card.treat'

interface NewsArticleProps {
  article: Query['getAdgerdirNews']
  pages: Query['getAdgerdirPages']
  tags: Query['getAdgerdirTags']
  namespace: Query['getNamespace']
}

const NewsArticle: Screen<NewsArticleProps> = ({
  article,
  pages,
  tags,
  namespace,
}) => {
  const n = useNamespace(namespace)

  const { items: pagesItems } = pages
  const { items: tagsItems } = tags

  /* const statusNames = {
    preparing: 'Í undirbúningi',
    ongoing: 'Í framkvæmd',
    completed: 'Lokið',
  } */

  return (
    <>
      <Head>
        <title>{article.title} | Viðspyrna fyrir Ísland</title>
      </Head>
      <ArticleLayout>
        <Stack space={3}>
          <Breadcrumbs color="blue400">
            <Link as="/" href="/">
              <a>Viðspyrna</a>
            </Link>
            <span>Aðgerð</span>
          </Breadcrumbs>
          <Typography variant="h1" as="h1">
            {article.title}
          </Typography>
          {article.content ? <Content document={article.content} /> : null}
        </Stack>
      </ArticleLayout>
      <ColorSchemeContext.Provider value={{ colorScheme: 'red' }}>
        <Box background="red100">
          <ContentBlock width="large">
            <Articles
              tags={tagsItems}
              items={pagesItems}
              namespace={namespace}
              showAll
            />
          </ContentBlock>
        </Box>
      </ColorSchemeContext.Provider>
    </>
  )
}

NewsArticle.getInitialProps = async ({ apolloClient, query, locale }) => {
  const slug = query.slug as string
  const [
    {
      data: { getAdgerdirNews },
    },
    {
      data: { getAdgerdirPages },
    },
    {
      data: { getAdgerdirTags },
    },
    namespace,
  ] = await Promise.all([
    apolloClient.query<Query, QueryGetAdgerdirNewsArgs>({
      query: GET_NEWS_QUERY,
      variables: {
        input: {
          slug,
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
    apolloClient.query<Query, QueryGetAdgerdirTagsArgs>({
      query: GET_ADGERDIR_TAGS_QUERY,
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
      .then((content) => JSON.parse(content.data.getNamespace.fields)),
  ])

  // we assume 404 if no article is found
  if (!getAdgerdirNews) {
    throw new CustomNextError(404, 'Þessi frétt fannst ekki!')
  }

  return {
    article: getAdgerdirNews,
    pages: getAdgerdirPages,
    tags: getAdgerdirTags,
    namespace,
  }
}

export default withApollo(NewsArticle)
