/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { withApollo } from '../../graphql'
import { Screen } from '../../types'
import {
  Sidebar,
  SearchInput,
  Card,
  CardTagsProps,
} from '@island.is/web/components'
import { selectOptions } from '@island.is/web/json'
import {
  ContentBlock,
  Box,
  Typography,
  Stack,
  Breadcrumbs,
  Hidden,
  Select,
  Divider,
} from '@island.is/island-ui/core'
import { useI18n } from '@island.is/web/i18n'
import { useNamespace } from '@island.is/web/hooks'
import {
  ContentLanguage,
  QueryGetNamespaceArgs,
  Query,
  QuerySearchResultsArgs,
} from '@island.is/api/schema'
import {
  GET_NAMESPACE_QUERY,
  GET_SEARCH_RESULTS_QUERY_DETAILED,
} from '../queries'
import useRouteNames from '@island.is/web/i18n/useRouteNames'
import { Locale } from '@island.is/web/i18n/I18n'

import * as styles from '../Category/Category.treat'

interface CategoryProps {
  q: string
  searchResults: Query['searchResults']
  namespace: Query['getNamespace']
}

const Search: Screen<CategoryProps> = ({ q, searchResults, namespace }) => {
  const { activeLocale } = useI18n()
  const Router = useRouter()
  const n = useNamespace(namespace)
  const { makePath } = useRouteNames(activeLocale as Locale)

  const filters = {
    category: Router.query.category,
  }

  const sidebarCategories = searchResults.items.reduce((all, cur) => {
    const key = cur.categorySlug

    const item = all.find((x) => x.key === key)

    if (!item) {
      all.push({
        key,
        total: 1,
        title: cur.category || '',
      })
    } else {
      item.total += 1
    }

    return all
  }, [])

  const items = searchResults.items.map((item) => {
    return {
      title: item.title,
      description: item.content,
      href: makePath('article', '[slug]'),
      as: makePath('article', item.slug),
      categorySlug: item.categorySlug,
      category: item.category,
      group: item.group,
    }
  })

  const onSelectCategory = (key: string) => {
    Router.replace({
      pathname: makePath('search'),
      query: { q, category: key },
    })
  }

  const byCategory = (item) =>
    !filters.category || filters.category === item.categorySlug

  const filteredItems = items.filter(byCategory)

  const categoryTitle = items.find((x) => x.categorySlug === filters.category)
    ?.category

  return (
    <>
      <Head>
        <title>Leitarniðurstöður | Ísland.is</title>
      </Head>
      <ContentBlock>
        <Box padding={[0, 0, 0, 6]}>
          <div className={styles.layout}>
            <div className={styles.side}>
              <Sidebar title={n('submenuTitle')}>
                <Filter
                  selected={!filters.category}
                  onClick={() => onSelectCategory(null)}
                  text={`Allir flokkar (${searchResults.total})`}
                />
                <Divider weight="alternate" />
                {sidebarCategories.map((c, index) => {
                  const selected = c.key === filters.category
                  const text = `${c.title} (${c.total})`

                  return (
                    <Filter
                      key={index}
                      selected={selected}
                      onClick={() => onSelectCategory(c.key)}
                      text={text}
                    />
                  )
                })}
              </Sidebar>
            </div>

            <Box paddingLeft={[0, 0, 0, 4]} width="full">
              <Box padding={[3, 3, 6, 0]}>
                <ContentBlock width="small">
                  <Stack space={[3, 3, 4]}>
                    <Breadcrumbs>
                      <Link href="/">
                        <a>Ísland.is</a>
                      </Link>
                    </Breadcrumbs>
                    <SearchInput
                      size="large"
                      activeLocale={activeLocale}
                      initialInputValue={q}
                    />
                    <Hidden above="md">
                      <Select
                        label="Þjónustuflokkar"
                        placeholder="Flokkar"
                        options={selectOptions}
                        name="search"
                      />
                    </Hidden>
                    <Typography variant="intro" as="p">
                      {filteredItems.length === 0 ? (
                        <span>
                          Ekkert fannst við leit á <strong>{q}</strong>
                        </span>
                      ) : (
                        <span>
                          {filteredItems.length} leitarniðurstöður{' '}
                          {filters.category && (
                            <>
                              í flokki
                              {categoryTitle ? (
                                <>
                                  : <strong>{categoryTitle}</strong>
                                </>
                              ) : (
                                '.'
                              )}
                            </>
                          )}
                        </span>
                      )}
                    </Typography>
                  </Stack>
                </ContentBlock>
              </Box>
              <div className={styles.bg}>
                <Box padding={[3, 3, 6, 0]} paddingTop={[3, 3, 6, 6]}>
                  <ContentBlock width="small">
                    <Stack space={2}>
                      {filteredItems.map((item, index) => {
                        const tags = [] as Array<CardTagsProps>

                        if (item.group) {
                          tags.push({
                            title: item.group,
                            tagProps: {
                              label: true,
                            },
                          })
                        }

                        return <Card key={index} {...item} tags={tags} />
                      })}
                    </Stack>
                  </ContentBlock>
                </Box>
              </div>
            </Box>
          </div>
        </Box>
      </ContentBlock>
    </>
  )
}

Search.getInitialProps = async ({ apolloClient, locale, query }) => {
  const queryString = (query.q as string) || ''

  const [
    {
      data: { searchResults },
    },
    namespace,
  ] = await Promise.all([
    apolloClient.query<Query, QuerySearchResultsArgs>({
      query: GET_SEARCH_RESULTS_QUERY_DETAILED,
      variables: {
        query: {
          queryString: queryString ? `${queryString}*` : '',
          language: locale as ContentLanguage,
        },
      },
    }),
    apolloClient
      .query<Query, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: {
            namespace: 'Articles',
            lang: locale,
          },
        },
      })
      .then((variables) => {
        // map data here to reduce data processing in component
        return JSON.parse(variables.data.getNamespace.fields)
      }),
  ])

  return {
    q: queryString,
    searchResults,
    namespace,
    showSearchInHeader: false,
  }
}

const Filter = ({ selected, text, onClick, ...props }) => {
  return (
    <Box
      component="button"
      type="button"
      textAlign="left"
      outline="none"
      onClick={onClick}
      {...props}
    >
      <Typography variant="p" as="span">
        {selected ? <strong>{text}</strong> : text}
      </Typography>
    </Box>
  )
}
export default withApollo(Search)
