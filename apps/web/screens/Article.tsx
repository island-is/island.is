/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC } from 'react'
import Link from 'next/link'
import DefaultErrorPage from 'next/error'
import { useRouter } from 'next/router'
import cn from 'classnames'
import {
  ContentBlock,
  Box,
  Typography,
  Stack,
  Breadcrumbs,
  Hidden,
  Select,
  // Divider,
  Accordion,
  AccordionItem,
  BoxProps,
} from '@island.is/island-ui/core'
import { Sidebar } from '../components'
import {
  Query,
  QueryGetArticleArgs,
  QueryGetNamespaceArgs,
  Language,
} from '@island.is/api/schema'
import { GET_ARTICLE_QUERY, GET_NAMESPACE_QUERY } from './queries'
import { withApollo } from '../graphql'
import { Screen } from '../types'
import Content from '../units/Content/Content'

import * as styles from './Category/Category.treat'

import { categories, selectOptions } from '../json'
import { useNamespace } from '../hooks'
import { useI18n } from '../i18n'

interface ArticleProps {
  article: Query['getArticle']
  namespace: Query['getNamespace']
}

const Article: Screen<ArticleProps> = ({ article, namespace }) => {
  const router = useRouter()
  const { activeLocale } = useI18n()
  const n = useNamespace(namespace)

  if (!article) {
    return <DefaultErrorPage statusCode={404} />
  }

  const onChangeCategory = () => {
    router.push('/article')
  }

  return (
    <ContentBlock>
      <Box padding={[0, 0, 0, 6]}>
        <div className={cn(styles.layout, styles.reversed)}>
          <div className={styles.side}>
            <Sidebar title={n('submenuTitle')}>
              {categories.map((c, index) => (
                <Link key={index} href="#">
                  <a>
                    <Typography variant="p" as="span">
                      {c.title}
                    </Typography>
                  </a>
                </Link>
              ))}
            </Sidebar>
          </div>

          <Box paddingRight={[0, 0, 0, 4]} width="full">
            <ContentContainer>
              <Stack space={[3, 3, 4]}>
                <Breadcrumbs>
                  <Link href="/">
                    <a>Ísland.is</a>
                  </Link>
                  <Link href={`${activeLocale === 'en' ? '/en' : ''}/category`}>
                    <a>Fjölskyldumál</a>
                  </Link>
                </Breadcrumbs>
                <Hidden above="md">
                  <Select
                    label="Þjónustuflokkar"
                    placeholder="Flokkar"
                    options={selectOptions}
                    onChange={onChangeCategory}
                    name="search"
                  />
                </Hidden>
                <Typography variant="h1" as="h1">
                  {article.title}
                </Typography>
              </Stack>
            </ContentContainer>

            <Content document={article.content} />

            <ContentContainer paddingY={[6, 6, 6, 20]}>
              <Stack space={6}>
                <Typography variant="h2" as="h2">
                  Spurt og svarað um nafngjöf
                </Typography>
                <Accordion>
                  <AccordionItem label="Að tilkynna nafngjöf" id="id_1">
                    <Typography variant="p">Að tilkynna nafngjöf</Typography>
                  </AccordionItem>
                  <AccordionItem label="Nafnabreytingar" id="id_2">
                    <Typography variant="p">Nafnabreytingar</Typography>
                  </AccordionItem>
                  <AccordionItem
                    label="Nafnritun og birting í Þjóðskrá"
                    id="id_3"
                  >
                    <Typography variant="p">
                      Nafnritun og birting í Þjóðskrá
                    </Typography>
                  </AccordionItem>
                </Accordion>
              </Stack>
            </ContentContainer>
          </Box>
        </div>
      </Box>
    </ContentBlock>
  )
}

Article.getInitialProps = async ({ apolloClient, query, locale }) => {
  const slug = query.slug as string

  const [
    {
      data: { getArticle: article },
    },
    {
      data: { getNamespace: namespace },
    },
  ] = await Promise.all([
    apolloClient.query<Query, QueryGetArticleArgs>({
      query: GET_ARTICLE_QUERY,
      variables: {
        input: {
          slug,
          lang: locale as Language,
        },
      },
    }),
    apolloClient.query<Query, QueryGetNamespaceArgs>({
      query: GET_NAMESPACE_QUERY,
      variables: {
        input: {
          namespace: 'Articles',
          lang: locale,
        },
      },
    }),
  ])

  console.log('article', article)
  return {
    article,
    namespace,
  }
}

export default withApollo(Article)

const ContentContainer: FC<BoxProps> = ({ children, ...props }) => (
  <Box {...props}>
    <Box padding={[3, 3, 6, 0]}>
      <ContentBlock width="small">{children}</ContentBlock>
    </Box>
  </Box>
)
