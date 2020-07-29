/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC, useEffect, useState } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import slugify from '@sindresorhus/slugify'
import {
  ContentBlock,
  Box,
  Typography,
  Stack,
  Breadcrumbs,
  Hidden,
  Select,
  BoxProps,
  ResponsiveSpace,
  Tag,
  Option,
} from '@island.is/island-ui/core'
import { Sidebar, getHeadingLinkElements } from '@island.is/web/components'
import {
  Query,
  QueryGetArticleArgs,
  QueryGetNamespaceArgs,
  ContentLanguage,
} from '@island.is/api/schema'
import { GET_ARTICLE_QUERY, GET_NAMESPACE_QUERY } from './queries'
import { ArticleLayout } from './Layouts/Layouts'
import { withApollo } from '../graphql'
import { Screen } from '../types'
import ArticleContent from '../units/Content/ArticleContent'
import { useNamespace } from '../hooks'
import { useI18n } from '../i18n'
import { Locale } from '../i18n/I18n'
import useRouteNames from '../i18n/useRouteNames'
import { CustomNextError } from '../units/ErrorBoundary'

interface ArticleProps {
  article: Query['getArticle']
  namespace: Query['getNamespace']
}

const simpleSpacing = [2, 2, 3] as ResponsiveSpace

const Article: Screen<ArticleProps> = ({ article, namespace }) => {
  const [contentOverviewOptions, setContentOverviewOptions] = useState([])
  const { activeLocale } = useI18n()
  // TODO: get language strings from namespace...
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const n = useNamespace(namespace)
  const { makePath } = useRouteNames(activeLocale as Locale)

  useEffect(() => {
    setContentOverviewOptions(
      getHeadingLinkElements().map((link) => ({
        label: link.textContent,
        value: slugify(link.textContent),
      })) || [],
    )
  }, [])

  const { slug: categorySlug, title: categoryTitle } = article.category
  const groupTitle = article.group?.title

  const onChangeContentOverview = ({ value }: Option) => {
    const slug = value as string

    const el = document.querySelector(
      `[data-sidebar-link="${slug}"]`,
    ) as HTMLElement

    if (el) {
      window.scrollTo(0, el.offsetTop)
    }
  }

  return (
    <>
      <Head>
        <title>{article.title} | Ísland.is</title>
      </Head>
      <ArticleLayout
        sidebar={<Sidebar title="Efnisyfirlit" bullet="left" headingLinks />}
      >
        <ContentContainer
          padding="none"
          paddingX={[3, 3, 6, 0]}
          marginBottom={simpleSpacing}
        >
          <Stack space={[3, 3, 4]}>
            <Breadcrumbs>
              <Link href={makePath()}>
                <a>Ísland.is</a>
              </Link>
              <Link
                href={`${makePath('category')}/[slug]`}
                as={makePath('category', categorySlug)}
              >
                <a>{categoryTitle}</a>
              </Link>
              {groupTitle && (
                <Tag variant="purple" label>
                  {groupTitle}
                </Tag>
              )}
            </Breadcrumbs>
            <Hidden above="md">
              <Select
                label="Efnisyfirlit"
                placeholder="Flokkar"
                options={contentOverviewOptions}
                onChange={onChangeContentOverview}
                name="content-overview"
              />
            </Hidden>
            <Box marginBottom={simpleSpacing}>
              <Typography variant="h1" as="h1">
                <span data-sidebar-link={slugify(article.title)}>
                  {article.title}
                </span>
              </Typography>
            </Box>
          </Stack>
        </ContentContainer>

        <ArticleContent
          document={article.content}
          locale={activeLocale as Locale}
        />
      </ArticleLayout>
    </>
  )
}

Article.getInitialProps = async ({ apolloClient, query, locale }) => {
  const slug = query.slug as string
  const [
    {
      data: { getArticle: article },
    },
    namespace,
  ] = await Promise.all([
    apolloClient.query<Query, QueryGetArticleArgs>({
      query: GET_ARTICLE_QUERY,
      variables: {
        input: {
          slug,
          lang: locale as ContentLanguage,
        },
      },
    }),
    apolloClient
      .query<Query, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: {
            namespace: 'Articles',
            lang: locale,
          },
        },
      })
      .then((variables) => {
        // map data here to reduce data processing in component
        return JSON.parse(variables.data.getNamespace.fields)
      }),
  ]).catch(({ graphQLErrors }) => {
    /* 
    Normalize the apollo error for handling in error boundary
    We assume the url is wrong if we find a NOT_FOUND code in apollo response so we pass a 404 error
    */
    const has404Error = Boolean(
      graphQLErrors.find(
        (graphQLError) => graphQLError.extensions.code === 'NOT_FOUND',
      ),
    )
    if (has404Error) {
      throw new CustomNextError(404, 'Article not found')
    } else {
      throw new CustomNextError(500)
    }
  })

  return {
    article,
    namespace,
  }
}

export default withApollo(Article)

const ContentContainer: FC<BoxProps> = ({ children, ...props }) => (
  <Box padding={[3, 3, 6, 0]} {...props}>
    <ContentBlock width="small">{children}</ContentBlock>
  </Box>
)
