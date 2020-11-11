/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import {
  ContentBlock,
  Box,
  Stack,
  Breadcrumbs,
  Button,
  Link,
  Inline,
  Tag,
  GridRow,
  Text,
  GridColumn,
} from '@island.is/island-ui/core'
import { Slice as SliceType } from '@island.is/island-ui/contentful'
import {
  Query,
  QueryGetNamespaceArgs,
  ContentLanguage,
  QueryGetAdgerdirPageArgs,
  QueryGetAdgerdirPagesArgs,
  QueryGetAdgerdirTagsArgs,
} from '@island.is/api/schema'
import { withMainLayout } from '@island.is/web/layouts/main'
import {
  AdgerdirArticles,
  HeadWithSocialSharing,
  RichText,
} from '@island.is/web/components'
import {
  GET_ADGERDIR_PAGE_QUERY,
  GET_NAMESPACE_QUERY,
  GET_ADGERDIR_PAGES_QUERY,
  GET_ADGERDIR_TAGS_QUERY,
} from '../queries'
import { ArticleLayout } from '@island.is/web/screens/Layouts/Layouts'
import { Screen } from '@island.is/web/types'
import { Intro } from '@island.is/web/units/Adgerdir'
import { useI18n } from '@island.is/web/i18n'
import routeNames from '@island.is/web/i18n/routeNames'
import { CustomNextError } from '@island.is/web/units/errors'
import { ColorSchemeContext } from '@island.is/web/context'
import { useNamespace } from '@island.is/web/hooks'

interface AdgerdirArticleProps {
  article: Query['getAdgerdirPage']
  pages: Query['getAdgerdirPages']
  tags: Query['getAdgerdirTags']
  namespace: Query['getNamespace']
}

const AdgerdirArticle: Screen<AdgerdirArticleProps> = ({
  article,
  pages,
  tags,
  namespace,
}) => {
  const n = useNamespace(namespace)
  const { activeLocale } = useI18n()
  const { makePath } = routeNames(activeLocale)

  const { items: pagesItems } = pages
  const { items: tagsItems } = tags

  const description = article.longDescription || article.description

  return (
    <>
      <HeadWithSocialSharing
        title={`${article.title} | Viðspyrna fyrir Ísland`}
        description={article.description}
      />
      <ArticleLayout
        sidebar={
          <Box marginBottom={10}>
            <Stack space={3}>
              {article.link ? (
                <Link href={article.link}>
                  <Button iconType="outline" icon="open" fluid>
                    {article.linkButtonText ?? n('seeMoreDetails')}
                  </Button>
                </Link>
              ) : null}
              <Stack space={1}>
                <Text variant="tag" color="red600">
                  {n('malefni', 'Málefni')}:
                </Text>
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
        <GridRow>
          <GridColumn
            offset={['0', '0', '0', '0', '1/9']}
            span={['9/9', '9/9', '9/9', '9/9', '7/9']}
            paddingBottom={[2, 2, 4]}
          >
            <Breadcrumbs color="blue400">
              <Link href={makePath()} as={makePath()}>
                <a>Ísland.is</a>
              </Link>
              <Link href={makePath('adgerdir')} as={makePath('adgerdir')}>
                <a>{n('covidAdgerdir', 'Covid aðgerðir')}</a>
              </Link>
              <Tag>{n('adgerdir', 'Aðgerðir')}</Tag>
            </Breadcrumbs>
          </GridColumn>
        </GridRow>
        <GridRow>
          <GridColumn
            offset={['0', '0', '0', '0', '1/9']}
            span={['9/9', '9/9', '9/9', '9/9', '7/9']}
          >
            <Stack space={2}>
              <Text variant="h1" as="h1">
                {article.title}
              </Text>
              {description ? <Intro>{description}</Intro> : null}
            </Stack>
            <RichText
              body={article.content as SliceType[]}
              config={{ defaultPadding: [2, 2, 4], skipGrid: true }}
              locale={activeLocale}
            />
          </GridColumn>
        </GridRow>
      </ArticleLayout>
      <ColorSchemeContext.Provider value={{ colorScheme: 'red' }}>
        <Box background="red100">
          <ContentBlock width="large">
            <AdgerdirArticles
              tags={tagsItems}
              items={pagesItems}
              namespace={namespace}
              currentArticle={article}
              showAll
            />
          </ContentBlock>
        </Box>
      </ColorSchemeContext.Provider>
    </>
  )
}

AdgerdirArticle.getInitialProps = async ({ apolloClient, query, locale }) => {
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
  if (!getAdgerdirPage) {
    throw new CustomNextError(404, 'Þessi síða fannst ekki!')
  }

  return {
    article: getAdgerdirPage,
    pages: getAdgerdirPages,
    tags: getAdgerdirTags,
    namespace,
  }
}

export default withMainLayout(AdgerdirArticle)
