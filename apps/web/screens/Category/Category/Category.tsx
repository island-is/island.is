import React, { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import intersection from 'lodash/intersection'
import NextLink from 'next/link'
import {
  Text,
  Stack,
  Box,
  Link,
  Breadcrumbs,
  AccordionCard,
  TopicCard,
  FocusableBox,
  Navigation,
  LinkContext,
  Button,
} from '@island.is/island-ui/core'
import { sortAlpha } from '@island.is/shared/utils'
import { Card, Sticky } from '@island.is/web/components'
import { withMainLayout } from '@island.is/web/layouts/main'
import { Screen } from '@island.is/web/types'
import {
  GET_NAMESPACE_QUERY,
  GET_ARTICLES_QUERY,
  GET_CATEGORIES_QUERY,
  GET_ANCHOR_PAGES_IN_CATEGORY_QUERY,
} from '@island.is/web/screens/queries'
import { SidebarLayout } from '@island.is/web/screens/Layouts/SidebarLayout'
import { useNamespace } from '@island.is/web/hooks'
import useContentfulId from '@island.is/web/hooks/useContentfulId'
import {
  GetAnchorPagesInCategoryQuery,
  GetNamespaceQuery,
  GetArticlesQuery,
  QueryGetArticlesArgs,
  ContentLanguage,
  QueryGetNamespaceArgs,
  GetArticleCategoriesQuery,
  QueryGetArticleCategoriesArgs,
  QueryGetAnchorPagesInCategoryArgs,
  Image,
  ArticleGroup,
  Article,
} from '@island.is/web/graphql/schema'
import { CustomNextError } from '@island.is/web/units/errors'
import { LinkType, useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import { scrollTo } from '@island.is/web/hooks/useScrollSpy'
import {
  getActiveCategory,
  getHashArr,
  getHashString,
  updateHashArray,
} from './utils'
import { hasProcessEntries } from '@island.is/web/utils/article'

type Articles = GetArticlesQuery['getArticles']
type LifeEvents = GetAnchorPagesInCategoryQuery['getAnchorPagesInCategory']

interface CategoryProps {
  articles: Articles
  categories: GetArticleCategoriesQuery['getArticleCategories']
  namespace: GetNamespaceQuery['getNamespace']
  lifeEvents: LifeEvents
  slug: string
}

const Category: Screen<CategoryProps> = ({
  articles,
  lifeEvents,
  categories,
  namespace,
  slug,
}) => {
  const itemsRef = useRef<Array<HTMLElement | null>>([])
  const [hashArray, setHashArray] = useState<string[]>([])

  const Router = useRouter()
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  const n = useNamespace(namespace)
  const { linkResolver } = useLinkResolver()

  const getCurrentCategory = () => categories.find((x) => x.slug === slug)

  // group articles
  const { groups, cards, otherArticles } = articles.reduce(
    (content, article) => {
      // check if this is not the main category for this article
      if (article?.category?.title !== getCurrentCategory()?.title) {
        content.otherArticles.push(article)
        return content
      }
      // Check if article belongs to multiple groups in this category
      else if (
        article?.otherCategories &&
        article.otherCategories
          .map((category) => category.title)
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore make web strict
          .includes(getCurrentCategory().title)
      ) {
        content.otherArticles.push(article)
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore make web strict
      if (article?.group?.slug && !content.groups[article?.group?.slug]) {
        // group does not exist create the collection
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore make web strict
        content.groups[article?.group?.slug] = {
          title: article?.group?.title,
          description: article?.group?.description,
          articles: [article],
          groupSlug: article?.group?.slug,
          importance: article?.group?.importance,
        }
      } else if (article?.group?.slug) {
        // group should exists push into collection
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore make web strict
        content.groups[article?.group?.slug].articles.push(article)
      } else {
        // this article belongs to no group
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore make web strict
        content.cards.push(article)
      }
      return content
    },
    {
      groups: {},
      cards: [],
      otherArticles: [] as Articles,
    },
  )

  // Get all available subgroups.
  const availableSubgroups = articles
    .map((article) => article.subgroup)
    .filter(
      (value, index, all) =>
        all.findIndex((t) => JSON.stringify(t) === JSON.stringify(value)) ===
        index,
    )
    .filter((x) => x)

  useContentfulId(getCurrentCategory()?.id)

  // find current category in categories list
  const category = getCurrentCategory()

  useEffect(() => {
    const urlHash = window.location.hash ?? ''
    if (urlHash && urlHash.length > 0) {
      const ulrHashArr = getHashArr(urlHash)
      const activeCategory = getActiveCategory(ulrHashArr)
      setHashArray(ulrHashArr)
      if (activeCategory) {
        scrollTo(activeCategory, { marginTop: 24 })
      }
    }
  }, [])

  const sidebarCategoryLinks = categories
    .filter(
      (item) =>
        category?.id === item.id ||
        (item?.slug !== 'thjonusta-island-is' &&
          item?.slug !== 'services-on-island-is'),
    )
    .map(({ __typename: typename, title, slug }) => {
      return {
        title,
        typename,
        active: slug === Router.query.slug,
        slug: [slug],
      }
    })

  const groupArticlesBySubgroup = (articles: Articles, groupSlug?: string) => {
    const bySubgroup = articles.reduce((result, item) => {
      const key = item?.subgroup?.title ?? 'unknown'

      return {
        ...result,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore make web strict
        [key]: [...(result[key] || []), item],
      }
    }, {})

    // add "other" articles as well
    const articlesBySubgroup = otherArticles.reduce((result, item) => {
      const titles = item.otherSubgroups?.map((x) => x.title)
      const subgroupsFound = intersection(Object.keys(result), titles)
      const key = 'unknown'

      // if there is no sub group found then at least show it in the group
      if (
        !subgroupsFound.length &&
        item.otherGroups?.find((x) => x.slug === groupSlug)
      ) {
        return {
          ...result,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore make web strict
          [key]: [...(result[key] || []), item],
        }
      }

      return subgroupsFound.reduce((r, k) => {
        return {
          ...r,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore make web strict
          [k]: [...r[k], item],
        }
      }, result)
    }, bySubgroup)

    return { articlesBySubgroup }
  }

  const handleAccordionClick = (groupSlug: string) => {
    const updatedArr = updateHashArray(hashArray, groupSlug)
    setHashArray(updatedArr)
    window.location.href = `#${getHashString(updatedArr)}`
  }

  const sortArticles = (articles: Articles) => {
    // Sort articles by importance (which defaults to 0).
    // If both articles being compared have the same importance we sort by comparing their titles.
    const sortedArticles = articles.sort((a, b) => {
      if (!a.importance || !b.importance) {
        return a.importance ? -1 : b.importance ? 1 : sortAlpha('title')(a, b)
      }

      return a.importance > b.importance
        ? -1
        : a.importance === b.importance
        ? sortAlpha('title')(a, b)
        : 1
    })

    // If it's sorted alphabetically we need to be able to communicate that.
    const isSortedAlphabetically =
      JSON.stringify(sortedArticles) ===
      JSON.stringify([...articles].sort(sortAlpha('title')))

    return { sortedArticles, isSortedAlphabetically }
  }

  const sortSubgroups = (articlesBySubgroup: Record<string, Articles>) =>
    Object.keys(articlesBySubgroup).sort((a, b) => {
      // 'unknown' is a valid subgroup key but we'll sort it to the bottom
      if (a === 'unknown') {
        return 1
      } else if (b === 'unknown') {
        return -1
      }

      // Look up the subgroups being sorted and find+compare their importance.
      // If their importance is equal we sort alphabetically.
      const foundA = availableSubgroups.find(
        (subgroup) => subgroup?.title === a,
      )
      const foundB = availableSubgroups.find(
        (subgroup) => subgroup?.title === b,
      )

      if (foundA?.importance && foundB?.importance) {
        return foundA.importance > foundB.importance
          ? -1
          : foundA.importance === foundB.importance
          ? sortAlpha('title')(foundA, foundB)
          : 1
      }
      // Fall back to alphabet
      return a.localeCompare(b)
    })

  const sortedGroups = Object.values(groups).sort(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore make web strict
    (a: ArticleGroup, b: ArticleGroup) =>
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore make web strict
      a.importance > b.importance
        ? -1
        : a.importance === b.importance && sortAlpha('title')(a, b),
  )

  const ArticleGroupComponent = ({
    groupSlug,
    index,
  }: {
    groupSlug: string
    index: number
  }) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore make web strict
    const { title, description, articles } = groups[groupSlug]

    const { articlesBySubgroup } = groupArticlesBySubgroup(articles, groupSlug)

    const sortedSubgroupKeys = sortSubgroups(articlesBySubgroup)
    const expanded = hashArray.includes(groupSlug)

    return (
      <div id={groupSlug} ref={(el) => (itemsRef.current[index] = el)}>
        <AccordionCard
          id={`accordion-item-${groupSlug}`}
          label={title}
          labelUse="h2"
          labelVariant="h3"
          expanded={expanded}
          visibleContent={description}
          onToggle={() => {
            handleAccordionClick(groupSlug)
          }}
        >
          <Box paddingTop={2}>
            {sortedSubgroupKeys.map((subgroup, index) => {
              const { sortedArticles } = sortArticles(
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore make web strict
                articlesBySubgroup[subgroup],
              )

              // Articles with 1 subgroup only have the "other" group and don't get a heading.
              const hasSubgroups = sortedSubgroupKeys.length > 1

              const noSubgroupNameKeys = ['unknown', 'undefined', 'null']

              // Rename unknown group to 'Other'
              const subgroupName =
                noSubgroupNameKeys.indexOf(subgroup) !== -1 || !subgroup
                  ? n('other')
                  : subgroup

              const heading = hasSubgroups ? subgroupName : ''

              return (
                <React.Fragment key={subgroup}>
                  {heading && (
                    <Text
                      variant="h5"
                      as="h3"
                      paddingBottom={3}
                      paddingTop={index === 0 ? 0 : 3}
                    >
                      {heading}
                    </Text>
                  )}
                  <Stack space={2}>
                    {sortedArticles.map((article) => {
                      return (
                        <FocusableBox key={article.slug} borderRadius="large">
                          <TopicCard
                            href={
                              linkResolver(
                                article.__typename?.toLowerCase() as LinkType,
                                [article.slug],
                              ).href
                            }
                            {...(hasProcessEntries(article as Article) ||
                            article.processEntryButtonText
                              ? {
                                  tag: n(
                                    article.processEntryButtonText ||
                                      'application',
                                    'Umsókn',
                                  ),
                                }
                              : {})}
                          >
                            {article.title}
                          </TopicCard>
                        </FocusableBox>
                      )
                    })}
                  </Stack>
                </React.Fragment>
              )
            })}
          </Box>
        </AccordionCard>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>{category?.title} | Ísland.is</title>
      </Head>
      <SidebarLayout
        isSticky={false}
        sidebarContent={
          <Sticky>
            <Navigation
              baseId="desktopNav"
              colorScheme="purple"
              items={sidebarCategoryLinks}
              title={n('sidebarHeader')}
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore make web strict
              renderLink={(link, { typename, slug }) => {
                return (
                  <Link
                    href={linkResolver(typename as LinkType, slug).href}
                    onClick={() => setHashArray([])}
                    skipTab
                    pureChildren
                  >
                    {link}
                  </Link>
                )
              }}
            />
          </Sticky>
        }
      >
        <Box
          paddingBottom={[2, 2, 4]}
          display={['none', 'none', 'block']}
          printHidden
        >
          <Breadcrumbs
            items={[
              {
                title: 'Ísland.is',
                href: '/',
              },
            ]}
            renderLink={(link) => {
              return (
                <NextLink {...linkResolver('homepage')} passHref legacyBehavior>
                  {link}
                </NextLink>
              )
            }}
          />
        </Box>
        <Box
          paddingBottom={[2, 2, 4]}
          display={['flex', 'flex', 'none']}
          justifyContent="spaceBetween"
          alignItems="center"
          printHidden
        >
          <Box flexGrow={1} marginRight={6} overflow={'hidden'}>
            <LinkContext.Provider
              value={{
                linkRenderer: (href, children) => (
                  <Link href={href} skipTab>
                    {children}
                  </Link>
                ),
              }}
            >
              <Text truncate>
                <a {...linkResolver('homepage')}>
                  <Button
                    as="span"
                    preTextIcon="arrowBack"
                    preTextIconType="filled"
                    size="small"
                    type="button"
                    variant="text"
                  >
                    Ísland.is
                  </Button>
                </a>
              </Text>
            </LinkContext.Provider>
          </Box>
        </Box>
        <Box display={['block', 'block', 'none']}>
          <Navigation
            baseId="mobileNav"
            colorScheme="purple"
            isMenuDialog
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore make web strict
            renderLink={(link, { typename, slug }) => {
              return (
                <Link
                  href={linkResolver(typename as LinkType, slug).href}
                  onClick={() => setHashArray([])}
                  skipTab
                  pureChildren
                >
                  {link}
                </Link>
              )
            }}
            items={sidebarCategoryLinks}
            title={n('sidebarHeader')}
            activeItemTitle={category?.title}
          />
        </Box>
        <Box paddingBottom={[5, 5, 10]}>
          <Text variant="h1" as="h1" paddingTop={[4, 4, 0]} paddingBottom={2}>
            {category?.title}
          </Text>
          <Text variant="intro" as="p">
            {category?.description}
          </Text>
        </Box>
        <Stack space={2}>
          {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore make web strict
            sortedGroups.map(({ groupSlug }, index) => (
              <ArticleGroupComponent
                groupSlug={groupSlug}
                index={index}
                key={index}
              />
            ))
          }
          {lifeEvents.map(
            (
              { __typename: typename, title, slug, intro, thumbnail, image },
              index,
            ) => {
              return (
                <Card
                  key={index}
                  link={linkResolver(typename as LinkType, [slug])}
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore make web strict
                  description={intro}
                  title={title}
                  image={(thumbnail || image) as Image}
                  tags={[
                    {
                      title: n('categoryTag'),
                    },
                  ]}
                />
              )
            },
          )}
          {cards.map(
            ({ __typename: typename, title, content, slug }, index) => {
              return (
                <Card
                  key={index}
                  title={title}
                  description={content}
                  link={linkResolver(typename as LinkType, [slug])}
                />
              )
            },
          )}
        </Stack>
      </SidebarLayout>
    </>
  )
}

Category.getProps = async ({ apolloClient, locale, query }) => {
  const slug = query.slug as string

  const [
    {
      data: { getArticles: articles },
    },
    {
      data: { getAnchorPagesInCategory: lifeEvents },
    },
    {
      data: { getArticleCategories },
    },
    namespace,
  ] = await Promise.all([
    apolloClient.query<GetArticlesQuery, QueryGetArticlesArgs>({
      query: GET_ARTICLES_QUERY,
      variables: {
        input: {
          lang: locale as ContentLanguage,
          category: slug,
          size: 1000,
        },
      },
    }),
    apolloClient.query<
      GetAnchorPagesInCategoryQuery,
      QueryGetAnchorPagesInCategoryArgs
    >({
      query: GET_ANCHOR_PAGES_IN_CATEGORY_QUERY,
      variables: {
        input: {
          slug,
          lang: locale as ContentLanguage,
        },
      },
    }),
    apolloClient.query<
      GetArticleCategoriesQuery,
      QueryGetArticleCategoriesArgs
    >({
      query: GET_CATEGORIES_QUERY,
      variables: {
        input: {
          lang: locale as ContentLanguage,
        },
      },
    }),
    apolloClient
      .query<GetNamespaceQuery, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: {
            namespace: 'Categories',
            lang: locale,
          },
        },
      })
      .then((res) =>
        res.data.getNamespace?.fields
          ? JSON.parse(res.data.getNamespace.fields)
          : {},
      ),
  ])

  const categoryExists = getArticleCategories.some(
    (category) => category.slug === slug,
  )

  // if requested category si not in returned list of categories we assume it does not exist
  if (!categoryExists) {
    throw new CustomNextError(404, 'Category not found')
  }

  return {
    articles,
    lifeEvents,
    categories: getArticleCategories,
    namespace,
    slug,
  }
}

export default withMainLayout(Category)
