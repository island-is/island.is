/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useRef } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Screen } from '../../../types'
import {
  Card,
  CardTagsProps,
  ServiceWebHeader,
} from '@island.is/web/components'
import cn from 'classnames'
import {
  Box,
  Text,
  Stack,
  Breadcrumbs,
  Pagination,
  Link,
} from '@island.is/island-ui/core'
import { useI18n } from '@island.is/web/i18n'
import { useNamespace } from '@island.is/web/hooks'
import {
  GET_NAMESPACE_QUERY,
  GET_SUPPORT_SEARCH_RESULTS_QUERY,
} from '../../queries'
import { CustomNextError } from '@island.is/web/units/errors'
import { withMainLayout } from '@island.is/web/layouts/main'
import {
  QuerySearchResultsArgs,
  ContentLanguage,
  QueryGetNamespaceArgs,
  GetNamespaceQuery,
  SearchableContentTypes,
  SupportQna,
  GetSupportSearchResultsQuery,
} from '../../../graphql/schema'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import * as styles from './ServiceSearch.treat'
import * as sharedStyles from '../shared/styles.treat'
import ContactBanner from '../ContactBanner/ContactBanner'
import { SearchInput } from '@island.is/web/components/ServiceWeb/SearchInput/SearchInput'

const PERPAGE = 10

interface CategoryProps {
  q: string
  page: number
  searchResults: GetSupportSearchResultsQuery['searchResults']
  namespace: GetNamespaceQuery['getNamespace']
}

const ServiceSearch: Screen<CategoryProps> = ({
  q,
  page,
  searchResults,
  namespace,
}) => {
  const { activeLocale } = useI18n()
  const searchRef = useRef<HTMLInputElement | null>(null)
  const Router = useRouter()
  const n = useNamespace(namespace)
  const { linkResolver } = useLinkResolver()

  const searchResultsItems = (searchResults.items as Array<SupportQna>).map(
    (item) => ({
      title: item.question,
      parentTitle: item.organization?.title,
      description: item.organization?.description,
      link: {
        href:
          linkResolver('helpdeskcategory', [
            item.organization.slug,
            item.category.slug,
          ]).href + `?&q=${item.slug}`,
      },
      categorySlug: item.category.slug,
      category: item.category.title,
      labels: [item.category.title],
    }),
  )

  const totalSearchResults = searchResults.total
  const totalPages = Math.ceil(totalSearchResults / PERPAGE)

  return (
    <>
      <Head>
        <title>{n('searchResults', 'Leitarniðurstöður')} | Ísland.is</title>
      </Head>
      <ServiceWebHeader logoTitle={'Þjónustuvefur - Leit'} />
      <div className={cn(sharedStyles.bg, sharedStyles.bgSmall)} />

      <Box
        margin={[3, 3, 10]}
        className={styles.searchResultContent}
        width="half"
      >
        <Stack space={[3, 3, 4]}>
          <Breadcrumbs
            items={[
              {
                title: 'Þjónustuvefur',
                href: linkResolver('helpdesk').href,
              },
              {
                title: 'Leit',
                href: linkResolver('helpdesksearch').href,
              },
            ]}
          />

          <SearchInput
            id="search_input_search_page"
            ref={searchRef}
            size="large"
            quickContentLabel={n('quickContentLabel', 'Beint að efninu')}
            activeLocale={activeLocale}
            initialInputValue={q}
            autosuggest={false}
          />

          {searchResultsItems.length === 0 ? (
            <>
              <Text variant="intro" as="p">
                {n('nothingFoundWhenSearchingFor', 'Ekkert fannst við leit á')}{' '}
                <strong>{q}</strong>
              </Text>

              <Text variant="intro" as="p">
                {n('nothingFoundExtendedExplanation')}
              </Text>
            </>
          ) : (
            <Box marginBottom={2}>
              <Text variant="intro" as="p">
                {totalSearchResults}{' '}
                {totalSearchResults === 1
                  ? n('searchResult', 'leitarniðurstaða')
                  : n('searchResults', 'leitarniðurstöður')}{' '}
              </Text>
            </Box>
          )}
        </Stack>
        <Stack space={2}>
          {searchResultsItems.map(({ labels, parentTitle, ...rest }, index) => {
            const tags: Array<CardTagsProps> = []

            labels.forEach((label) => {
              tags.push({
                title: label,
                tagProps: {
                  outlined: true,
                },
              })
            })

            return (
              <Card key={index} tags={tags} subTitle={parentTitle} {...rest} />
            )
          })}{' '}
          {totalSearchResults > 0 && (
            <Box paddingTop={8}>
              <Pagination
                page={page}
                totalPages={totalPages}
                renderLink={(page, className, children) => (
                  <Link
                    href={{
                      pathname: linkResolver('helpdesksearch').href,
                      query: { ...Router.query, page },
                    }}
                  >
                    <span className={className}>{children}</span>
                  </Link>
                )}
              />
            </Box>
          )}
        </Stack>
      </Box>
      <Box marginY={[10, 10, 20]} marginX={[3, 3, 10]}>
        <ContactBanner />
      </Box>
    </>
  )
}

const single = <T,>(x: T | T[]): T => (Array.isArray(x) ? x[0] : x)

ServiceSearch.getInitialProps = async ({ apolloClient, locale, query }) => {
  const queryString = single(query.q) || ''
  const page = Number(single(query.page)) || 1

  const types = ['webQNA' as SearchableContentTypes]

  const [
    {
      data: { searchResults },
    },
    namespace,
  ] = await Promise.all([
    apolloClient.query<GetSupportSearchResultsQuery, QuerySearchResultsArgs>({
      query: GET_SUPPORT_SEARCH_RESULTS_QUERY,
      variables: {
        query: {
          language: locale as ContentLanguage,
          queryString,
          types,
          size: PERPAGE,
          page,
        },
      },
    }),
    apolloClient
      .query<GetNamespaceQuery, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: {
            namespace: 'Search',
            lang: locale,
          },
        },
      })
      .then((variables) => {
        // map data here to reduce data processing in component
        return JSON.parse(variables.data.getNamespace.fields)
      }),
  ])

  if (searchResults.items.length === 0 && page > 1) {
    throw new CustomNextError(404)
  }

  return {
    q: queryString,
    searchResults,
    namespace,
    showSearchInHeader: false,
    page,
  }
}

export default withMainLayout(ServiceSearch, { showHeader: false })
