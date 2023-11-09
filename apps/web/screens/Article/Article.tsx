import { FC, useEffect, useMemo, useRef, useState } from 'react'
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
  Stepper,
  stepperUtils,
  Form,
  SignLanguageButton,
} from '@island.is/web/components'
import { withMainLayout } from '@island.is/web/layouts/main'
import { GET_ARTICLE_QUERY, GET_NAMESPACE_QUERY } from '../queries'
import { Screen } from '@island.is/web/types'
import { useNamespace, usePlausiblePageview } from '@island.is/web/hooks'
import { useI18n } from '@island.is/web/i18n'
import { CustomNextError } from '@island.is/web/units/errors'
import {
  QueryGetNamespaceArgs,
  GetNamespaceQuery,
  AllSlicesFragment as Slice,
  GetSingleArticleQuery,
  QueryGetSingleArticleArgs,
  Organization,
  Stepper as StepperSchema,
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
import { ArticleChatPanel } from './components/ArticleChatPanel'
import { webRichText } from '@island.is/web/utils/richText'
import { Locale } from '@island.is/shared/types'
import { useScrollPosition } from '../../hooks/useScrollPosition'
import { scrollTo } from '../../hooks/useScrollSpy'
import { getOrganizationLink } from '@island.is/web/utils/organization'

type Article = GetSingleArticleQuery['getSingleArticle']
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore make web strict
type SubArticle = GetSingleArticleQuery['getSingleArticle']['subArticles'][0]

const getThemeConfig = (article: Article) => {
  const organizationFooterPresent = article?.organization?.some(
    (o) => o?.footerItems?.length > 0,
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
  if (article?.subArticles.length === 0) {
    return createNavigation(article.body, {
      title: article.shortTitle || article.title,
    }).map(({ id, text }) => ({
      title: text,
      url: article.slug + '#' + id,
    }))
  }

  let nav = []

  nav.push({
    title: article?.title,
    url: linkResolver('article', [article?.slug ?? '']).href,
  })

  for (const subArticle of article?.subArticles ?? []) {
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
          url: article?.slug + '#' + id,
        })),
      )
    }
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  return nav
}

const RelatedContent: FC<
  React.PropsWithChildren<{
    title: string
    articles: Array<{ title: string; slug: string }>
    otherContent: Array<{ text: string; url: string }>
  }>
