import React from 'react'

import { CategoryItems } from '@island.is/web/components'
import {
  ContentLanguage,
  GetArticleCategoriesQuery,
  GetNamespaceQuery,
  QueryGetArticleCategoriesArgs,
  QueryGetNamespaceArgs,
} from '@island.is/web/graphql/schema'
import { useNamespaceStrict } from '@island.is/web/hooks'
import { withMainLayout } from '@island.is/web/layouts/main'
import { Screen } from '@island.is/web/types'

import { GET_CATEGORIES_QUERY, GET_NAMESPACE_QUERY } from '../../queries'

interface CategoriesProps {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  categories
  namespace: Record<string, string>
}

const Categories: Screen<CategoriesProps> = ({ categories, namespace }) => {
  const n = useNamespaceStrict(namespace)
  return (
    <CategoryItems
      heading={n('categoriesScreenHeader', 'Þjónustuflokkar')}
      headingId="categories-title"
      items={categories}
    />
  )
}

Categories.getProps = async ({ apolloClient, locale }) => {
  const [
    {
      data: { getArticleCategories },
    },
    namespace,
  ] = await Promise.all([
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
      .then((res) => JSON.parse(res?.data?.getNamespace?.fields || '{}')),
  ])

  return {
    categories: getArticleCategories,
    namespace,
  }
}

export default withMainLayout(Categories)
