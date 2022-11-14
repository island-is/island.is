import { FC, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import { BLOCKS } from '@contentful/rich-text-types'
import slugify from '@sindresorhus/slugify'
import {
  Slice as SliceType,
  ProcessEntry,
  richText,
} from '@island.is/island-ui/contentful'
import {
  Box,
  Text,
  Stack,
  Breadcrumbs,
  GridColumn,
  GridRow,
  Link,
  Navigation,
  TableOfContents,
  Button,
  Tag,
} from '@island.is/island-ui/core'
import {
  HeadWithSocialSharing,
  InstitutionPanel,
  InstitutionsPanel,
  OrganizationFooter,
  Sticky,
  Webreader,
  AppendedArticleComponents,
  footerEnabled,
  Stepper,
  stepperUtils,
  ChartsCard,
  OneColumnTextSlice,
  AccordionSlice,
  TableSlice,
  EmailSignup,
} from '@island.is/web/components'
import { withMainLayout } from '@island.is/web/layouts/main'
import { GET_ARTICLE_QUERY, GET_NAMESPACE_QUERY } from '../queries'
import { Screen } from '@island.is/web/types'
import { useNamespace } from '@island.is/web/hooks'
import { useI18n } from '@island.is/web/i18n'
import { CustomNextError } from '@island.is/web/units/errors'
import {
  QueryGetNamespaceArgs,
  GetNamespaceQuery,
  AllSlicesFragment as Slice,
  GetSingleArticleQuery,
  QueryGetSingleArticleArgs,
  Organization,
} from '@island.is/web/graphql/schema'
import { createNavigation } from '@island.is/web/utils/navigation'
import useContentfulId from '@island.is/web/hooks/useContentfulId'
import { SidebarLayout } from '../Layouts/SidebarLayout'
import { createPortal } from 'react-dom'
import {
  LinkResolverResponse,
  LinkType,
  useLinkResolver,
} from '../../hooks/useLinkResolver'
import { Locale } from '@island.is/shared/types'
import { useScrollPosition } from '../../hooks/useScrollPosition'
import { scrollTo } from '../../hooks/useScrollSpy'

import { ArticleChatPanel } from './components/ArticleChatPanel'

type Article = GetSingleArticleQuery['getSingleArticle']
type SubArticle = GetSingleArticleQuery['getSingleArticle']['subArticles'][0]

const getThemeConfig = (article: Article) => {
  const organizationFooterPresent = article?.organization?.some((o) =>
    footerEnabled.includes(o.slug),
  )
  return {
    themeConfig: {
      footerVersion: organizationFooterPresent ? 'organization' : 'default',
    },
  }
}

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
  linkResolver: (
    linkType: LinkType,
    slugs?: string[],
    locale?: Locale,
  ) => LinkResolverResponse,
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
    url: linkResolver('article', [article.slug]).href,
  })

  for (const subArticle of article.subArticles) {
    nav.push({
      title: subArticle.title,
      url: linkResolver('article', subArticle.slug.split('/')).href,
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

const RelatedContent: FC<{
  title: string
  articles: Array<{ title: string; slug: string }>
  otherContent: Array<{ text: string; url: string }>
}> = ({ title, articles, otherContent }) => {
  const { linkResolver } = useLinkResolver()

  if (articles.length < 1 && otherContent.length < 1) return null

  const relatedLinks = (articles ?? [])
    .map((article) => ({
      title: article.title,
      url: linkResolver('article', [article.slug]).href,
    }))
    .concat(
      (otherContent ?? []).map((article) => ({
        title: article.text,
        url: article.url,
      })),
    )

  return (
    <Box background="purple100" borderRadius="large" padding={[3, 3, 4]}>
      <Stack space={[1, 1, 2]}>
        <Text variant="eyebrow" as="h2">
          {title}
        </Text>
        {relatedLinks.map((link) => (
          <Link key={link.url} href={link.url} underline="normal">
            <Text key={link.url} as="span">
              {link.title}
            </Text>
          </Link>
        ))}
      </Stack>
    </Box>
  )
}

const TOC: FC<{
  body: SubArticle['body']
  title: string
}> = ({ body, title }) => {
  const navigation = useMemo(() => {
    return createSubArticleNavigation(body ?? [])
  }, [body])
  if (navigation.length === 0) {
    return null
  }
  return (
    <Box marginTop={3}>
      <TableOfContents
        tableOfContentsTitle={title}
        headings={navigation.map(({ id, text }) => ({
          headingTitle: text,
          headingId: id,
        }))}
        onClick={(id) => scrollTo(id, { smooth: true })}
      />
    </Box>
  )
}

const ArticleNavigation: FC<
  ArticleSidebarProps & { isMenuDialog?: boolean }
> = ({ article, activeSlug, n, isMenuDialog }) => {
  const { linkResolver } = useLinkResolver()
  return (
    article.subArticles.length > 0 && (
      <Navigation
        baseId="articleNav"
        title={n('sidebarHeader')}
        activeItemTitle={
          !activeSlug
            ? article.shortTitle || article.title
            : article.subArticles.find(
                (sub) => activeSlug === sub.slug.split('/').pop(),
              ).title
        }
        isMenuDialog={isMenuDialog}
        renderLink={(link, { typename, slug }) => {
          return (
            <NextLink {...linkResolver(typename as LinkType, slug)} passHref>
              {link}
            </NextLink>
          )
        }}
        items={[
          {
            title: article.shortTitle || article.title,
            typename: article.__typename,
            slug: [article.slug],
            active: !activeSlug,
          },
          ...article.subArticles.map((item) => ({
            title: item.title,
            typename: item.__typename,
            slug: item.slug.split('/'),
            active: activeSlug === item.slug.split('/').pop(),
          })),
        ]}
      />
    )
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
  const { linkResolver } = useLinkResolver()
  const { activeLocale } = useI18n()

  return (
    <Stack space={3}>
      {!!article.category && (
        <Box display={['none', 'none', 'block']} printHidden>
          <Link
            {...linkResolver('articlecategory', [article.category.slug])}
            skipTab
          >
            <Button
              preTextIcon="arrowBack"
              preTextIconType="filled"
              size="small"
              type="button"
              variant="text"
              truncate
            >
              {article.category.title}
            </Button>
          </Link>
        </Box>
      )}
      {article.organization.length > 0 && (
        <InstitutionPanel
          img={article.organization[0].logo?.url}
          institutionTitle={n('organization')}
          institution={article.organization[0].title}
          locale={activeLocale}
          linkProps={{ href: article.organization[0].link }}
          imgContainerDisplay={['block', 'block', 'none', 'block']}
        />
      )}
      {article.subArticles.length > 0 && (
        <ArticleNavigation article={article} activeSlug={activeSlug} n={n} />
      )}
      <RelatedContent
        title={n('relatedMaterial')}
        articles={article.relatedArticles}
        otherContent={article.relatedContent}
      />
    </Stack>
  )
}

export interface ArticleProps {
  article: Article
  namespace: GetNamespaceQuery['getNamespace']
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stepOptionsFromNamespace: { data: Record<string, any>[]; slug: string }[]
  stepperNamespace: GetNamespaceQuery['getNamespace']
}

const ArticleScreen: Screen<ArticleProps> = ({
  article,
  namespace,
  stepperNamespace,
  stepOptionsFromNamespace,
}) => {
  const { activeLocale } = useI18n()
  const portalRef = useRef()
  const processEntryRef = useRef(null)
  const [mounted, setMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  useEffect(() => {
    portalRef.current = document.querySelector('#__next')
    processEntryRef.current = document.querySelector('#processRef')
    setMounted(true)
  }, [])
  const n = useNamespace(namespace)
  const { query, asPath } = useRouter()
  const { linkResolver } = useLinkResolver()

  const subArticle = article.subArticles.find((sub) => {
    return sub.slug.split('/').pop() === query.subSlug
  })

  useContentfulId(article.id, subArticle?.id)

  useScrollPosition(
    ({ currPos }) => {
      let px = -600

      if (typeof window !== `undefined`) {
        px = window.innerHeight * -1
      }

      const elementPosition =
        processEntryRef && processEntryRef.current
          ? processEntryRef?.current.getBoundingClientRect().bottom +
            (px - currPos.y)
          : 0

      const canShow = elementPosition + currPos.y >= 0
      setIsVisible(canShow)
    },
    [setIsVisible],
    null,
    false,
    150,
  )

  const contentOverviewOptions = useMemo(() => {
    return createArticleNavigation(article, subArticle, linkResolver)
  }, [article, subArticle, linkResolver])

  const relatedLinks = (article.relatedArticles ?? []).map((article) => ({
    title: article.title,
    url: linkResolver('article', [article.slug]).href,
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
  const processEntry = article.processEntry
  const categoryHref = linkResolver('articlecategory', [article.category.slug])
    .href
  const organizationTitle = article.organization[0]?.title
  const organizationShortTitle = article.organization[0]?.shortTitle

  const inStepperView = useMemo(
    () => query.stepper === 'true' && !!article.stepper,
    [query.stepper, article.stepper],
  )

  const breadcrumbItems = useMemo(
    () =>
      inStepperView
        ? []
        : [
            {
              title: 'Ísland.is',
              typename: 'homepage',
              href: '/',
            },
            !!article.category && {
              title: article.category.title,
              typename: 'articlecategory',
              slug: [article.category.slug],
            },
            !!article.group && {
              isTag: true,
              title: article.group.title,
              typename: 'articlecategory',
              slug: [
                article.category.slug +
                  (article.group?.slug ? `#${article.group.slug}` : ''),
              ],
            },
          ],
    [article.category, article.group, inStepperView],
  )

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
        isSticky={false}
        sidebarContent={
          <Sticky>
            <ArticleSidebar
              article={article}
              n={n}
              activeSlug={query.subSlug}
            />
          </Sticky>
        }
      >
        <Box
          paddingBottom={inStepperView ? undefined : [2, 2, 4]}
          display={['none', 'none', 'block']}
          printHidden={!inStepperView}
        >
          {inStepperView && (
            <Text color="blueberry600" variant="eyebrow" as="h2">
              <span id={slugify(article.title)} className="rs_read">
                {article.title}
              </span>
            </Text>
          )}

          {!inStepperView && (
            <Breadcrumbs
              items={breadcrumbItems}
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
          )}
        </Box>
        <Box
          paddingBottom={inStepperView ? undefined : [2, 2, 4]}
          display={['flex', 'flex', 'none']}
          justifyContent="spaceBetween"
          alignItems="center"
          printHidden
        >
          {!!article.category && (
            <Box flexGrow={1} marginRight={6} overflow={'hidden'}>
              <Link href={categoryHref} skipTab>
                <Button
                  preTextIcon="arrowBack"
                  preTextIconType="filled"
                  size="small"
                  type="button"
                  variant="text"
                  truncate
                >
                  {article.category.title}
                </Button>
              </Link>
            </Box>
          )}
          {article.organization.length > 0 && (
            <Box minWidth={0}>
              {article.organization[0].link ? (
                <Link href={article.organization[0].link} skipTab>
                  <Tag variant="purple" truncate>
                    {organizationShortTitle || organizationTitle}
                  </Tag>
                </Link>
              ) : (
                <Tag variant="purple" truncate disabled>
                  {organizationShortTitle || organizationTitle}
                </Tag>
              )}
            </Box>
          )}
        </Box>
        <Box>
          {!inStepperView && (
            <Text variant="h1" as="h1">
              <span id={slugify(article.title)} className="rs_read">
                {article.title}
              </span>
            </Text>
          )}

          {inStepperView && (
            <Stepper
              namespace={stepperNamespace}
              optionsFromNamespace={stepOptionsFromNamespace}
              stepper={article.stepper}
              showWebReader={true}
              webReaderClassName="rs_read"
            />
          )}
          {!inStepperView && <Webreader readId={null} readClass="rs_read" />}
          <Box marginTop={3} display={['block', 'block', 'none']} printHidden>
            <ArticleNavigation
              article={article}
              n={n}
              activeSlug={query.subSlug}
              isMenuDialog
            />
          </Box>
          {processEntry?.processLink && (
            <Box
              marginTop={3}
              display={['none', 'none', 'block']}
              printHidden
              className="rs_read"
            >
              <ProcessEntry {...processEntry} />
            </Box>
          )}
          {(subArticle
            ? subArticle.showTableOfContents
            : article.showTableOfContents) && (
            <GridRow>
              <GridColumn span={[null, '4/7', '5/7', '4/7', '3/7']}>
                <TOC
                  title={n('tableOfContentTitle')}
                  body={subArticle ? subArticle.body : article.body}
                />
              </GridColumn>
            </GridRow>
          )}
          {subArticle && (
            <Text variant="h2" as="h2" paddingTop={7}>
              <span id={slugify(subArticle.title)} className="rs_read">
                {subArticle.title}
              </span>
            </Text>
          )}
        </Box>
        <Box paddingTop={subArticle ? 2 : 4}>
          {!inStepperView && (
            <Box className="rs_read">
              {richText(
                (subArticle ?? article).body as SliceType[],
                {
                  renderComponent: {
                    TableSlice: (slice) => <TableSlice slice={slice} />,
                    Stepper: () => (
                      <Box marginY={3} printHidden className="rs_read">
                        <ProcessEntry
                          buttonText={n(
                            article.processEntryButtonText || 'application',
                            '',
                          )}
                          processLink={asPath
                            .split('?')[0]
                            .concat('?stepper=true')}
                          processTitle={article.stepper.title}
                          newTab={false}
                        />
                      </Box>
                    ),
                    GraphCard: (chart) => <ChartsCard chart={chart} />,
                    OneColumnText: (slice) => (
                      <OneColumnTextSlice slice={slice} />
                    ),
                    AccordionSlice: (slice) => <AccordionSlice slice={slice} />,
                    EmailSignup: (slice) => <EmailSignup slice={slice} />,
                  },
                },
                activeLocale,
              )}
              <AppendedArticleComponents article={article} />
            </Box>
          )}

          <Box
            id="processRef"
            display={['block', 'block', 'none']}
            marginTop={7}
            printHidden
          >
            {processEntry?.processLink && <ProcessEntry {...processEntry} />}
          </Box>
          {article.organization.length > 0 && (
            <Box
              marginTop={[3, 3, 3, 10, 20]}
              marginBottom={[3, 3, 3, 10, 20]}
              printHidden
            >
              <InstitutionsPanel
                img={article.organization[0].logo?.url ?? ''}
                institution={{
                  title: article.organization[0].title,
                  label: n('organization'),
                  href: article.organization[0].link,
                }}
                responsibleParty={article.responsibleParty.map(
                  (responsibleParty) => ({
                    title: responsibleParty.title,
                    label: n('responsibleParty'),
                    href: responsibleParty.link,
                  }),
                )}
                relatedInstitution={article.relatedOrganization.map(
                  (relatedOrganization) => ({
                    title: relatedOrganization.title,
                    label: n('relatedOrganization'),
                    href: relatedOrganization.link,
                  }),
                )}
                locale={activeLocale}
                contactText="Hafa samband"
              />
            </Box>
          )}
          <Box display={['block', 'block', 'none']} printHidden>
            {article.relatedArticles.length > 0 && (
              <RelatedContent
                title={n('relatedMaterial')}
                articles={article.relatedArticles}
                otherContent={article.relatedContent}
              />
            )}
          </Box>
        </Box>
        {processEntry?.processLink &&
          mounted &&
          isVisible &&
          createPortal(
            <Box marginTop={5} display={['block', 'block', 'none']} printHidden>
              <ProcessEntry fixed {...processEntry} />
            </Box>,
            portalRef.current,
          )}
      </SidebarLayout>
      <ArticleChatPanel article={article} pushUp={isVisible} />
      <OrganizationFooter
        organizations={article.organization as Organization[]}
      />
    </>
  )
}

ArticleScreen.getInitialProps = async ({ apolloClient, query, locale }) => {
  const slug = query.slug as string

  const [article, namespace, stepperNamespace] = await Promise.all([
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
    apolloClient
      .query<GetNamespaceQuery, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: {
            namespace: 'Stepper',
            lang: locale,
          },
        },
      })
      .then((content) => {
        // map data here to reduce data processing in component
        return JSON.parse(content?.data?.getNamespace?.fields ?? '{}')
      }),
  ])

  // we assume 404 if no article/sub-article is found
  const subArticle = article?.subArticles.find(
    (a) => a.slug.split('/').pop() === query.subSlug,
  )
  if (!article || (query.subSlug && !subArticle)) {
    throw new CustomNextError(404, 'Article not found')
  }

  // The stepper in the subArticle can have steps that need data from a namespace (UI configuration)
  let stepOptionsFromNamespace = []

  if (article.stepper)
    stepOptionsFromNamespace = await stepperUtils.getStepOptionsFromUIConfiguration(
      article.stepper,
      apolloClient,
    )

  return {
    article,
    namespace,
    stepOptionsFromNamespace,
    stepperNamespace,
    ...getThemeConfig(article),
  }
}

export default withMainLayout(ArticleScreen)
