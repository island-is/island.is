/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import NextLink from 'next/link'
import {
  ContentBlock,
  Box,
  Stack,
  Link,
  Inline,
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
  HeadWithSocialSharing,
  RichText,
  ChatPanel,
} from '@island.is/web/components'
import Intro from './components/Intro/Intro'
import AdgerdirArticles from './components/AdgerdirArticles/AdgerdirArticles'
import { Tag } from './components/UI/Tag/Tag'
import { Button } from './components/UI/Button/Button'
import { ProcessEntry } from './components/UI/ProcessEntry/ProcessEntry'
import { Breadcrumbs } from './components/UI/Breadcrumbs/Breadcrumbs'
import { ColorSchemeContext } from './components/UI/ColorSchemeContext/ColorSchemeContext'
import {
  GET_ADGERDIR_PAGE_QUERY,
  GET_NAMESPACE_QUERY,
  GET_ADGERDIR_PAGES_QUERY,
  GET_ADGERDIR_TAGS_QUERY,
} from '../queries'
import { SidebarLayout } from '@island.is/web/screens/Layouts/SidebarLayout'
import { Screen } from '@island.is/web/types'
import { useI18n } from '@island.is/web/i18n'
import { CustomNextError } from '@island.is/web/units/errors'
import { useNamespace } from '@island.is/web/hooks'
import * as covidStyles from './components/UI/styles/styles.treat'
import { LinkType, useLinkResolver } from '../../hooks/useLinkResolver'

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
  const { linkResolver } = useLinkResolver()

  const { items: pagesItems } = pages
  const { items: tagsItems } = tags

  const description = article.longDescription || article.description

  const processEntry = article.processEntry

  const renderButton =
    article.link && article.link.trim().length > 0 ? (
      <Link href={article.link}>
        <Button iconType="outline" icon="open" fluid>
          {article.linkButtonText ?? n('seeMoreDetails')}
        </Button>
      </Link>
    ) : article.linkButtonText && article.linkButtonText.trim().length > 0 ? (
      <Button iconType="outline" icon="open" disabled fluid>
        {article.linkButtonText ?? n('seeMoreDetails')}
      </Button>
    ) : null

  return (
    <>
      <HeadWithSocialSharing
        title={`${article.title} | Viðspyrna fyrir Ísland`}
        description={article.description}
      />
      <SidebarLayout
        sidebarContent={
          <Box marginBottom={10}>
            <Stack space={3}>
              <Stack space={1}>
                <Text variant="eyebrow">
                  <span className={covidStyles.text}>
                    {n('malefni', 'Málefni')}:
                  </span>
                </Text>
                <Inline space={2} alignY="center">
                  {article.tags.map(({ title }, index) => {
                    return (
                      <Tag key={index} variant="green" label>
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
        <Box paddingBottom={[2, 2, 4]}>
          <Breadcrumbs
            tagVariant="green"
            items={[
              {
                title: 'Ísland.is',
                typename: 'homepage',
                href: '/',
              },
              {
                title: n('covidAdgerdir', 'Covid aðgerðir'),
                typename: 'adgerdirfrontpage',
                href: '/covid-adgerdir',
              },
              { title: n('adgerdir', 'Aðgerðir'), isTag: true },
            ]}
            renderLink={(link, { typename, slug }) => {
              return (
                <NextLink
                  {...linkResolver(typename as LinkType, slug)}
                  passHref
                >
                  {link}
                </NextLink>
              )
            }}
          />
        </Box>

        <Stack space={2}>
          <Text variant="h1" as="h1">
            {article.title}
          </Text>
          {!!processEntry && (
            <Box marginTop={3} display={['none', 'none', 'block']} printHidden>
              <ProcessEntry {...processEntry} />
            </Box>
          )}
          {description ? <Intro>{description}</Intro> : null}
        </Stack>
        <RichText
          body={article.content as SliceType[]}
          config={{ defaultPadding: [2, 2, 4], skipGrid: true }}
          locale={activeLocale}
        />
        <GridRow>
          <GridColumn
            paddingTop={4}
            span={['12/12', '6/12', '6/12', '5/12', '4/12']}
          >
            {renderButton}
          </GridColumn>
        </GridRow>
      </SidebarLayout>
      <ColorSchemeContext.Provider value={{ colorScheme: 'green' }}>
        <Box className={covidStyles.bg}>
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
      <ChatPanel />
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
