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
import { Card, Sticky } from '@island.is/web/components'
import { withMainLayout } from '@island.is/web/layouts/main'
import { Screen } from '@island.is/web/types'
import {
  GET_NAMESPACE_QUERY,
  GET_ARTICLES_QUERY,
  GET_CATEGORIES_QUERY,
  GET_LIFE_EVENTS_IN_CATEGORY_QUERY,
} from '@island.is/web/screens/queries'
import { SidebarLayout } from '@island.is/web/screens/Layouts/SidebarLayout'
import { useNamespace } from '@island.is/web/hooks'
import useContentfulId from '@island.is/web/hooks/useContentfulId'
import {
  GetLifeEventsInCategoryQuery,
  GetNamespaceQuery,
  GetArticlesQuery,
  QueryGetArticlesArgs,
  ContentLanguage,
  QueryGetNamespaceArgs,
  GetArticleCategoriesQuery,
  QueryGetArticleCategoriesArgs,
  QueryGetLifeEventsInCategoryArgs,
  Image,
  ArticleGroup,
} from '../../graphql/schema'
import { CustomNextError } from '@island.is/web/units/errors'
import { LinkType, useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import { scrollTo } from '@island.is/web/hooks/useScrollSpy'

type Articles = GetArticlesQuery['getArticles']
type LifeEvents = GetLifeEventsInCategoryQuery['getLifeEventsInCategory']

// adds or removes selected category in hash array
export const updateHashArray = (
  hashArray: string[],
  categoryId: string,
): string[] => {
  let tempArr = hashArray ?? []
  if (!!categoryId && categoryId.length > 0) {
    if (tempArr.includes(categoryId)) {
      tempArr = hashArray.filter((x) => x !== categoryId)
    } else {
      tempArr = tempArr.concat([categoryId])
    }
  }
  return tempArr
}

// gets "active" category that we use to scroll to on inital render
export const getActiveCategory = (hashArr: string[]): string | null => {
  if (!!hashArr && hashArr.length > 0) {
    const activeCategory = hashArr[hashArr.length - 1].replace('#', '')
    return activeCategory.length > 0 ? activeCategory : null
  }
  return null
}

// creates hash string from array
export const getHashString = (hashArray: string[]): string => {
  if (!!hashArray && hashArray.length > 0) {
    return hashArray.length > 1 ? hashArray.join(',') : hashArray[0]
  }
  return ''
}

// creates hash array from string
export const getHashArr = (hashString: string): string[] => {
  if (!!hashString && hashString.length > 0) {
    hashString = hashString.replace('#', '')
    return hashString.length > 0 ? hashString.split(',') : null
  }
  return null
}

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
  const n = useNamespace(namespace)
  const { linkResolver } = useLinkResolver()

  const getCurrentCategory = () => categories.find((x) => x.slug === slug)

  // group articles
  const { groups, cards, otherArticles } = articles.reduce(
    (content, article) => {
      // check if this is not the main category for this article
      if (article?.category?.title !== getCurrentCategory().title) {
        content.otherArticles.push(article)
        return content
      }

      if (article?.group?.slug && !content.groups[article?.group?.slug]) {
        // group does not exist create the collection
        content.groups[article?.group?.slug] = {
          title: article?.group?.title,
          description: article?.group?.description,
          articles: [article],
          groupSlug: article?.group?.slug,
          importance: article?.group?.importance,
        }
      } else if (article?.group?.slug) {
        // group should exists push into collection
        content.groups[article?.group?.slug].articles.push(article)
      } else {
        // this article belongs to no group
        content.cards.push(article)
      }
      return content
    },
    {
      groups: {},
      cards: [],
      otherArticles: [],
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

  const sidebarCategoryLinks = categories.map(
    ({ __typename: typename, title, slug }) => {
      return {
        title,
        typename,
        active: slug === Router.query.slug,
        slug: [slug],
      }
    },
  )

  const groupArticlesBySubgroup = (articles: Articles, groupSlug?: string) => {
    const bySubgroup = articles.reduce((result, item) => {
      const key = item?.subgroup?.title ?? 'unknown'

      return {
        ...result,
        [key]: [...(result[key] || []), item],
      }
    }, {})

    // add "other" articles as well
    const articlesBySubgroup = otherArticles.reduce((result, item) => {
      const titles = item.otherSubgroups.map((x) => x.title)
      const subgroupsFound = intersection(Object.keys(result), titles)
      const key = 'unknown'

      // if there is no sub group found then at least show it in the group
      if (
        !subgroupsFound.length &&
        item.otherGroups.find((x) => x.slug === groupSlug)
      ) {
        return {
          ...result,
          [key]: [...(result[key] || []), item],
        }
      }

      return subgroupsFound.reduce((r, k) => {
        return {
          ...r,
          [k]: [...r[k], item],
        }
      }, result)
    }, bySubgroup)

    return { articlesBySubgroup }
  }

  const handleAccordionClick = (groupSlug: string) => {
    const updatedArr = updateHashArray(hashArray, groupSlug)
    setHashArray(updatedArr)
    Router.replace({
      pathname: linkResolver(category.__typename as LinkType, [slug]).href,
      hash: getHashString(updatedArr),
    })
  }

  const sortArticles = (articles: Articles) => {
    // Sort articles by importance (which defaults to 0).
    // If both articles being compared have the same importance we sort by comparing their titles.
    const sortedArticles = articles.sort((a, b) =>
      a.importance > b.importance
        ? -1
        : a.importance === b.importance
        ? a.title.localeCompare(b.title)
        : 1,
    )

    // If it's sorted alphabetically we need to be able to communicate that.
    const isSortedAlphabetically =
      JSON.stringify(sortedArticles) ===
      JSON.stringify(
        [...articles].sort((a, b) => a.title.localeCompare(b.title)),
      )

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
      const foundA = availableSubgroups.find((subgroup) => subgroup.title === a)
      const foundB = availableSubgroups.find((subgroup) => subgroup.title === b)

      if (foundA && foundB) {
        return foundA.importance > foundB.importance
          ? -1
          : foundA.importance === foundB.importance
          ? foundA.title.localeCompare(foundB.title)
          : 1
      }

      // Fall back to alphabet
      return a.localeCompare(b)
    })

  const sortedGroups = Object.values(
    groups,
  ).sort((a: ArticleGroup, b: ArticleGroup) =>
    a.importance > b.importance
      ? -1
      : a.importance === b.importance && a.title.localeCompare(b.title, 'is'),
  )

  return (
    <>
      <Head>
        <title>{category.title} | Ísland.is</title>
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
                <NextLink {...linkResolver('homepage')} passHref>
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
            activeItemTitle={category.title}
          />
        </Box>
        <Box paddingBottom={[5, 5, 10]}>
          <Text variant="h1" as="h1" paddingTop={[4, 4, 0]} paddingBottom={2}>
            {category.title}
          </Text>
          <Text variant="intro" as="p">
            {category.description}
          </Text>
        </Box>
        <Stack space={2}>
          {sortedGroups.map(({ groupSlug }, index) => {
            const { title, description, articles } = groups[groupSlug]

            const { articlesBySubgroup } = groupArticlesBySubgroup(
              articles,
              groupSlug,
            )

            const sortedSubgroupKeys = sortSubgroups(articlesBySubgroup)
            const expanded = hashArray.includes(groupSlug)

            return (
              <div
                key={index}
                id={groupSlug}
                ref={(el) => (itemsRef.current[index] = el)}
              >
                <AccordionCard
                  id={`accordion-item-${groupSlug}`}
                  label={title}
                  labelUse="h2"
                  labelVariant="h3"
                  startExpanded={expanded}
                  visibleContent={description}
                >
                  <Box paddingTop={2}>
                    {sortedSubgroupKeys.map((subgroup, index) => {
                      const { sortedArticles } = sortArticles(
                        articlesBySubgroup[subgroup],
                      )

                      // Articles with 1 subgroup only have the "other" group and don't get a heading.
                      const hasSubgroups = sortedSubgroupKeys.length > 1

                      const noSubgroupNameKeys = [
                        'unknown',
                        'undefined',
                        'null',
                      ]

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
                            {sortedArticles.map(
                              ({
                                __typename: typename,
                                title,
                                slug,
                                processEntry,
                              }) => {
                                return (
                                  <FocusableBox key={slug} borderRadius="large">
                                    <TopicCard
                                      href={
                                        linkResolver(
                                          typename.toLowerCase() as LinkType,
                                          [slug],
                                        ).href
                                      }
                                      tag={
                                        !!processEntry &&
                                        n('applicationProcess', 'Umsókn')
                                      }
                                    >
                                      {title}
                                    </TopicCard>
                                  </FocusableBox>
                                )
                              },
                            )}
                          </Stack>
                        </React.Fragment>
                      )
                    })}
                  </Box>
                </AccordionCard>
              </div>
            )
          })}
          {lifeEvents.map(
            (
              { __typename: typename, title, slug, intro, thumbnail, image },
              index,
            ) => {
              return (
                <Card
                  key={index}
                  link={linkResolver(typename as LinkType, [slug])}
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

Category.getInitialProps = async ({ apolloClient, locale, query }) => {
  const slug = query.slug as string

  const [
    {
      data: { getArticles: articles },
    },
    {
      data: { getLifeEventsInCategory: lifeEvents },
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
          size: 150,
        },
      },
    }),
    apolloClient.query<
      GetLifeEventsInCategoryQuery,
      QueryGetLifeEventsInCategoryArgs
    >({
      query: GET_LIFE_EVENTS_IN_CATEGORY_QUERY,
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
      .then((res) => JSON.parse(res.data.getNamespace.fields)),
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
