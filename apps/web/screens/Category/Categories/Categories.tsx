import React from 'react'
import NextLink from 'next/link'

import {
  Box,
  Breadcrumbs,
  GridColumn,
  GridContainer,
  GridRow,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { CategoryItems } from '@island.is/web/components'
import {
  ContentLanguage,
  GetArticleCategoriesQuery,
  GetNamespaceQuery,
  QueryGetArticleCategoriesArgs,
  QueryGetNamespaceArgs,
} from '@island.is/web/graphql/schema'
import { useLinkResolver, useNamespaceStrict } from '@island.is/web/hooks'
import { withMainLayout } from '@island.is/web/layouts/main'
import { Screen } from '@island.is/web/types'

import { GET_CATEGORIES_QUERY, GET_NAMESPACE_QUERY } from '../../queries'
import * as styles from './Categories.css'

interface CategoriesProps {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  categories
  namespace: Record<string, string>
}

const Categories: Screen<CategoriesProps> = ({ categories, namespace }) => {
  const n = useNamespaceStrict(namespace)
  const { linkResolver } = useLinkResolver()
  return (
    <>
      <Box paddingTop={[2, 2, 2, 8]} paddingBottom={[4, 4, 4, 8]}>
        <GridContainer className={styles.listContainer}>
          <GridRow>
            <GridColumn
              offset={['0', '0', '0', '1/12']}
              span={['12/12', '12/12', '12/12', '10/12']}
            >
              <Stack space={2}>
                <Breadcrumbs
                  items={[
                    {
                      title: 'Ísland.is',
                      href: '/',
                    },
                    {
                      title: n(
                        'categoriesBreadcrumb',
                        'Þjónustuflokkar',
                      ),
                    },
                  ]}
                  renderLink={(link) => {
                    return (
                      <NextLink
                        {...linkResolver('homepage')}
                        passHref
                        legacyBehavior
                      >
                        {link}
                      </NextLink>
                    )
                  }}
                />
                <Text variant="h1" as="h1" className={styles.heading}>
                  {n('categoriesScreenHeader', 'Þjónustuflokkar')}
                </Text>
                <Text variant="intro" className={styles.description}>
                  {n(
                    'categoriesDescription',
                    'Samantekt yfir helstu þjónustu sem fólk þarf á tilteknum tímamótum í lífinu, til að mynda að eignast barn, fara í nám, stofna fyrirtæki og að undirbúa starfslok og efri árin.',
                  )}
                </Text>
              </Stack>
            </GridColumn>
          </GridRow>
        </GridContainer>
      </Box>
      <CategoryItems items={categories} />
    </>
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
