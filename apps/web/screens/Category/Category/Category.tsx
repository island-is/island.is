import React, { useEffect, useRef, useState } from 'react'
import intersection from 'lodash/intersection'
import Head from 'next/head'
import NextLink from 'next/link'
import { useRouter } from 'next/router'

import {
  AccordionCard,
  Box,
  Breadcrumbs,
  Button,
  FocusableBox,
  Link,
  LinkContext,
  Navigation,
  Stack,
  Text,
  TopicCard,
} from '@island.is/island-ui/core'
import { sortAlpha } from '@island.is/shared/utils'
import { Card, Sticky } from '@island.is/web/components'
import {
  Article,
  ArticleGroup,
  ContentLanguage,
  GetAnchorPagesInCategoryQuery,
  GetArticleCategoriesQuery,
  GetCategoryPagesQuery,
  GetCategoryPagesQueryVariables,
  GetNamespaceQuery,
  Image,
  QueryGetAnchorPagesInCategoryArgs,
  QueryGetArticleCategoriesArgs,
  QueryGetNamespaceArgs,
} from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import useContentfulId from '@island.is/web/hooks/useContentfulId'
import { LinkType, useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import { scrollTo } from '@island.is/web/hooks/useScrollSpy'
import { useI18n } from '@island.is/web/i18n'
import { withMainLayout } from '@island.is/web/layouts/main'
import { SidebarLayout } from '@island.is/web/screens/Layouts/SidebarLayout'
import {
  GET_ANCHOR_PAGES_IN_CATEGORY_QUERY,
  GET_CATEGORIES_QUERY,
  GET_CATEGORY_PAGES_QUERY,
  GET_NAMESPACE_QUERY,
} from '@island.is/web/screens/queries'
import { Screen } from '@island.is/web/types'
import { CustomNextError } from '@island.is/web/units/errors'
import { hasProcessEntries } from '@island.is/web/utils/article'

import {
  getActiveCategory,
  getHashArr,
  getHashString,
  updateHashArray,
} from './utils'

type CategoryPages = NonNullable<GetCategoryPagesQuery['getCategoryPages']>
type LifeEvents = GetAnchorPagesInCategoryQuery['getAnchorPagesInCategory']

interface CategoryProps {
  pages: CategoryPages
  categories: GetArticleCategoriesQuery['getArticleCategories']
  namespace: Record<string, string>
  lifeEvents: LifeEvents
  slug: string
}

const Category: Screen<CategoryProps> = ({
  pages,
  lifeEvents,
  categories,
  namespace,
  slug,
}) => {
  const itemsRef = useRef<Array<HTMLElement | null>>([])
  const [hashArray, setHashArray] = useState<string[]>([])
  const { activeLocale } = useI18n()

  const Router = useRouter()

  const n = useNamespace(namespace)
  const { linkResolver } = useLinkResolver()

  const getCurrentCategory = () => categories.find((x) => x.slug === slug)

  // group pages
  const { groups, cards, otherPages } = pages.reduce(
    (content, page) => {
      const currentCategoryTitle = getCurrentCategory()?.title

      // check if this is not the main category for this page
      if (page?.category?.title !== currentCategoryTitle) {
        content.otherPages.push(page)
        return content
      }
      // Check if page belongs to multiple groups in this category
      else if (
        page?.otherCategories &&
        currentCategoryTitle &&
        page.otherCategories
          .map((category) => category.title)
          .includes(currentCategoryTitle)
      ) {
        content.otherPages.push(page)
      }
      if (page?.group?.slug && !content.groups[page?.group?.slug]) {
        // group does not exist create the collection
        content.groups[page?.group?.slug] = {
          title: page?.group?.title,
          description: page?.group?.description,
          pages: [page],
          groupSlug: page?.group?.slug,
          importance: page?.group?.importance,
        }
      } else if (page?.group?.slug) {
        // group should exists push into collection
        content.groups[page?.group?.slug].pages.push(page)
      } else {
        // this page belongs to no group
        content.cards.push(page)
      }
      return content
    },
    {
      groups: {} as Record<
        string,
        {
          title?: string
          description?: string | null
          pages: CategoryPages
          groupSlug?: string
          importance?: number | null
        }
      >,
      cards: [] as CategoryPages,
      otherPages: [] as CategoryPages,
    },
  )

  // Get all available subgroups.
  const availableSubgroups = pages
    .map((page) => page.subgroup)
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

  const groupPagesBySubgroup = (pages: CategoryPages, groupSlug?: string) => {
    const bySubgroup = pages.reduce((result, item) => {
      const key = item?.subgroup?.title ?? 'unknown'

      return {
        ...result,
        [key]: [...(result[key as keyof typeof result] || []), item],
      }
    }, {})

    // add "other" pages as well
    const pagesBySubgroup = otherPages.reduce((result, item) => {
      const titles = (item.otherSubgroups ?? []).map((x) => x.title)
      const subgroupsFound = intersection(Object.keys(result), titles)
      const key = 'unknown'

      // if there is no sub group found then at least show it in the group
      if (
        !subgroupsFound.length &&
        item.otherGroups?.find((x) => x.slug === groupSlug)
      ) {
        return {
          ...result,
          [key]: [...(result[key as keyof typeof result] || []), item],
        }
      }

      return subgroupsFound.reduce((r, k) => {
        return {
          ...r,
          [k]: [...r[k as keyof typeof r], item],
        }
      }, result)
    }, bySubgroup)

    return { pagesBySubgroup }
  }

  const handleAccordionClick = (groupSlug: string) => {
    const updatedArr = updateHashArray(hashArray, groupSlug)
    setHashArray(updatedArr)
    window.location.href = `#${getHashString(updatedArr)}`
  }

  const sortPages = (pages: CategoryPages) => {
    // Sort pages by importance (which defaults to 0).
    // If both pages being compared have the same importance we sort by comparing their titles.
    const sortedPages = pages.sort((a, b) => {
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
      JSON.stringify(sortedPages) ===
      JSON.stringify([...pages].sort(sortAlpha('title')))

    return { sortedPages, isSortedAlphabetically }
  }

  const sortSubgroups = (pagesBySubgroup: Record<string, CategoryPages>) =>
    Object.keys(pagesBySubgroup).sort((a, b) => {
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

  const PageGroupComponent = ({
    groupSlug,
    index,
  }: {
    groupSlug: string
    index: number
  }) => {
    const { title, description, pages } = groups[groupSlug]

    const { pagesBySubgroup } = groupPagesBySubgroup(pages, groupSlug)

    const sortedSubgroupKeys = sortSubgroups(pagesBySubgroup)
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
              const { sortedPages } = sortPages(
                pagesBySubgroup[subgroup as keyof typeof pagesBySubgroup],
              )

              // Pages with 1 subgroup only have the "other" group and don't get a heading.
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
                    {sortedPages.map((page) => {
                      let topicCardProps = {}
                      if (
                        page.__typename === 'Article' &&
                        (hasProcessEntries(page as Article) ||
                          page.processEntryButtonText)
                      ) {
                        topicCardProps = {
                          tag: n(
                            page.processEntryButtonText || 'application',
                            'Umsókn',
                          ),
                        }
                      } else if (page.__typename === 'Manual') {
                        topicCardProps = {
                          tag: n(
                            'manualCardTag',
                            activeLocale === 'is' ? 'Handbók' : 'Manual',
                          ),
                        }
                      }

                      return (
                        <FocusableBox key={page.slug} borderRadius="large">
                          <TopicCard
                            href={
                              linkResolver(
                                page.__typename?.toLowerCase() as LinkType,
                                [page.slug],
                              ).href
                            }
                            {...topicCardProps}
                          >
                            {page.title}
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
              <PageGroupComponent
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
                  description={intro ?? ''}
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
          {cards.map((card, index) => {
            const { __typename: typename, title, slug } = card
            return (
              <Card
                key={index}
                title={title}
                description=""
                link={linkResolver(typename as LinkType, [slug])}
              />
            )
          })}
        </Stack>
      </SidebarLayout>
    </>
  )
}

Category.getProps = async ({ apolloClient, locale, query }) => {
  const slug = query.slug as string

  const [
    {
      data: { getCategoryPages: categoryPages },
    },
    {
      data: { getAnchorPagesInCategory: lifeEvents },
    },
    {
      data: { getArticleCategories },
    },
    namespace,
  ] = await Promise.all([
    apolloClient.query<GetCategoryPagesQuery, GetCategoryPagesQueryVariables>({
      query: GET_CATEGORY_PAGES_QUERY,
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

  // if requested category is not in returned in the list of categories we assume it does not exist
  if (!categoryExists) {
    throw new CustomNextError(404, 'Category not found')
  }

  return {
    pages: categoryPages ?? [],
    lifeEvents,
    categories: getArticleCategories,
    namespace,
    slug,
  }
}

export default withMainLayout(Category)
