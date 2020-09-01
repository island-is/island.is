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
  Option,
} from '@island.is/island-ui/core'
import { Sidebar, getHeadingLinkElements } from '@island.is/adgerdir/components'
import {
  Query,
  QueryGetNamespaceArgs,
  ContentLanguage,
  QueryGetAdgerdirPageArgs,
} from '@island.is/api/schema'
import { GET_ADGERDIR_PAGE_QUERY, GET_NAMESPACE_QUERY } from './queries'
import { ArticleLayout } from './Layouts/Layouts'
import { withApollo } from '../graphql'
import { Screen } from '../types'
import { Content } from '@island.is/island-ui/contentful'
import { useNamespace } from '../hooks'
import { useI18n } from '../i18n'
import { Locale } from '../i18n/I18n'
import useRouteNames from '../i18n/useRouteNames'
import { CustomNextError } from '../units/ErrorBoundary'

interface ArticleProps {
  article: Query['getAdgerdirPage']
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
        sidebar={
          <Sidebar title={n('sidebarHeader')} bullet="left" headingLinks />
        }
      >
        <ContentContainer
          padding="none"
          paddingX={[3, 3, 6, 0]}
          marginBottom={simpleSpacing}
        >
          <Stack space={[3, 3, 4]}>
            <Breadcrumbs>
              <Link href={makePath()}>
                <a>Viðspyrna</a>
              </Link>
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

        <Content document={article.content} />
      </ArticleLayout>
    </>
  )
}

Article.getInitialProps = async ({ apolloClient, query, locale }) => {
  const slug = query.slug as string
  const [
    {
      data: { getAdgerdirPage },
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
      .then((content) => {
        // map data here to reduce data processing in component
        return JSON.parse(content.data.getNamespace.fields)
      }),
  ])

  // we assume 404 if no article is found
  if (!getAdgerdirPage) {
    throw new CustomNextError(404, 'Article not found')
  }

  return {
    article: getAdgerdirPage,
    namespace,
  }
}

export default withApollo(Article)

const ContentContainer: FC<BoxProps> = ({ children, ...props }) => (
  <Box padding={[3, 3, 6, 0]} {...props}>
    <ContentBlock width="small">{children}</ContentBlock>
  </Box>
)

// TODO: Add fields for micro strings to article namespace
