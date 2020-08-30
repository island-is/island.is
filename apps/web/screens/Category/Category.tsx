/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Head from 'next/head'
import {
  Typography,
  Stack,
  Breadcrumbs,
  Hidden,
  Select,
  AccordionCard,
  LinkCard,
  Option,
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
import {
  QueryGetNamespaceArgs,
  Query,
  ContentLanguage,
  QueryArticlesInCategoryArgs,
  QueryCategoriesArgs,
} from '@island.is/api/schema'
import { useNamespace } from '@island.is/web/hooks'

interface CategoryProps {
  articles: Query['articlesInCategory']
  categories: Query['categories']
  namespace: Query['getNamespace']
}

const Category: Screen<CategoryProps> = ({
  articles,
  categories,
  namespace,
}) => {
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
              {Object.keys(groups).map((groupSlug, index) => {
                const { title, description, articles } = groups[groupSlug]

                return (
                  <AccordionCard
                    key={groupSlug}
                    id={`accordion-${index}`}
                    label={title}
                    visibleContent={description}
                  >
                    <Stack space={2}>
                      {articles.map(({ title, slug }, index) => {
                        return (
                          <Link
                            key={index}
                            href={`${makePath('article')}/[slug]`}
                            as={makePath('article', slug)}
                            passHref
                          >
                            <LinkCard>{title}</LinkCard>
                          </Link>
                        )
                      })}
                    </Stack>
                  </AccordionCard>
                )
              })}
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
            <Link href={makePath()}>
              <a>Ísland.is</a>
            </Link>
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
    apolloClient.query<Query, QueryArticlesInCategoryArgs>({
      query: GET_ARTICLES_IN_CATEGORY_QUERY,
      variables: {
        category: {
          slug,
          language: locale as ContentLanguage,
        },
      },
    }),
    apolloClient.query<Query, QueryCategoriesArgs>({
      query: GET_CATEGORIES_QUERY,
      variables: {
        input: {
          language: locale as ContentLanguage,
        },
      },
    }),
    apolloClient
      .query<Query, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: {
            namespace: 'Categories',
            lang: locale,
          },
        },
      })
      .then((variables) => JSON.parse(variables.data.getNamespace.fields)),
  ])

  return {
    articles,
    categories,
    namespace,
  }
}

export default Category
