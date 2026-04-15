import React, { useMemo } from 'react'
import NextLink from 'next/link'

import {
  Box,
  Breadcrumbs,
  ColorSchemeContext,
  FocusableBox,
  GridColumn,
  GridContainer,
  GridRow,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import {
  ContentLanguage,
  GetArticleCategoriesQuery,
  GetNamespaceQuery,
  QueryGetArticleCategoriesArgs,
  QueryGetNamespaceArgs,
} from '@island.is/web/graphql/schema'
import { useLinkResolver, useNamespaceStrict } from '@island.is/web/hooks'
import { LinkType } from '@island.is/web/hooks/useLinkResolver'
import { withMainLayout } from '@island.is/web/layouts/main'
import { Screen } from '@island.is/web/types'

import { GET_CATEGORIES_QUERY, GET_NAMESPACE_QUERY } from '../../queries'
import * as styles from './Categories.css'

const EXCLUDED_CATEGORY_SLUGS = ['thjonusta-island-is', 'services-on-island-is']

interface CategoriesProps {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  categories
  namespace: Record<string, string>
}

const Categories: Screen<CategoriesProps> = ({ categories, namespace }) => {
  const n = useNamespaceStrict(namespace)
  const { linkResolver } = useLinkResolver()

  const items = useMemo(
    () =>
      (categories as GetArticleCategoriesQuery['getArticleCategories'])?.filter(
        (item) => !EXCLUDED_CATEGORY_SLUGS.includes(item.slug),
      ) ?? [],
    [categories],
  )

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
                      title: n('categoriesBreadcrumb', 'Þjónustuflokkar'),
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

      <Box background="blue100" display="inlineBlock" width="full">
        <ColorSchemeContext.Provider value={{ colorScheme: 'blue' }}>
          <GridContainer className={styles.listContainer}>
            <Box paddingTop={[4, 4, 8]} paddingBottom={[3, 3, 6]}>
              <GridRow>
                {items.map(
                  ({ title, description, slug, __typename: typename }) => {
                    const href = linkResolver(typename as LinkType, [slug]).href
                    return (
                      <GridColumn
                        key={slug}
                        span={['12/12', '6/12', '6/12', '4/12']}
                        paddingBottom={3}
                      >
                        <FocusableBox
                          href={href}
                          display="flex"
                          flexDirection="column"
                          paddingTop={2}
                          paddingRight={2}
                          paddingBottom={3}
                          paddingLeft={3}
                          borderRadius="large"
                          borderColor="blue200"
                          borderWidth="standard"
                          height="full"
                          width="full"
                          background="white"
                          color="blue"
                          className={styles.card}
                        >
                          <Text as="h3" variant="h4" color="dark400" truncate>
                            {title}
                          </Text>
                          {description && (
                            <Text
                              paddingTop={2}
                              variant="medium"
                              fontWeight="light"
                            >
                              {description}
                            </Text>
                          )}
                        </FocusableBox>
                      </GridColumn>
                    )
                  },
                )}
              </GridRow>
            </Box>
          </GridContainer>
        </ColorSchemeContext.Provider>
      </Box>
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

export default withMainLayout(Categories, {
  showFooterIllustration: true,
})
