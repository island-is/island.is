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
  Button,
} from '@island.is/island-ui/core'
import { Content } from '@island.is/island-ui/contentful'
import { Sidebar, getHeadingLinkElements } from '@island.is/web/components'
import {
  Query,
  QueryGetNamespaceArgs,
  ContentLanguage,
  QuerySingleItemArgs,
} from '@island.is/api/schema'
import { GET_ARTICLE_QUERY, GET_NAMESPACE_QUERY } from './queries'
import { ArticleLayout } from './Layouts/Layouts'
import { Screen } from '../types'
import { useNamespace } from '../hooks'
import { useI18n } from '../i18n'
import { Locale } from '../i18n/I18n'
import useRouteNames from '../i18n/useRouteNames'
import { CustomNextError } from '../units/ErrorBoundary'

interface ArticleProps {
  article: Query['singleItem']
  namespace: Query['getNamespace']
}

const simpleSpacing = [2, 2, 3] as ResponsiveSpace

const Article: Screen<ArticleProps> = ({ article, namespace }) => {
  const [contentOverviewOptions, setContentOverviewOptions] = useState([])
  const { activeLocale } = useI18n()
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

  const { categorySlug, category: categoryTitle } = article
  const groupTitle = article.group

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

  const actionButtonLinks = data.content.map((current) => {
    return current.data?.target?.fields?.processLink
  })

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
          </Stack>
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

        <Content document={article.content} />
      </ArticleLayout>
    </>
  )
}

Article.getInitialProps = async ({ apolloClient, query, locale }) => {
  const slug = query.slug as string
  const [article, namespace] = await Promise.all([
    apolloClient
      .query<Query, QuerySingleItemArgs>({
        query: GET_ARTICLE_QUERY,
        variables: {
          input: {
            slug,
            language: locale as ContentLanguage,
          },
        },
      })
      .then((content) => {
        // map data here to reduce data processing in component
        // TODO: Elastic endpoint is returning the article document json nested inside ContentItem, look into flattening this
        const contentObject = JSON.parse(content.data.singleItem.content)
        return {
          ...content.data.singleItem,
          content: JSON.stringify(contentObject.content),
        }
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
  if (!article) {
    throw new CustomNextError(404, 'Article not found')
  }

  return {
    article,
    namespace,
  }
}

export default Article

const ContentContainer: FC<BoxProps> = ({ children, ...props }) => (
  <Box padding={[3, 3, 6, 0]} {...props}>
    <ContentBlock width="small">{children}</ContentBlock>
  </Box>
)

// TODO: Add fields for micro strings to article namespace
