/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
// import cn from 'classnames'
import Link from 'next/link'
import Head from 'next/head'
import { format } from 'date-fns'
import { is } from 'date-fns/locale'
import {
  ContentBlock,
  Box,
  Typography,
  Stack,
  Breadcrumbs,
  Button,
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
import { Content, CustomNextError } from '@island.is/adgerdir/units'
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

  const dateFormatted = format(new Date(article.date), 'd. LLLL, uuuu', {
    locale: is,
  }).toLowerCase()

  const pageIds = article.pages ? article.pages.map((x) => x.id) : []

  return (
    <>
      <Head>
        <title>{article.title} | Viðspyrna fyrir Ísland</title>
      </Head>
      <ArticleLayout>
        <Box marginBottom={2}>
          <Stack space={2}>
            <Breadcrumbs color="blue400">
              <Link as="/" href="/">
                <a>Viðspyrna</a>
              </Link>
              <Link as="/frettir" href="/frettir">
                <a>Fréttir og tilkynningar</a>
              </Link>
            </Breadcrumbs>
            <Typography variant="eyebrow" as="div" color="purple400">
              {dateFormatted}
            </Typography>
            <Typography variant="h1" as="h1">
              {article.title}
            </Typography>
          </Stack>
        </Box>
        {article.content ? <Content document={article.content} /> : null}
        <Box marginTop={[6, 6, 10]} width="full">
          <Link href="/frettir" as="/frettir" passHref>
            <Button width="fixed" variant="ghost" icon="arrowRight">
              Sjá allar fréttir
            </Button>
          </Link>
        </Box>
      </ArticleLayout>
      <ColorSchemeContext.Provider value={{ colorScheme: 'red' }}>
        <Box background="red100">
          <ContentBlock width="large">
            <Articles
              title={
                pageIds.length &&
                n('newsArticleOperations', 'Aðgerðir tengdar frétt')
              }
              tags={tagsItems}
              items={pagesItems}
              namespace={namespace}
              startingIds={pageIds}
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
