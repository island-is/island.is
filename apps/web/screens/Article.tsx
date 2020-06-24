/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import DefaultErrorPage from 'next/error'
import { useRouter } from 'next/router'
import cn from 'classnames'
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
} from '@island.is/island-ui/core'
import { Sidebar } from '@island.is/web/components'
import {
  Query,
  QueryGetArticleArgs,
  QueryGetNamespaceArgs,
  ContentLanguage,
} from '@island.is/api/schema'
import { GET_ARTICLE_QUERY, GET_NAMESPACE_QUERY } from './queries'
import { withApollo } from '../graphql'
import { Screen } from '../types'
import ArticleContent from '../units/Content/ArticleContent'

import * as styles from './Category/Category.treat'

import { selectOptions } from '../json'
import { useNamespace, useSidebarLinks } from '../hooks'
import { useI18n } from '../i18n'
import { Locale } from '../i18n/I18n'
import useRouteNames from '../i18n/useRouteNames'

interface ArticleProps {
  article: Query['getArticle']
  namespace: Query['getNamespace']
}

const simpleSpacing = [2, 2, 3] as ResponsiveSpace

const Article: Screen<ArticleProps> = ({ article, namespace }) => {
  const router = useRouter()
  const { activeLocale } = useI18n()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const n = useNamespace(namespace)
  const { makePath } = useRouteNames(activeLocale as Locale)
  const { links } = useSidebarLinks()

  if (!article) {
    return <DefaultErrorPage statusCode={404} />
  }

  const {slug: categorySlug, title: categoryTitle} = article.category
  const groupTitle = article.group?.title

  const onChangeCategory = () => {
    router.push('/article')
  }

  return (
    <>
      <Head>
        <title>{article.title} | Ísland.is</title>
      </Head>
      <ContentBlock>
        <Box component="article" padding={[0, 0, 0, 6]}>
          <div className={cn(styles.layout, styles.reversed)}>
            <div className={styles.side}>
              <Sidebar title="Efnisyfirlit">
                {links.map((Link, index) => (
                  <Link key={index} />
                ))}
              </Sidebar>
            </div>

            <Box paddingRight={[0, 0, 0, 4]} width="full">
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
                    {groupTitle && <Tag variant="purple">{groupTitle}</Tag>}
                  </Breadcrumbs>
                  <Hidden above="md">
                    <Select
                      label="Efnisyfirlit"
                      placeholder="Flokkar"
                      options={selectOptions}
                      onChange={onChangeCategory}
                      name="search"
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

              <ArticleContent document={article.content} />
            </Box>
          </div>
        </Box>
      </ContentBlock>
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
  ])

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
