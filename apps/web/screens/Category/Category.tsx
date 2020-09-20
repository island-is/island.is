/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import {
  Typography,
  Stack,
  Box,
  Breadcrumbs,
  Hidden,
  Select,
  AccordionCard,
  LinkCard,
  Option,
  Link,
  Accordion,
  FocusableBox,
} from '@island.is/island-ui/core'
import { Card, Sidebar } from '../../components'
import { useI18n } from '@island.is/web/i18n'
import routeNames from '@island.is/web/i18n/routeNames'
import { withMainLayout } from '@island.is/web/layouts/main'
import { Screen } from '../../types'
import {
  GET_NAMESPACE_QUERY,
  GET_ARTICLES_QUERY,
  GET_CATEGORIES_QUERY,
  GET_LIFE_EVENTS_IN_CATEGORY_QUERY,
} from '../queries'
import { CategoryLayout } from '../Layouts/Layouts'
import { LifeEventCard } from '../../components/LifeEventsCardsSection/components/LifeEventCard'
import LifeEventInCategory from './LifeEventInCategory'

import { useNamespace } from '@island.is/web/hooks'
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
} from '../../graphql/schema'

type Articles = GetArticlesQuery['getArticles']
type LifeEvents = GetLifeEventsInCategoryQuery['getLifeEventsInCategory']

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
  const [hash, setHash] = useState<string>('')
  const { activeLocale } = useI18n()
  const Router = useRouter()
  const n = useNamespace(namespace)
  const { makePath } = routeNames(activeLocale)

  // group articles
  const { groups, cards } = articles.reduce(
    (content, article) => {
      if (article?.group?.slug && !content.groups[article?.group?.slug]) {
        // group does not exist create the collection
        content.groups[article?.group?.slug] = {
          title: article?.group?.title,
          description: article?.group?.description,
          articles: [article],
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

  // find current category in categories list
  const category = categories.find((x) => x.slug === slug)

  useEffect(() => {
    const hashMatch = Router.asPath.match(/#([a-z0-9_-]+)/gi)
    setHash((hashMatch && hashMatch[0]) ?? '')
  }, [Router])

  useEffect(() => {
    const groupSlug = Object.keys(groups).find(
      (x) => x === hash.replace('#', ''),
    )

    if (groupSlug) {
      const el = itemsRef.current.find(
        (x) => x.getAttribute('data-slug') === groupSlug,
      )

      if (el) {
        window.scrollTo(0, el.offsetTop)
      }
    }
  }, [itemsRef, groups, hash])

  const sidebarCategoryLinks = categories.map((c) => ({
    title: c.title,
    active: c.slug === Router.query.slug,
    href: `${makePath('ArticleCategory')}/[slug]`,
    as: makePath('ArticleCategory', c.slug),
  }))

  const categoryOptions = categories.map((c) => ({
    label: c.title,
    value: c.slug,
  }))

  const groupArticlesBySubgroup = (articles: Articles) => {
    const articlesBySubgroup = articles.reduce(
      (result, item) => ({
        ...result,
        [item?.subgroup?.title]: [
          ...(result[item?.subgroup?.title] || []),
          item,
        ],
      }),
      {},
    )

    return { articlesBySubgroup }
  }

  const sortArticles = (articles: Articles) => {
    // Sort articles by importance (which defaults to 0).
    // If both articles being compared have the same importance we sort by comparing their titles.
    const sortedArticles = articles.sort((a, b) =>
      a.importance > b.importance
        ? -1
        : a.importance === b.importance && a.title.localeCompare(b.title),
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
      // Look up the subgroups being sorted and find+compare their importance.
      // If their importance is equal we sort alphabetically.
      const foundA = availableSubgroups.find((subgroup) => subgroup.title === a)
      const foundB = availableSubgroups.find((subgroup) => subgroup.title === b)

      if (foundA && foundB) {
        return foundA.importance > foundB.importance
          ? -1
          : foundA.importance === foundB.importance &&
              foundA.title.localeCompare(foundB.title)
      }

      // Fall back to alphabet
      return a.localeCompare(b)
    })

  const sortedGroups = Object.keys(groups).sort((a, b) =>
    a.localeCompare(b, 'is'),
  )
  return (
    <>
      <Head>
        <title>{category.title} | Ísland.is</title>
      </Head>
      <CategoryLayout
        sidebar={
          <Sidebar
            bullet="none"
            items={sidebarCategoryLinks}
            title={n('sidebarHeader')}
          />
        }
        belowContent={
          <Stack space={2}>
            <Stack space={2}>
              <Accordion
                dividerOnBottom={false}
                dividerOnTop={false}
                dividers={false}
              >
                {sortedGroups.map((groupSlug, index) => {
                  const { title, description, articles } = groups[groupSlug]

                  const expanded = groupSlug === hash.replace('#', '')

                  const { articlesBySubgroup } = groupArticlesBySubgroup(
                    articles,
                  )

                  const sortedSubgroupKeys = sortSubgroups(articlesBySubgroup)

                  return (
                    <div
                      key={index}
                      data-slug={groupSlug}
                      ref={(el) => (itemsRef.current[index] = el)}
                    >
                      <AccordionCard
                        id={`accordion-item-${groupSlug}`}
                        label={title}
                        labelUse="h2"
                        startExpanded={expanded}
                        visibleContent={description}
                      >
                        <Box paddingY={2}>
                          {sortedSubgroupKeys.map((subgroup, index) => {
                            const {
                              sortedArticles,
                              isSortedAlphabetically,
                            } = sortArticles(articlesBySubgroup[subgroup])

                            // Articles with 1 subgroup only have the "other" group and don't get a heading.
                            const hasSubgroups = sortedSubgroupKeys.length > 1

                            // Single articles that don't belong to a subgroup don't get a heading
                            const isSingleArticle = sortedArticles.length === 1

                            // Rename 'undefined' group to 'Other'
                            const subgroupName =
                              subgroup === 'undefined' ||
                              subgroup === 'null' ||
                              !subgroup
                                ? n('other')
                                : subgroup

                            const heading = hasSubgroups
                              ? subgroupName
                              : isSortedAlphabetically && !isSingleArticle
                              ? n('sortedAlphabetically', 'A til Ö')
                              : '' // No subgroup and custom sorting = no heading

                            return (
                              <React.Fragment key={subgroup}>
                                {heading && (
                                  <Typography
                                    variant="h5"
                                    paddingBottom={3}
                                    paddingTop={index === 0 ? 0 : 3}
                                  >
                                    {heading}
                                  </Typography>
                                )}
                                <Stack space={2}>
                                  {sortedArticles.map(
                                    ({
                                      title,
                                      slug,
                                      containsApplicationForm,
                                    }) => {
                                      return (
                                        <FocusableBox
                                          key={slug}
                                          href={`${makePath('article')}/[slug]`}
                                          as={makePath('article', slug)}
                                          borderRadius="large"
                                        >
                                          <LinkCard
                                            tag={
                                              containsApplicationForm &&
                                              n('applicationProcess', 'Umsókn')
                                            }
                                          >
                                            {title}
                                          </LinkCard>
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
              </Accordion>
            </Stack>
            <Stack space={2}>
              <div
                style={{
                  marginTop: '-16px',
                }}
              >
                {lifeEvents.map((lifeEvent, index) => {
                  return (
                    <LifeEventInCategory
                      key={index}
                      title={lifeEvent.title}
                      slug={lifeEvent.slug}
                      intro={lifeEvent.intro}
                      image={
                        lifeEvent.thumbnail
                          ? lifeEvent.thumbnail.url
                          : lifeEvent.image.url
                      }
                    />
                  )
                })}
              </div>
            </Stack>
            <Stack space={2}>
              {cards.map(({ title, content, slug }, index) => {
                return (
                  <Card
                    key={index}
                    title={title}
                    description={content}
                    href={`${makePath('article')}/[slug]`}
                    as={makePath('article', slug)}
                  />
                )
              })}
            </Stack>
          </Stack>
        }
      >
        <Box paddingBottom={2}>
          <Breadcrumbs>
            <Link href={makePath()}>Ísland.is</Link>
          </Breadcrumbs>
        </Box>

        <Hidden above="sm">
          <Select
            label="Þjónustuflokkar"
            defaultValue={{
              label: category.title,
              value: category.slug,
            }}
            onChange={({ value }: Option) => {
              const slug = value as string

              Router.push(
                `${makePath('ArticleCategory')}/[slug]`,
                makePath('ArticleCategory', slug),
              )
            }}
            options={categoryOptions}
            name="categories"
          />
        </Hidden>
        <Typography
          variant="h1"
          as="h1"
          paddingTop={[4, 4, 0]}
          paddingBottom={2}
        >
          {category.title}
        </Typography>
        <Typography variant="intro" as="p">
          {category.description}
        </Typography>
      </CategoryLayout>
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

  return {
    articles,
    lifeEvents,
    categories: getArticleCategories,
    namespace,
    slug,
  }
}

export default withMainLayout(Category)
