/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useRef, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import NextLink from 'next/link'
import {
  ContentBlock,
  Box,
  Stack,
  Inline,
  Text,
} from '@island.is/island-ui/core'
import { richText, Slice as SliceType } from '@island.is/island-ui/contentful'
import {
  Query,
  QueryGetNamespaceArgs,
  ContentLanguage,
  QueryGetAdgerdirPageArgs,
  QueryGetAdgerdirPagesArgs,
  QueryGetAdgerdirTagsArgs,
} from '@island.is/api/schema'
import { withMainLayout } from '@island.is/web/layouts/main'
import { HeadWithSocialSharing } from '@island.is/web/components'
import AdgerdirArticles from './components/AdgerdirArticles/AdgerdirArticles'
import { Tag } from './components/UI/Tag/Tag'
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
import { LinkType, useLinkResolver } from '../../hooks/useLinkResolver'

import * as covidStyles from './components/UI/styles/styles.css'

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
  const portalRef = useRef()
  const [mounted, setMounted] = useState(false)
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  const n = useNamespace(namespace)
  const { activeLocale } = useI18n()
  const { linkResolver } = useLinkResolver()

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore make web strict
    portalRef.current = document.querySelector('#__next')
    setMounted(true)
  }, [])

  const { items: pagesItems } = pages
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  const { items: tagsItems } = tags

  const processEntry = article?.processEntry

  return (
    <>
      <HeadWithSocialSharing
        title={`${article?.title} | Viðspyrna fyrir Ísland`}
        description={article?.description}
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
                  {article?.tags.map(({ title }, index) => {
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
                  legacyBehavior
                >
                  {link}
                </NextLink>
              )
            }}
          />
        </Box>

        <Stack space={2}>
          <Text variant="h1" as="h1">
            {article?.title}
          </Text>
          {processEntry?.processLink && (
            <Box marginTop={3} display={['none', 'none', 'block']} printHidden>
              {/** 
               // eslint-disable-next-line @typescript-eslint/ban-ts-comment
               // @ts-ignore */}
              <ProcessEntry {...processEntry} />
            </Box>
          )}
        </Stack>
        {richText(
          (article?.content ?? []) as SliceType[],
          undefined,
          activeLocale,
        )}
        <Box>
          {processEntry?.processLink &&
            mounted &&
            createPortal(
              <Box
                marginTop={5}
                display={['block', 'block', 'none']}
                printHidden
              >
                {/**
                 // eslint-disable-next-line @typescript-eslint/ban-ts-comment 
                 // @ts-ignore make web strict */}
                <ProcessEntry fixed {...processEntry} />
              </Box>,
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore make web strict
              portalRef.current,
            )}
        </Box>
      </SidebarLayout>
      <ColorSchemeContext.Provider value={{ colorScheme: 'green' }}>
        <Box className={covidStyles.bg}>
          <ContentBlock width="large">
            <AdgerdirArticles
              tags={tagsItems}
              items={pagesItems}
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore make web strict
              namespace={namespace}
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore make web strict
              currentArticle={article}
              showAll
            />
          </ContentBlock>
        </Box>
      </ColorSchemeContext.Provider>
    </>
  )
}

AdgerdirArticle.getProps = async ({ apolloClient, query, locale }) => {
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
      .then((content) => {
        if (content.data.getNamespace) {
          return JSON.parse(content.data.getNamespace.fields)
        }
      }),
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