> = ({ title, articles, otherContent }) => {
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

const TOC: FC<
  React.PropsWithChildren<{
    body: SubArticle['body']
    title: string
  }>
> = ({ body, title }) => {
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
  React.PropsWithChildren<ArticleSidebarProps & { isMenuDialog?: boolean }>
> = ({ article, activeSlug, n, isMenuDialog }) => {
  const { linkResolver } = useLinkResolver()
  return (
    article?.subArticles &&
    article.subArticles.length > 0 && (
      <Navigation
        baseId="articleNav"
        title={n('sidebarHeader')}
        activeItemTitle={
          !activeSlug
            ? article?.shortTitle || article?.title
            : article?.subArticles.find(
                (sub) => activeSlug === sub.slug.split('/').pop(),
              )?.title
        }
        isMenuDialog={isMenuDialog}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore make web strict
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

const ArticleSidebar: FC<React.PropsWithChildren<ArticleSidebarProps>> = ({
  article,
  activeSlug,
  n,
}) => {
  const { linkResolver } = useLinkResolver()
  const { activeLocale } = useI18n()

  return (
    <Stack space={3}>
      {!!article?.category?.slug && (
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
      {article?.organization && article.organization.length > 0 && (
        <InstitutionPanel
          img={article.organization[0].logo?.url}
          institutionTitle={n('organization')}
          institution={article.organization[0].title}
          locale={activeLocale}
          linkProps={{
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore make web strict
            href: getOrganizationLink(article.organization[0], activeLocale),
          }}
          imgContainerDisplay={['block', 'block', 'none', 'block']}
        />
      )}
      {article?.subArticles && article.subArticles.length > 0 && (
        <ArticleNavigation article={article} activeSlug={activeSlug} n={n} />
      )}
      <RelatedContent
        title={n('relatedMaterial')}
        articles={article?.relatedArticles ?? []}
        otherContent={article?.relatedContent ?? []}
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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore make web strict
    portalRef.current = document.querySelector('#__next')
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore make web strict
    processEntryRef.current = document.querySelector('#processRef')
    setMounted(true)
  }, [])
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  const n = useNamespace(namespace)
  const { query, asPath } = useRouter()
  const { linkResolver } = useLinkResolver()

  const subArticle = article?.subArticles.find((sub) => {
    return sub.slug.split('/').pop() === query.subSlug
  })

  useContentfulId(article?.id ?? '', subArticle?.id)

  usePlausiblePageview(article?.organization?.[0]?.trackingDomain ?? undefined)

  useScrollPosition(
    ({ currPos }) => {
      let px = -600

      if (typeof window !== `undefined`) {
        px = window.innerHeight * -1
      }

      const elementPosition =
        processEntryRef && processEntryRef.current
          ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore make web strict
            processEntryRef?.current.getBoundingClientRect().bottom +
            (px - currPos.y)
          : 0

      const canShow = elementPosition + currPos.y >= 0
      setIsVisible(canShow)
    },
    [setIsVisible],
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore make web strict
    null,
    false,
    150,
  )

  const contentOverviewOptions = useMemo(() => {
    return createArticleNavigation(article, subArticle, linkResolver)
  }, [article, subArticle, linkResolver])

  const relatedLinks = (article?.relatedArticles ?? []).map((article) => ({
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

  const metaTitle = `${article?.title} | Ísland.is`
  const processEntry = article?.processEntry

  // TODO: Revert https://github.com/island-is/island.is/pull/10575 when we have properly configured english article unpublish behaviour
  const categoryHref = article?.category?.slug
    ? linkResolver('articlecategory', [article.category.slug]).href
    : ''
  const organizationTitle = article?.organization?.[0]?.title
  const organizationShortTitle = article?.organization?.[0]?.shortTitle

  const inStepperView = useMemo(
    () => query.stepper === 'true' && !!article?.stepper,
    [query.stepper, article?.stepper],
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
            !!article?.category?.slug && {
              title: article.category.title,
              typename: 'articlecategory',
              slug: [article.category.slug],
            },
            !!article?.category?.slug &&
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
    [article?.category, article?.group, inStepperView],
  )

  const content = (
    <Box paddingTop={subArticle ? 2 : 4}>
      {!inStepperView && (
        <Box className="rs_read">
          {webRichText(
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore make web strict
            (subArticle ?? article).body as SliceType[],
            {
              renderComponent: {
                Stepper: () => (
                  <Box marginY={3} printHidden className="rs_read">
                    <ProcessEntry
                      buttonText={n(
                        article?.processEntryButtonText || 'application',
                        '',
                      )}
                      processLink={asPath.split('?')[0].concat('?stepper=true')}
                      processTitle={article?.stepper?.title ?? ''}
                      newTab={false}
                    />
                  </Box>
                ),
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore make web strict
                Form: (form) => <Form form={form} namespace={namespace} />,
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
        {/**
         // eslint-disable-next-line @typescript-eslint/ban-ts-comment
         // @ts-ignore make web strict */}
        {processEntry?.processLink && <ProcessEntry {...processEntry} />}
      </Box>
      {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore make web strict
        article.organization.length > 0 && (
          <Box
            marginTop={[3, 3, 3, 10, 20]}
            marginBottom={[3, 3, 3, 10, 20]}
            printHidden
          >
            <InstitutionsPanel
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore make web strict
              img={article.organization[0].logo?.url ?? ''}
              institution={{
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore make web strict
                title: article.organization[0].title,
                label: n('organization'),
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore make web strict
                href: getOrganizationLink(
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore make web strict
                  article.organization[0],
                  activeLocale,
                ),
              }}
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore make web strict
              responsibleParty={article.responsibleParty.map(
                (responsibleParty) => ({
                  title: responsibleParty.title,
                  label: n('responsibleParty'),
                  href: responsibleParty.link,
                }),
              )}
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore make web strict
              relatedInstitution={article.relatedOrganization.map(
                (relatedOrganization) => ({
                  title: relatedOrganization.title,
                  label: n('relatedOrganization'),
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore make web strict
                  href: getOrganizationLink(relatedOrganization, activeLocale),
                }),
              )}
              locale={activeLocale}
              contactText="Hafa samband"
            />
          </Box>
        )
      }
      <Box display={['block', 'block', 'none']} printHidden>
        {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore make web strict
          (article.relatedArticles.length > 0 ||
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore make web strict
            article.relatedContent.length > 0) && (
            <RelatedContent
              title={n('relatedMaterial')}
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore make web strict
              articles={article.relatedArticles}
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore make web strict
              otherContent={article.relatedContent}
            />
          )
        }
      </Box>
    </Box>
  )
  return (
    <>
      <HeadWithSocialSharing
        title={metaTitle}
        description={article?.intro ?? ''}
        imageUrl={article?.featuredImage?.url}
        imageWidth={article?.featuredImage?.width.toString()}
        imageHeight={article?.featuredImage?.height.toString()}
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
              <span id={slugify(article?.title ?? '')} className="rs_read">
                {article?.title}
              </span>
            </Text>
          )}

          {!inStepperView && (
            <Breadcrumbs
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore make web strict
              items={breadcrumbItems}
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
          )}
        </Box>
        <Box
          paddingBottom={inStepperView ? undefined : [2, 2, 4]}
          display={['flex', 'flex', 'none']}
          justifyContent="spaceBetween"
          alignItems="center"
          printHidden
        >
          {!!article?.category?.title && (
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
          {article?.organization && article.organization.length > 0 && (
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
              <span id={slugify(article?.title ?? '')} className="rs_read">
                {article?.title}
              </span>
            </Text>
          )}

          {inStepperView && (
            <Stepper
              namespace={stepperNamespace ?? {}}
              optionsFromNamespace={stepOptionsFromNamespace}
              stepper={article?.stepper as StepperSchema}
              showWebReader={true}
              webReaderClassName="rs_read"
            />
          )}
          {!inStepperView && (
            <Box
              display="flex"
              alignItems="center"
              columnGap={2}
              flexWrap="wrap"
            >
              {!inStepperView && (
                <Webreader
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore make web strict
                  readId={null}
                  readClass="rs_read"
                />
              )}
              {(subArticle
                ? subArticle.signLanguageVideo?.url
                : // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore make web strict
                  article.signLanguageVideo?.url) && (
                <SignLanguageButton
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore make web strict
                  videoUrl={(subArticle ?? article).signLanguageVideo.url}
                  content={
                    <>
                      {!inStepperView && (
                        <Text variant="h2">
                          <span
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore make web strict
                            id={slugify((subArticle ?? article).title)}
                            className="rs_read"
                          >
                            {
                              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                              // @ts-ignore make web strict
                              (subArticle ?? article).title
                            }
                          </span>
                        </Text>
                      )}
                      {content}
                    </>
                  }
                />
              )}
            </Box>
          )}

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
              {/**
               // eslint-disable-next-line @typescript-eslint/ban-ts-comment
               // @ts-ignore make web strict */}
              <ProcessEntry {...processEntry} />
            </Box>
          )}
          {(subArticle
            ? subArticle.showTableOfContents
            : article?.showTableOfContents) && (
            <GridRow>
              <GridColumn
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore make web strict
                span={[null, '4/7', '5/7', '4/7', '3/7']}
              >
                <TOC
                  title={n('tableOfContentTitle')}
                  body={subArticle ? subArticle.body : article?.body}
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
        {content}
        {processEntry?.processLink &&
          mounted &&
          isVisible &&
          createPortal(
            <Box marginTop={5} display={['block', 'block', 'none']} printHidden>
              {/**
               // eslint-disable-next-line @typescript-eslint/ban-ts-comment
               // @ts-ignore make web strict */}
              <ProcessEntry fixed {...processEntry} />
            </Box>,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore make web strict
            portalRef.current,
          )}
      </SidebarLayout>
      <ArticleChatPanel
        article={article}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore make web strict
        pushUp={isVisible && processEntry?.processLink && mounted}
      />
      <OrganizationFooter
        organizations={article?.organization as Organization[]}
      />
    </>
  )
}

ArticleScreen.getProps = async ({ apolloClient, query, locale }) => {
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
      // map data here to reduce data processing in component
      .then((content) =>
        content.data.getNamespace?.fields
          ? JSON.parse(content.data.getNamespace.fields)
          : {},
      ),
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
  let stepOptionsFromNamespace: any = []

  if (article.stepper)
    stepOptionsFromNamespace =
      await stepperUtils.getStepOptionsFromUIConfiguration(
        article.stepper as StepperSchema,
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
