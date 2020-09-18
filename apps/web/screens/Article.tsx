import React, { FC, useState, useMemo, ReactNode } from 'react'
import { useFirstMountState } from 'react-use'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { BLOCKS } from '@contentful/rich-text-types'
import slugify from '@sindresorhus/slugify'
import {
  Box,
  Typography,
  Stack,
  Breadcrumbs,
  Hidden,
  GridColumn,
  GridRow,
  Tag,
  Button,
  Divider,
  Link,
} from '@island.is/island-ui/core'
import {
  DrawerMenu,
  SidebarBox,
  Bullet,
  SidebarSubNav,
  RichText,
} from '@island.is/web/components'
import { withMainLayout } from '@island.is/web/layouts/main'
import { GET_ARTICLE_QUERY, GET_NAMESPACE_QUERY } from './queries'
import { ArticleLayout } from './Layouts/Layouts'
import { Screen } from '../types'
import { useNamespace } from '../hooks'
import { useI18n } from '../i18n'
import routeNames from '../i18n/routeNames'
import { CustomNextError } from '../units/errors'
import {
  QueryGetNamespaceArgs,
  GetNamespaceQuery,
  QueryGetArticleArgs,
  GetArticleQuery,
  ProcessEntry,
  Article,
  SubArticle,
  Slice,
} from '../graphql/schema'
import { createNavigation } from '../utils/navigation'
import useScrollSpy from '../hooks/useScrollSpy'

