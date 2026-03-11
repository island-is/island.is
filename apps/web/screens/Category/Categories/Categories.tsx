import React, { useMemo, useState } from 'react'
import NextLink from 'next/link'

import {
  Box,
  Breadcrumbs,
  Button,
  ColorSchemeContext,
  FilterInput,
  FocusableBox,
  GridColumn,
  GridContainer,
  GridRow,
  Inline,
  Link,
  RadioButton,
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
import {
  useLinkResolver,
  useNamespaceStrict,
} from '@island.is/web/hooks'
import { LinkType } from '@island.is/web/hooks/useLinkResolver'
import { withMainLayout } from '@island.is/web/layouts/main'
import { Screen } from '@island.is/web/types'

import { GET_CATEGORIES_QUERY, GET_NAMESPACE_QUERY } from '../../queries'
import * as styles from './Categories.css'

type SortOption = 'a-z' | 'z-a'

interface CategoriesProps {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore make web strict
  categories
  namespace: Record<string, string>
}

const Categories: Screen<CategoriesProps> = ({ categories, namespace }) => {
  const n = useNamespaceStrict(namespace)
  const { linkResolver } = useLinkResolver()
  const [searchValue, setSearchValue] = useState('')
  const [sort, setSort] = useState<SortOption>('a-z')

  const allItems =
    (
      categories as GetArticleCategoriesQuery['getArticleCategories']
    )?.filter(
      (item) =>
        item.slug !== 'thjonusta-island-is' &&
        item.slug !== 'services-on-island-is',
    ) ?? []

  const items = useMemo(() => {
    const query = searchValue.toLowerCase()
    const filtered = allItems.filter((item) =>
      item.title.toLowerCase().includes(query),
    )
    return [...filtered].sort((a, b) => {
      const titleA = a.title.toLowerCase()
      const titleB = b.title.toLowerCase()
      return sort === 'a-z'
        ? titleA.localeCompare(titleB, 'is')
        : titleB.localeCompare(titleA, 'is')
    })
  }, [allItems, searchValue, sort])

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
            <Box
              paddingTop={[3, 3, 6]}
              paddingBottom={3}
              display="flex"
              flexDirection={['column', 'column', 'column', 'row', 'row']}
              justifyContent={[
                'flexStart',
                'flexStart',
                'flexStart',
                'spaceBetween',
                'spaceBetween',
              ]}
              alignItems={[
                'stretch',
                'stretch',
                'stretch',
                'center',
                'center',
              ]}
              flexWrap="wrap"
              rowGap={2}
            >
              <Box>
                <FilterInput
                  name="categories-search"
                  placeholder={n('searchPlaceholder', 'Sía eftir leitarorði')}
                  value={searchValue}
                  onChange={setSearchValue}
                  backgroundColor="white"
                />
              </Box>
              <Box>
                <Inline space={3} alignY="center">
                  <RadioButton
                    name="categories-sort"
                    id="categories-sort-a-z"
                    label={n('sortAZ', 'Heiti (A - Ö)')}
                    value="a-z"
                    checked={sort === 'a-z'}
                    onChange={() => setSort('a-z')}
                  />
                  <RadioButton
                    name="categories-sort"
                    id="categories-sort-z-a"
                    label={n('sortZA', 'Heiti (Ö - A)')}
                    value="z-a"
                    checked={sort === 'z-a'}
                    onChange={() => setSort('z-a')}
                  />
                </Inline>
              </Box>
            </Box>
            <Box paddingBottom={[3, 3, 6]}>
              <GridRow>
                {items.map(
                  ({ title, description, slug, __typename: typename }, index) => {
                    const href = linkResolver(typename as LinkType, [slug]).href
                    return (
                      <GridColumn
                        key={index}
                        span={['12/12', '6/12', '6/12', '4/12']}
                        paddingBottom={3}
                      >
                        <FocusableBox
                          href={href}
                          display="flex"
                          flexDirection="column"
                          justifyContent="spaceBetween"
                          paddingY={3}
                          paddingX={3}
                          borderRadius="large"
                          borderColor="blue200"
                          borderWidth="standard"
                          height="full"
                          width="full"
                          background="white"
                          color="blue"
                          className={styles.card}
                        >
                          <Box>
                            <Text as="h3" variant="h4" color="dark400">
                              {title}
                            </Text>
                            {description && (
                              <Text paddingTop={1} variant="default">
                                {description}
                              </Text>
                            )}
                          </Box>
                          <Box paddingTop={2} className={styles.cardLink}>
                            <Link href={href} skipTab>
                              <Button
                                variant="text"
                                as="span"
                                icon="arrowForward"
                                size="small"
                              >
                                {n(
                                  'viewCategoryLink',
                                  'Skoða þjónustuflokk',
                                )}
                              </Button>
                            </Link>
                          </Box>
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
