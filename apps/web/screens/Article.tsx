import React, { FC, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import { BLOCKS } from '@contentful/rich-text-types'
import slugify from '@sindresorhus/slugify'
import {
  Slice as SliceType,
  ProcessEntry,
} from '@island.is/island-ui/contentful'
import {
  Box,
  Text,
  Stack,
  Breadcrumbs,
  Hidden,
  GridColumn,
  GridRow,
  Tag,
  Link,
  Navigation,
} from '@island.is/island-ui/core'
import {
  DrawerMenu,
  SidebarBox,
  RichText,
  HeadWithSocialSharing,
} from '@island.is/web/components'
import { withMainLayout } from '@island.is/web/layouts/main'
import { GET_ARTICLE_QUERY, GET_NAMESPACE_QUERY } from './queries'
import { Screen } from '@island.is/web/types'
import { useNamespace } from '@island.is/web/hooks'
import { useI18n } from '@island.is/web/i18n'
import routeNames from '@island.is/web/i18n/routeNames'
import { ContentType, pathNames } from '@island.is/web/i18n/routes'
import { CustomNextError } from '@island.is/web/units/errors'
import {
  QueryGetNamespaceArgs,
  GetNamespaceQuery,
  AllSlicesFragment as Slice,
  AllSlicesProcessEntryFragment as ProcessEntrySchema,
  GetSingleArticleQuery,
  QueryGetSingleArticleArgs,
} from '@island.is/web/graphql/schema'
import { createNavigation } from '@island.is/web/utils/navigation'
import useContentfulId from '@island.is/web/hooks/useContentfulId'
import { SidebarLayout } from './Layouts/SidebarLayout'
import { createPortal } from 'react-dom'

type Article = GetSingleArticleQuery['getSingleArticle']
type SubArticle = GetSingleArticleQuery['getSingleArticle']['subArticles'][0]

const createSubArticleNavigation = (body: Slice[]) => {
  // on sub-article page the main article title is h1, sub-article title is h2
  // and navigation is generated from h3
  const navigation = createNavigation(body, {
    htmlTags: [BLOCKS.HEADING_3],
  })

  // we'll hide sub-article navigation if it's only one item
  return navigation.length > 1 ? navigation : []
}

const createArticleNavigation = (
  article: Article,
  selectedSubArticle: SubArticle,
  makePath: (t: string, p: string) => string,
): Array<{ url: string; title: string }> => {
  if (article.subArticles.length === 0) {
    return createNavigation(article.body, {
      title: article.shortTitle || article.title,
    }).map(({ id, text }) => ({
      title: text,
      url: article.slug + '#' + id,
    }))
  }

  let nav = []

  nav.push({
    title: article.title,
    url: makePath('article', '[slug]'),
    as: makePath('article', article.slug),
  })

  for (const subArticle of article.subArticles) {
    nav.push({
      title: subArticle.title,
      url: makePath('article', '[slug]/[subSlug]'),
      as: makePath('article', `${article.slug}/${subArticle.slug}`),
    })

    // expand sub-article navigation for selected sub-article
    // TODO: we need to style these differently in the mobile drawer
    if (subArticle === selectedSubArticle) {
      nav = nav.concat(
        createSubArticleNavigation(subArticle.body).map(({ id, text }) => ({
          title: text,
          url: article.slug + '#' + id,
        })),
      )
    }
  }

  return nav
}

const RelatedArticles: FC<{
  title: string
  articles: Array<{ slug: string; title: string }>
}> = ({ title, articles }) => {
  const { activeLocale } = useI18n()
  const { makePath } = routeNames(activeLocale)

  if (articles.length === 0) return null

  return (
    <SidebarBox>
      <Stack space={[1, 1, 2]}>
        <Text variant="eyebrow" as="h2">
          {title}
        </Text>
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={makePath('article', '[slug]')}
            as={makePath('article', article.slug)}
            underline="normal"
          >
            <Text key={article.slug} as="span">
              {article.title}
            </Text>
          </Link>
        ))}
      </Stack>
    </SidebarBox>
  )
}

interface ArticleSidebarProps {
  article: Article
  activeSlug?: string | string[]
  n: (s: string) => string
}

const ArticleSidebar: FC<ArticleSidebarProps> = ({
  article,
  activeSlug,
  n,
}) => {
  const { activeLocale } = useI18n()
  return (
    <Stack space={3}>
      {article.subArticles.length > 0 && (
        <Navigation
          baseId="articleNav"
          title={n('sidebarHeader')}
          activeItemTitle="test"
          renderLink={(link, { typename, slug }) => {
            return (
              <NextLink
                {...pathNames(activeLocale, typename as ContentType, slug)}
                passHref
              >
                {link}
              </NextLink>
            )
          }}
          items={[
            {
              title: article.shortTitle ?? article.title,
              typename: article.__typename,
              slug: [article.slug],
              active: !activeSlug,
            },
            ...article.subArticles.map((item) => ({
              title: item.title,
              typename: item.__typename,
              slug: [article.slug, item.slug],
              active: activeSlug === item.slug,
            })),
          ]}
        />
      )}
      <RelatedArticles
        title={n('relatedMaterial')}
        articles={article.relatedArticles}
      />
    </Stack>
  )
}

export interface ArticleProps {
  article: Article
  namespace: GetNamespaceQuery['getNamespace']
}

