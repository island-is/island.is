/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import NextLink from 'next/link'
import {
  Typography,
  Stack,
  Breadcrumbs,
  Hidden,
  Select,
  AccordionCard,
  LinkCard,
  Option,
  Link,
  Accordion,
  Box,
} from '@island.is/island-ui/core'
import { Card, Sidebar } from '../../components'
import { useI18n } from '@island.is/web/i18n'
import useRouteNames from '@island.is/web/i18n/useRouteNames'
import { Screen } from '../../types'
import {
  GET_NAMESPACE_QUERY,
  GET_ARTICLES_IN_CATEGORY_QUERY,
  GET_CATEGORIES_QUERY,
} from '../queries'
import { CategoryLayout } from '../Layouts/Layouts'
import { useNamespace } from '@island.is/web/hooks'
import {
  GetArticlesInCategoryQuery,
  GetCategoriesQuery,
  GetNamespaceQuery,
  QueryArticlesInCategoryArgs,
  ContentLanguage,
  QueryCategoriesArgs,
  QueryGetNamespaceArgs,
} from '../../graphql/schema'

interface CategoryProps {
  articles: GetArticlesInCategoryQuery['articlesInCategory']
  categories: GetCategoriesQuery['categories']
  namespace: GetNamespaceQuery['getNamespace']
}

const Category: Screen<CategoryProps> = ({
  articles,
  categories,
  namespace,
}) => {
  const itemsRef = useRef<Array<HTMLElement | null>>([])
  const [hash, setHash] = useState<string>('')
  const { activeLocale } = useI18n()
  const Router = useRouter()
  const n = useNamespace(namespace)
  const { makePath } = useRouteNames(activeLocale)

  // group articles
  const { groups, cards } = articles.reduce(
    (content, article) => {
      if (article.groupSlug && !content.groups[article.groupSlug]) {
        // group does not exist create the collection
        content.groups[article.groupSlug] = {
          title: article.group,
          description: article.groupDescription,
          articles: [article],
        }
      } else if (article.groupSlug) {
        // group should exists push into collection
        content.groups[article.groupSlug].articles.push(article)
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

  // find current category in categories list
  const category = categories.find((x) => x.slug === Router.query.slug)

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
    href: `${makePath('category')}/[slug]`,
    as: makePath('category', c.slug),
  }))

  const categoryOptions = categories.map((c) => ({
    label: c.title,
    value: c.slug,
  }))

  const subgroupSorting = (a, b) => {
    // Make items with 'Annað' subgroup appear last.
    if (b === n('other')) {
      return -1
    }
    // Otherwise sort them alphabetically.
    return a - b
  }

  const groupArticlesBySubgroup = (
    articles: GetArticlesInCategoryQuery['articlesInCategory'],
  ) => {
    const groupBy = (items, key) =>
      items.reduce(
        (result, item) => ({
          ...result,
          [item[key] || n('other')]: [...(result[item[key]] || []), item],
        }),
        {},
      )
    return groupBy(articles, 'subgroup')
  }

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
                {Object.keys(groups).map((groupSlug, index) => {
                  const { title, description, articles } = groups[groupSlug]

                  const expanded = groupSlug === hash.replace('#', '')

                  const articlesBySubgroup = groupArticlesBySubgroup(articles)
                  const sortedSubgroups = Object.keys(articlesBySubgroup).sort(
                    subgroupSorting,
                  )

                  return (
                    <div
                      key={index}
                      data-slug={groupSlug}
                      ref={(el) => (itemsRef.current[index] = el)}
                    >
                      <AccordionCard
                        id={`accordion-item-${groupSlug}`}
                        label={title}
                        startExpanded={expanded}
                        visibleContent={description}
                      >
                        <Box paddingY={2}>
                          {sortedSubgroups.map((subgroup, index) => {
                            const hasSubgroups = sortedSubgroups.length > 1
                            return (
                              <React.Fragment key={subgroup}>
                                {hasSubgroups && (
                                  <Typography
                                    variant="h5"
                                    paddingBottom={3}
                                    paddingTop={index === 0 ? 0 : 3}
                                  >
                                    {subgroup}
                                  </Typography>
                                )}
                                <Stack space={2}>
                                  {articlesBySubgroup[subgroup].map(
                                    ({ title, slug }) => {
                                      return (
                                        <NextLink
                                          key={slug}
                                          href={`${makePath('article')}/[slug]`}
                                          as={makePath('article', slug)}
                                          passHref
                                        >
                                          <LinkCard>{title}</LinkCard>
                                        </NextLink>
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
        <Stack space={[3, 3, 4]}>
          <Breadcrumbs>
            <Link href={makePath()}>Ísland.is</Link>
          </Breadcrumbs>
          <Hidden above="md">
            <Select
              label="Þjónustuflokkar"
              defaultValue={{
                label: category.title,
                value: category.slug,
              }}
              onChange={({ value }: Option) => {
                const slug = value as string

                Router.push(
                  `${makePath('category')}/[slug]`,
                  makePath('category', slug),
                )
              }}
              options={categoryOptions}
              name="categories"
            />
          </Hidden>
          <Typography variant="h1" as="h1">
            {category.title}
          </Typography>
          <Typography variant="intro" as="p">
            {category.description}
          </Typography>
        </Stack>
      </CategoryLayout>
    </>
  )
}

Category.getInitialProps = async ({ apolloClient, locale, query }) => {
  const slug = query.slug as string

  const [
    {
      data: { articlesInCategory: articles },
    },
    {
      data: { categories },
    },
    namespace,
  ] = await Promise.all([
    apolloClient.query<GetArticlesInCategoryQuery, QueryArticlesInCategoryArgs>(
      {
        query: GET_ARTICLES_IN_CATEGORY_QUERY,
        variables: {
          category: {
            slug,
            language: locale as ContentLanguage,
          },
        },
      },
    ),
    apolloClient.query<GetCategoriesQuery, QueryCategoriesArgs>({
      query: GET_CATEGORIES_QUERY,
      variables: {
        input: {
          language: locale as ContentLanguage,
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
    categories,
    namespace,
  }
}

export default Category
