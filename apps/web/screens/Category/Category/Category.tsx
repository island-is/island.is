import React, { useEffect, useRef, useState } from 'react'
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
import { Card, Sticky } from '@island.is/web/components'
import {
  Article,
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
  CategoryGroups,
  extractCategoryGroups,
  getActiveCategory,
  getHashArr,
  getHashString,
  updateHashArray,
} from './utils'

type LifeEvents = GetAnchorPagesInCategoryQuery['getAnchorPagesInCategory']

interface CategoryProps {
  groups: CategoryGroups
  selectedCategory: GetArticleCategoriesQuery['getArticleCategories'][number]
  categories: GetArticleCategoriesQuery['getArticleCategories']
  namespace: Record<string, string>
  lifeEvents: LifeEvents
  slug: string
}

const Category: Screen<CategoryProps> = ({
  groups,
  selectedCategory,
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

  useContentfulId(getCurrentCategory()?.id)

  useEffect(() => {
    const urlHash = window.location.hash ?? ''
    if (urlHash && urlHash.length > 0) {
      const ulrHashArr = getHashArr(urlHash)
      const activeCategory = getActiveCategory(ulrHashArr)
      setHashArray(ulrHashArr ?? [])
      if (activeCategory) {
        scrollTo(activeCategory, { marginTop: 24 })
      }
    }
  }, [])

  const sidebarCategoryLinks = categories
    .filter(
      (item) =>
        selectedCategory?.id === item.id ||
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

  const handleAccordionClick = (groupSlug: string) => {
    const updatedArr = updateHashArray(hashArray, groupSlug)
    setHashArray(updatedArr)
    window.location.href = `#${getHashString(updatedArr)}`
  }

  const PageGroupComponent = ({
    group,
    index,
  }: {
    group: CategoryGroups[number]
    index: number
  }) => {
    const groupSlug = group.slug
    const expanded = hashArray.includes(groupSlug)

    return (
      <div id={groupSlug} ref={(el) => (itemsRef.current[index] = el)}>
        <AccordionCard
          id={`accordion-item-${groupSlug}`}
          label={group?.title}
          labelUse="h2"
          labelVariant="h3"
          expanded={expanded}
          visibleContent={group?.description}
          onToggle={() => {
            handleAccordionClick(groupSlug)
          }}
        >
          <Box paddingTop={2}>
            {group.subgroups.map((subgroup, index) => {
              // Pages with 1 subgroup only have the "other" group and don't get a heading.
              const hasSubgroups = group.subgroups.length > 1

              const noSubgroupNameKeys = ['unknown', 'undefined', 'null']

              // Rename unknown group to 'Other'
              const subgroupName =
                noSubgroupNameKeys.indexOf(subgroup.title ?? '') !== -1 ||
                !subgroup.title
                  ? n('other')
                  : subgroup.title

              const heading = hasSubgroups ? subgroupName : ''

              return (
                <React.Fragment key={subgroup.title}>
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
                    {subgroup.pages.map((page) => {
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
        <title>{selectedCategory?.title} | Ísland.is</title>
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
            activeItemTitle={selectedCategory?.title}
          />
        </Box>
        <Box paddingBottom={[5, 5, 10]}>
          <Text variant="h1" as="h1" paddingTop={[4, 4, 0]} paddingBottom={2}>
            {selectedCategory?.title}
          </Text>
          <Text variant="intro" as="p">
            {selectedCategory?.description}
          </Text>
        </Box>
        <Stack space={2}>
          {groups.map((group, index) => (
            <PageGroupComponent group={group} index={index} key={index} />
          ))}
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

  const selectedCategory = getArticleCategories.find(
    (category) => category.slug === slug,
  )

  // if requested category is not in returned in the list of categories we assume it does not exist
  if (!selectedCategory) {
    throw new CustomNextError(404, 'Category not found')
  }

  return {
    groups: extractCategoryGroups(categoryPages ?? [], selectedCategory),
    lifeEvents,
    selectedCategory,
    categories: getArticleCategories,
    namespace,
    slug,
  }
}

export default withMainLayout(Category)
