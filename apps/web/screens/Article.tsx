/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC } from 'react'
import Link from 'next/link'
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
} from '@island.is/api/schema'
import { GET_ARTICLE_QUERY, GET_NAMESPACE_QUERY } from './queries'
import { withApollo } from '../graphql'
import { Screen } from '../types'
import Content from '../units/Content/Content'

import * as styles from './Category/Category.treat'

import { categories, selectOptions } from '../json'

interface ArticleProps {
  article: Query['getArticle']
  namespace: Query['getNamespace']
}

const articleScreen = (articleId: string) => {
  const Article: Screen<ArticleProps> = ({ article, namespace }) => {
    const router = useRouter()

    const onChangeCategory = () => {
      router.push('/article')
    }

    const ns = JSON.parse(namespace.fields)
    const submenuTitle = ns?.fields?.submenuTitle ?? 'Flokkar'

    return (
      <ContentBlock>
        <Box padding={[0, 0, 0, 6]}>
          <div className={cn(styles.layout, styles.reversed)}>
            <div className={styles.side}>
              <Sidebar title={submenuTitle}>
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
                    <Link href="/category">
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

  Article.getInitialProps = async ({ apolloClient }) => {
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
            id: articleId,
          },
        },
      }),
      apolloClient.query<Query, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: {
            namespace: 'Articles',
          },
        },
      }),
    ])

    return {
      article,
      namespace,
    }
  }

  return withApollo(Article)
}

const ContentContainer: FC<BoxProps> = ({ children, ...props }) => (
  <Box {...props}>
    <Box padding={[3, 3, 6, 0]}>
      <ContentBlock width="small">{children}</ContentBlock>
    </Box>
  </Box>
)

export default articleScreen