const ArticleScreen: Screen<ArticleProps> = ({ article, namespace }) => {
  const portalRef = useRef()
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    portalRef.current = document.querySelector('#__next')
    setMounted(true)
  }, [])
  useContentfulId(article.id)
  const n = useNamespace(namespace)
  const { query } = useRouter()
  const { activeLocale } = useI18n()
  const { makePath } = routeNames(activeLocale)

  const subArticle = article.subArticles.find((sub) => {
    return sub.slug === query.subSlug
  })

  const contentOverviewOptions = useMemo(() => {
    return createArticleNavigation(article, subArticle, makePath)
  }, [article, subArticle, makePath])

  const relatedLinks = (article.relatedArticles ?? []).map((article) => ({
    title: article.title,
    url: makePath('article', '[slug]'),
    as: makePath('article', article.slug),
  }))

  const combinedMobileNavigation = [
    {
      title: n('categoryOverview', 'Efnisyfirlit'),
      items: contentOverviewOptions,
    },
  ]

  if (relatedLinks.length) {
    combinedMobileNavigation.push({
      title: n('relatedMaterial'),
      items: relatedLinks,
    })
  }

  const metaTitle = `${article.title} | Ísland.is`
  /**
   * Remove Start
   */
  const processEntries = article?.body?.length
    ? article.body.filter((x) => x.__typename === 'ProcessEntry')
    : []

  // tmp fix
  const processEntry =
    processEntries.length === 1
      ? (processEntries[0] as ProcessEntrySchema)
      : null
  /**
   * Remove End
   *
   *
   * const processEntry = article.processEntry
   */

  return (
    <>
      <HeadWithSocialSharing
        title={metaTitle}
        description={article.intro}
        imageUrl={article.featuredImage?.url}
        imageWidth={article.featuredImage?.width.toString()}
        imageHeight={article.featuredImage?.height.toString()}
      />
      <SidebarLayout
        sidebarContent={
          <ArticleSidebar article={article} n={n} activeSlug={query.subSlug} />
        }
      >
        <GridRow>
          <GridColumn
            offset={['0', '0', '0', '0', '1/9']}
            span={['9/9', '9/9', '9/9', '9/9', '7/9']}
            paddingBottom={[2, 2, 4]}
          >
            <Breadcrumbs>
              <Link href={makePath()}>Ísland.is</Link>
              {!!article.category && (
                <Link
                  href={makePath('ArticleCategory', '/[slug]')}
                  as={makePath('ArticleCategory', article.category.slug)}
                >
                  {article.category.title}
                </Link>
              )}
              {!!article.group && (
                <Link
                  as={makePath(
                    'ArticleCategory',
                    article.category.slug +
                      (article.group?.slug ? `#${article.group.slug}` : ''),
                  )}
                  href={makePath('ArticleCategory', '[slug]')}
                  pureChildren
                >
                  <Tag variant="blue">{article.group.title}</Tag>
                </Link>
              )}
            </Breadcrumbs>
          </GridColumn>
        </GridRow>
        {!!contentOverviewOptions.length && (
          <Hidden print={true} above="sm">
            <DrawerMenu categories={combinedMobileNavigation} />
          </Hidden>
        )}
        <GridRow>
          <GridColumn
            offset={['0', '0', '0', '0', '1/9']}
            span={['9/9', '9/9', '9/9', '9/9', '7/9']}
          >
            <Text variant="h1" as="h1">
              <span id={slugify(article.title)}>{article.title}</span>
            </Text>
            <Box marginTop={3} display={['none', 'none', 'block']} printHidden>
              <ProcessEntry {...processEntry} />
            </Box>
            {subArticle && (
              <Text variant="h2" as="h2" paddingTop={7}>
                <span id={slugify(subArticle.title)}>{subArticle.title}</span>
              </Text>
            )}
          </GridColumn>
        </GridRow>
        <Box paddingTop={subArticle ? 2 : 4}>
          <RichText
            body={(subArticle ?? article).body as SliceType[]}
            config={{ defaultPadding: [2, 2, 4] }}
            locale={activeLocale}
          />
          <Box marginTop={5} display={['block', 'block', 'none']} printHidden>
            <ProcessEntry {...processEntry} />
          </Box>
        </Box>
        {!!processEntry &&
          mounted &&
          createPortal(
            <Box marginTop={5} display={['block', 'block', 'none']} printHidden>
              <ProcessEntry fixed {...processEntry} />
            </Box>,
            portalRef.current,
          )}
      </SidebarLayout>
    </>
  )
}

ArticleScreen.getInitialProps = async ({ apolloClient, query, locale }) => {
  const slug = query.slug as string

  const [article, namespace] = await Promise.all([
    apolloClient
      .query<GetSingleArticleQuery, QueryGetSingleArticleArgs>({
        query: GET_ARTICLE_QUERY,
        variables: {
          input: {
            slug,
            lang: locale as string,
          },
        },
      })
      .then((response) => response.data.getSingleArticle),
    apolloClient
      .query<GetNamespaceQuery, QueryGetNamespaceArgs>({
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

  // we assume 404 if no article/sub-article is found
  const subArticle = article?.subArticles.find((a) => a.slug === query.subSlug)
  if (!article || (query.subSlug && !subArticle)) {
    throw new CustomNextError(404, 'Article not found')
  }

  return {
    article,
    namespace,
  }
}

export default withMainLayout(ArticleScreen, { hasDrawerMenu: true })
