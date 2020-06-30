/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import DefaultErrorPage from 'next/error'
import cn from 'classnames'
import {
  ContentBlock,
  Box,
  Typography,
  Stack,
  Breadcrumbs,
  BoxProps,
  ResponsiveSpace,
} from '@island.is/island-ui/core'
import { Sidebar, Sticky } from '@island.is/web/components'
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
import { useNamespace } from '../hooks'
import { useI18n } from '../i18n'
import { Locale } from '../i18n/I18n'
import useRouteNames from '../i18n/useRouteNames'

import * as styles from './Category/Category.treat'

interface NewsItemProps {
  article: Query['getArticle']
  namespace: Query['getNamespace']
}

const simpleSpacing = [2, 2, 3] as ResponsiveSpace

const NewsItem: Screen<NewsItemProps> = ({ article, namespace }) => {
  const { activeLocale } = useI18n()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const n = useNamespace(namespace)
  const { makePath } = useRouteNames(activeLocale as Locale)

  if (!article) {
    return <DefaultErrorPage statusCode={404} />
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
              <Sticky>
                <Box background="purple100" paddingX={4} paddingY={3}>
                  <Stack space={3}>
                    <Stack space={1}>
                      <Typography variant="eyebrow" as="p" color="blue400">
                        Höfundur
                      </Typography>
                      <Typography variant="h5" as="p">
                        Jón Jónsson
                      </Typography>
                    </Stack>
                    <Stack space={1}>
                      <Typography variant="eyebrow" as="p" color="blue400">
                        Birt
                      </Typography>
                      <Typography variant="h5" as="p">
                        12. mai 1891
                      </Typography>
                    </Stack>
                  </Stack>
                </Box>
              </Sticky>
            </div>

            <Box
              paddingRight={[0, 0, 0, 4]}
              marginBottom={simpleSpacing}
              width="full"
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
                    <Link href={makePath('news')}>
                      <a>Fréttir og tilkynningar</a>
                    </Link>
                  </Breadcrumbs>
                  <Box marginBottom={simpleSpacing}>
                    <Typography variant="h1" as="h1">
                      {article.title}
                    </Typography>
                  </Box>
                </Stack>
              </ContentContainer>

              <ArticleContent
                document={article.content}
                locale={activeLocale as Locale}
              />
            </Box>
          </div>
        </Box>
      </ContentBlock>
    </>
  )
}

NewsItem.getInitialProps = async ({ apolloClient, query, locale }) => {
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

export default withApollo(NewsItem)

const ContentContainer: FC<BoxProps> = ({ children, ...props }) => (
  <Box padding={[3, 3, 6, 0]} {...props}>
    <ContentBlock width="small">{children}</ContentBlock>
  </Box>
)