const maybeBold = (content: ReactNode, condition: boolean): ReactNode =>
  condition ? <b>{content}</b> : content

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
    return createNavigation(article.body).map(({ id, text }) => ({
      title: text,
      url: '#' + id,
    }))
  }

  let nav = []
  nav.push({ url: slugify(article.title), title: article.title })

  for (const subArticle of article.subArticles) {
    nav.push({
      title: subArticle.title,
      url: makePath('article', '[slug]'),
      as: makePath('article', `${article.slug}/${subArticle.slug}`),
    })

    // expand sub-article navigation for selected sub-article
    // TODO: we need to style these differently in the mobile drawer
    if (subArticle === selectedSubArticle) {
      nav = nav.concat(
        createSubArticleNavigation(subArticle.body).map(({ id, text }) => ({
          title: text,
          url: '#' + id,
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
        <Typography variant="h4" as="h2">
          {title}
        </Typography>
        <Divider weight="alternate" />
        {articles.map((article) => (
          <Typography key={article.slug} variant="p" as="span">
            <Link
              key={article.slug}
              href={makePath('article', '[slug]')}
              as={makePath('article', article.slug)}
              withUnderline
            >
              {article.title}
            </Link>
          </Typography>
        ))}
      </Stack>
    </SidebarBox>
  )
}

const ActionButton: FC<{ content: Slice[]; defaultText: string }> = ({
  content,
  defaultText,
}) => {
  const processEntries = content.filter((slice): slice is ProcessEntry => {
    return slice.__typename === 'ProcessEntry' && Boolean(slice.processLink)
  })

  // we'll only show the button if there is exactly one process entry on the page
  if (processEntries.length !== 1) return null

  const { buttonText, processLink } = processEntries[0]

  return (
    <SidebarBox>
      <Button href={processLink} width="fluid">
        {buttonText || defaultText}
      </Button>
    </SidebarBox>
  )
}

const SubArticleNavigation: FC<{
  title: string
  article: Article
  selectedSubArticle: SubArticle
}> = ({ title, article, selectedSubArticle }) => {
  const { activeLocale } = useI18n()
  const { makePath } = routeNames(activeLocale)
  const [bullet, setBullet] = useState<HTMLDivElement>(null)
  const isFirstMount = useFirstMountState()
  const navigation = useMemo(() => {
    return createSubArticleNavigation(selectedSubArticle?.body ?? [])
  }, [selectedSubArticle])

  const ids = useMemo(() => navigation.map((x) => x.id), [navigation])
  const [activeId, navigate] = useScrollSpy(ids)

  return (
    <SidebarBox position="relative">
      {/*
        first render sets the bullet ref, which means we don't know on first render
        where to show the bullet. When navigating between sub-articles there
        is also one render call with bullet=null, but in that case we don't
        want to remove the bullet element because we'd lose the movement animation
      */}
      {!isFirstMount && <Bullet align="left" top={bullet?.offsetTop ?? 0} />}

      <Stack space={[1, 1, 2]}>
        <Typography variant="h4" as="h4">
          {title}
        </Typography>
        <Divider weight="alternate" />
        <div ref={!selectedSubArticle ? setBullet : null}>
          <Typography variant="p" as="p">
            <Link
              shallow
              href={makePath('article', '[slug]')}
              as={makePath('article', article.slug)}
            >
              {maybeBold(article.title, !selectedSubArticle)}
            </Link>
          </Typography>
        </div>
        {article.subArticles.map((subArticle) => (
          <>
            <div
              ref={
                subArticle === selectedSubArticle && navigation.length === 0
                  ? setBullet
                  : null
              }
            >
              <Typography variant="p" as="span">
                <Link
                  shallow
                  href={makePath('article', '[slug]/[subSlug]')}
                  as={makePath('article', `${article.slug}/${subArticle.slug}`)}
                >
                  {maybeBold(
                    subArticle.title,
                    subArticle === selectedSubArticle,
                  )}
                </Link>
              </Typography>
            </div>
            {subArticle === selectedSubArticle && navigation.length > 0 && (
              <SidebarSubNav>
                <Stack space={1}>
                  {navigation.map(({ id, text }) => (
                    <div ref={id === activeId ? setBullet : null}>
                      <Box
                        key={id}
                        component="button"
                        type="button"
                        textAlign="left"
                        outline="none"
                        onClick={() => navigate(id)}
                      >
                        <Typography variant="pSmall">
                          {maybeBold(text, id === activeId)}
                        </Typography>
                      </Box>
                    </div>
                  ))}
                </Stack>
              </SidebarSubNav>
            )}
          </>
        ))}
      </Stack>
    </SidebarBox>
  )
}

const ArticleNavigation: FC<{ title: string; article: Article }> = ({
  title,
  article,
}) => {
  const [bullet, setBullet] = useState<HTMLElement>(null)

  const navigation = useMemo(() => {
    return createNavigation(article.body, { title: article.title })
  }, [article])

  const ids = useMemo(() => navigation.map((x) => x.id), [navigation])
  const [activeId, navigate] = useScrollSpy(ids)

  return (
    <SidebarBox position="relative">
      {bullet && <Bullet align="left" top={bullet.offsetTop} />}

      <Stack space={[1, 1, 2]}>
        <Typography variant="h4" as="h2">
          {title}
        </Typography>
        <Divider weight="alternate" />

        {navigation.map(({ id, text }) => (
          <Box
            ref={id === activeId ? setBullet : null}
            key={id}
            component="button"
            type="button"
            textAlign="left"
            outline="none"
            onClick={() => navigate(id)}
          >
            <Typography variant="p">
              {id === activeId ? <b>{text}</b> : text}
            </Typography>
          </Box>
        ))}
      </Stack>
    </SidebarBox>
  )
}

interface ArticleSidebarProps {
  article: Article
  subArticle: SubArticle
  n: (s: string) => string
}

const ArticleSidebar: FC<ArticleSidebarProps> = ({
  article,
  subArticle,
  n,
}) => {
  return (
    <Stack space={3}>
      <ActionButton
        content={article.body}
        defaultText={n('processLinkButtonText')}
      />
      {article.subArticles.length === 0 ? (
        <ArticleNavigation title="Efnisyfirlit" article={article} />
      ) : (
        <SubArticleNavigation
          title="Efnisyfirlit"
          article={article}
          selectedSubArticle={subArticle}
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

  return (
    <>
      <Head>
        <title>{article.title} | Ísland.is</title>
      </Head>
      <ArticleLayout
        sidebar={
          <ArticleSidebar article={article} subArticle={subArticle} n={n} />
        }
      >
        <GridRow>
          <GridColumn
            offset={['0', '0', '1/9']}
            span={['0', '0', '7/9']}
            paddingBottom={2}
          >
            <Breadcrumbs>
              <Link href={makePath()}>Ísland.is</Link>
              <Link
                href={`${makePath('ArticleCategory')}/[slug]`}
                as={makePath('ArticleCategory', article.category.slug)}
              >
                {article.category.title}
              </Link>
              {article.group && (
                <Link
                  as={makePath(
                    'ArticleCategory',
                    article.category.slug +
                      (article.group?.slug ? `#${article.group.slug}` : ''),
                  )}
                  href={makePath('ArticleCategory', '[slug]')}
                >
                  <Tag variant="blue">{article.group.title}</Tag>
                </Link>
              )}
            </Breadcrumbs>
          </GridColumn>
        </GridRow>
        <GridRow>
          <GridColumn span="9/9" paddingBottom={4}>
            <Hidden above="sm">
              <DrawerMenu
                categories={[
                  { title: 'Efnisyfirlit', items: contentOverviewOptions },
                ]}
              />
            </Hidden>
          </GridColumn>
        </GridRow>
        <GridRow>
          <GridColumn offset={['0', '0', '1/9']} span={['9/9', '9/9', '7/9']}>
            <Typography variant="h1" as="h1">
              <span id={slugify(article.title)}>{article.title}</span>
            </Typography>
            {article.intro && (
              <Typography variant="intro" as="p" paddingTop={2}>
                <span id={slugify(article.intro)}>{article.intro}</span>
              </Typography>
            )}
            {subArticle && (
              <Typography variant="h2" as="h2" paddingTop={7}>
                <span id={slugify(subArticle.title)}>{subArticle.title}</span>
              </Typography>
            )}
          </GridColumn>
        </GridRow>
        <Box paddingTop={subArticle ? 0 : 7}>
          <RichText body={(subArticle ?? article).body} />
        </Box>
      </ArticleLayout>
    </>
  )
}

ArticleScreen.getInitialProps = async ({ apolloClient, query, locale }) => {
  const slug = query.slug as string

  const [article, namespace] = await Promise.all([
    apolloClient
      .query<GetArticleQuery, QueryGetArticleArgs>({
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

export default withMainLayout(ArticleScreen)
