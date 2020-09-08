/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import slugify from '@sindresorhus/slugify'
import {
  Box,
  Typography,
  Stack,
  Breadcrumbs,
  Hidden,
  Select,
  ResponsiveSpace,
  GridColumn,
  GridRow,
  Tag,
  Option,
  Button,
  Divider,
  Link,
} from '@island.is/island-ui/core'
import { Content } from '@island.is/island-ui/contentful'
import { Sidebar, getHeadingLinkElements } from '@island.is/web/components'
import {
  Query,
  QueryGetNamespaceArgs,
  QueryGetArticleArgs,
} from '@island.is/api/schema'
import { GET_ARTICLE_QUERY, GET_NAMESPACE_QUERY } from './queries'
import { ArticleLayout } from './Layouts/Layouts'
import { Screen } from '../types'
import { useNamespace } from '../hooks'
import { useI18n } from '../i18n'
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const n = useNamespace(namespace)
  const { makePath } = useRouteNames(activeLocale)

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

  const data = JSON.parse(article.content)

  const actionButtonLinks =
    data?.content
      .map((current) => current.data?.target?.fields?.processLink)
      .filter(Boolean) || []

  const actionButtonLink =
    actionButtonLinks.length === 1 ? actionButtonLinks[0] : null

  return (
    <>
      <Head>
        <title>{article.title} | Ísland.is</title>
      </Head>
      <ArticleLayout
        sidebar={
          <Stack space={3}>
            {actionButtonLink ? (
              <Box background="purple100" padding={4} borderRadius="large">
                <Button href={actionButtonLink} width="fluid">
                  {n('processLinkButtonText')}
                </Button>
              </Box>
            ) : null}
            <Sidebar title={n('sidebarHeader')} bullet="left" headingLinks />
            {article.relatedArticles.length > 0 && (
              <Box background="purple100" padding={4} borderRadius="large">
                <Stack space={[1, 1, 2]}>
                  <Typography variant="h4" as="h4">
                    {n('relatedMaterial')}
                  </Typography>
                  <Divider weight="alternate" />
                  {article.relatedArticles.map((related) => (
                    <Typography variant="p" as="span">
                      <Link
                        key={related.slug}
                        href={makePath('article', '[slug]')}
                        as={makePath('article', related.slug)}
                        withUnderline
                      >
                        {related.title}
                      </Link>
                    </Typography>
                  ))}
                </Stack>
              </Box>
            )}
          </Stack>
        }
      >
        <GridRow>
          <GridColumn
            offset={['0', '0', '1/8']}
            span={['0', '0', '7/8']}
            paddingBottom={2}
          >
            <Breadcrumbs>
              <Link href={makePath()}>
                <a>Ísland.is</a>
              </Link>
              <Link
                href={`${makePath('category')}/[slug]`}
                as={makePath('category', article.category.slug)}
              >
                <a>{article.category.title}</a>
              </Link>
              {article.group && (
                <Tag variant="purple" label>
                  {article.group.title}
                </Tag>
              )}
            </Breadcrumbs>
          </GridColumn>
        </GridRow>
        <GridRow>
          <GridColumn span="8/8" paddingBottom={4}>
            <Hidden above="sm">
              <Select
                label="Efnisyfirlit"
                placeholder="Flokkar"
                options={contentOverviewOptions}
                onChange={onChangeContentOverview}
                name="content-overview"
              />
            </Hidden>
          </GridColumn>
        </GridRow>
        <GridRow>
          <GridColumn offset={['0', '0', '1/8']} span={['8/8', '8/8', '7/8']}>
            <Typography variant="h1" as="h1" paddingBottom={2}>
              <span data-sidebar-link={slugify(article.title)}>
                {article.title}
              </span>
            </Typography>
          </GridColumn>
        </GridRow>
        <Content document={article.content} />
      </ArticleLayout>
    </>
  )
}

Article.getInitialProps = async ({ apolloClient, query, locale }) => {
  const slug = query.slug as string
  const [article, namespace] = await Promise.all([
    apolloClient
      .query<Query, QueryGetArticleArgs>({
        query: GET_ARTICLE_QUERY,
        variables: {
          input: {
            slug,
            lang: locale as string,
          },
        },
      })
      .then((r) => r.data.getArticle),
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
  if (!article) {
    throw new CustomNextError(404, 'Article not found')
  }

  return {
    article,
    namespace,
  }
}

export default Article

// TODO: Add fields for micro strings to article namespace
