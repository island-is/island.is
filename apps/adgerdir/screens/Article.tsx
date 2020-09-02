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
  Button,
  Inline,
  Tag,
} from '@island.is/island-ui/core'
import {
  Query,
  QueryGetNamespaceArgs,
  ContentLanguage,
  QueryGetAdgerdirPageArgs,
  QueryGetAdgerdirPagesArgs,
  QueryGetAdgerdirTagsArgs,
} from '@island.is/api/schema'
import { Articles } from '@island.is/adgerdir/components'
import {
  GET_ADGERDIR_PAGE_QUERY,
  GET_NAMESPACE_QUERY,
  GET_ADGERDIR_PAGES_QUERY,
  GET_ADGERDIR_TAGS_QUERY,
} from './queries'
import { ArticleLayout } from '@island.is/adgerdir/screens/Layouts/Layouts'
import { withApollo } from '@island.is/adgerdir/graphql'
import { Screen } from '@island.is/adgerdir/types'
import { Content } from '@island.is/adgerdir/units/Content'
// import { CustomNextError } from '@island.is/adgerdir/units/ErrorBoundary'
import { ColorSchemeContext } from '@island.is/adgerdir/context'
import { useNamespace } from '@island.is/adgerdir/hooks'

// import * as cardStyles from '@island.is/adgerdir/components/Card/Card.treat'

interface ArticleProps {
  article: Query['getAdgerdirPage']
  pages: Query['getAdgerdirPages']
  tags: Query['getAdgerdirTags']
  namespace: Query['getNamespace']
}

const Article: Screen<ArticleProps> = ({ article, pages, tags, namespace }) => {
  const n = useNamespace(namespace)

  const { items: pagesItems } = pages
  const { items: tagsItems } = tags

  /* const statusNames = {
    preparing: 'Í undirbúningi',
    ongoing: 'Í framkvæmd',
    completed: 'Lokið',
  } */

  if (!article) {
    return (
      <>
        <Head>
          <title>404 | Viðspyrna fyrir Ísland</title>
        </Head>
        <ArticleLayout>
          <Stack space={3}>
            <Breadcrumbs color="blue400">
              <Link as="/" href="/">
                <a>404</a>
              </Link>
            </Breadcrumbs>
            <Box>
              <Typography variant="h1" as="h1">
                Síða fannst ekki!
              </Typography>
            </Box>
          </Stack>
        </ArticleLayout>
      </>
    )
  }

  const { estimatedCostIsk, finalCostIsk } = article

  const estimatedCostFormatted =
    estimatedCostIsk && formatNumberToKr(estimatedCostIsk)
  const finalCostFormatted = finalCostIsk && formatNumberToKr(finalCostIsk)

  const description = article.longDescription || article.description

  return (
    <>
      <Head>
        <title>{article.title} | Viðspyrna fyrir Ísland</title>
      </Head>
      <ArticleLayout
        sidebar={
          <Box marginBottom={10}>
            <Stack space={3}>
              {article.link ? (
                <Button icon="external" width="fluid" href={article.link}>
                  {article.linkButtonText ?? n('seeMoreDetails')}
                </Button>
              ) : null}
              {/* <Stack space={1}>
                <Typography variant="tag" color="red600">
                  Staða aðgerðar:
                </Typography>
                <Tag variant="red" label>
                  <Box position="relative">
                    <Inline space={1} alignY="center">
                      <span>{statusNames[article.status]}</span>
                      <span
                        className={cn(
                          cardStyles.status,
                          cardStyles.statusType[article.status],
                        )}
                      ></span>
                    </Inline>
                  </Box>
                </Tag>
              </Stack> */}
              <Stack space={1}>
                <Typography variant="tag" color="red600">
                  Málefni:
                </Typography>
                <Inline space={2} alignY="center">
                  {article.tags.map(({ title }, index) => {
                    return (
                      <Tag key={index} variant="red" label>
                        {title}
                      </Tag>
                    )
                  })}
                </Inline>
              </Stack>
            </Stack>
          </Box>
        }
      >
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
          {description ? (
            <Typography variant="intro" as="p">
              {description}
            </Typography>
          ) : null}
          {article.objective ? (
            <Stack space={1}>
              <Typography variant="h3" as="h3">
                Markmið
              </Typography>
              <Content document={article.objective} />
            </Stack>
          ) : null}
          {estimatedCostFormatted || finalCostFormatted ? (
            <Stack space={1}>
              <Typography variant="h3" as="h3">
                Kostnaður ríkissjóðs
              </Typography>
              {estimatedCostFormatted ? (
                <Typography variant="p">
                  Áætlaður kostnaður: <strong>{estimatedCostFormatted}</strong>
                </Typography>
              ) : null}
              {finalCostFormatted ? (
                <Typography variant="p">
                  Endanlegur kostnaður: <strong>{finalCostFormatted}</strong>
                </Typography>
              ) : null}
            </Stack>
          ) : null}
          <Stack space={1}>
            <Typography variant="h3" as="h3">
              Staða
            </Typography>
            <Typography variant="p">{n(article.status)}</Typography>
          </Stack>
          {article.content ? <Content document={article.content} /> : null}
        </Stack>
      </ArticleLayout>
      <ColorSchemeContext.Provider value={{ colorScheme: 'red' }}>
        <Box background="red100">
          <ContentBlock width="large">
            <Articles
              tags={tagsItems}
              items={pagesItems}
              seeMoreText={n('seeMoreItems')}
              title={n('adgerdir')}
              currentArticle={article}
              showAll
            />
          </ContentBlock>
        </Box>
      </ColorSchemeContext.Provider>
    </>
  )
}

Article.getInitialProps = async ({ apolloClient, query, locale }) => {
  const slug = query.slug as string
  const [
    {
      data: { getAdgerdirPage },
    },
    {
      data: { getAdgerdirPages },
    },
    {
      data: { getAdgerdirTags },
    },
    namespace,
  ] = await Promise.all([
    apolloClient.query<Query, QueryGetAdgerdirPageArgs>({
      query: GET_ADGERDIR_PAGE_QUERY,
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
  /* if (!getAdgerdirPage) {
    throw new CustomNextError(404, 'Article not found')
  } */

  return {
    article: getAdgerdirPage,
    pages: getAdgerdirPages,
    tags: getAdgerdirTags,
    namespace,
  }
}

const formatNumberToKr = (number: number) =>
  number
    .toLocaleString('is-IS', {
      style: 'currency',
      currency: 'ISK',
    })
    .replace('ISK', '')
    .split(',')
    .join('.') + ',- kr.'

export default withApollo(Article)
