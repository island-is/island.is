import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useDebounce } from 'react-use'
import { useLazyQuery } from '@apollo/client'

import {
  AsyncSearch,
  AsyncSearchOption,
  AsyncSearchProps,
  Text,
  Box,
} from '@island.is/island-ui/core'
import { GET_SUPPORT_SEARCH_RESULTS_QUERY } from '@island.is/web/screens/queries'
import { useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import {
  GetSupportSearchResultsQuery,
  GetSupportSearchResultsQueryVariables,
  SearchableContentTypes,
  SupportQna,
} from '@island.is/web/graphql/schema'

interface SearchInputProps {
  title?: string
  size?: AsyncSearchProps['size']
  logoTitle?: string
  logoUrl?: string
  colored?: boolean
  initialInputValue?: string
}

const unused = ['.', '?', ':', ',', ';', '!', '-', '_', '#']

export const ModifySearchTerms = (searchTerms: string) =>
  searchTerms
    .split(' ')
    .filter((x) => x)
    .reduce((sum, cur) => {
      const s = unused.reduce((a, b) => {
        return a.replace(b, '')
      }, cur)
      return sum ? `${sum}|${s}~` : s ? `${s}~` : ''
    }, '')

export const SearchInput = ({
  colored = false,
  size = 'large',
  initialInputValue = '',
}: SearchInputProps) => {
  const [searchTerms, setSearchTerms] = useState<string>('')
  const [activeItem, setActiveItem] = useState<SupportQna>()
  const [lastSearchTerms, setLastSearchTerms] = useState<string>('')
  const [options, setOptions] = useState<AsyncSearchOption[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { linkResolver } = useLinkResolver()
  const Router = useRouter()

  const [fetch, { loading, data }] = useLazyQuery<
    GetSupportSearchResultsQuery,
    GetSupportSearchResultsQueryVariables
  >(GET_SUPPORT_SEARCH_RESULTS_QUERY, {
    onCompleted: () => {
      updateOptions()
    },
  })

  useDebounce(
    () => {
      if (searchTerms) {
        const queryString = ModifySearchTerms(searchTerms)

        if (searchTerms === lastSearchTerms) {
          updateOptions()
        } else {
          fetch({
            variables: {
              query: {
                queryString,
                types: [SearchableContentTypes['WebQna']],
              },
            },
          })
        }

        setLastSearchTerms(searchTerms)
      }
    },
    300,
    [searchTerms],
  )

  const clearAll = () => {
    setIsLoading(false)
    setOptions([])
  }

  useEffect(() => {
    if (!searchTerms) {
      clearAll()
    }
  }, [searchTerms])

  const onSelect = ({ slug, organization, category }: SupportQna) => {
    const organizationSlug = organization?.slug ?? ''
    const categorySlug = category?.slug ?? ''

    if (organizationSlug && categorySlug) {
      Router.push({
        pathname: `${
          linkResolver('helpdesk').href
        }/${organizationSlug}/${categorySlug}`,
        query: { q: slug },
      })
    }
  }

  const updateOptions = () => {
    setOptions(
      ((data?.searchResults?.items as Array<SupportQna>) || []).map(
        (item, index) => ({
          label: item.title,
          value: item.slug,
          component: ({ active }) => {
            if (active) {
              setActiveItem(item)
            }

            return (
              <Box
                key={index}
                cursor="pointer"
                outline="none"
                padding={2}
                role="button"
                background={active ? 'white' : 'blue100'}
                onClick={() => {
                  setOptions([])
                  onSelect(item)
                }}
              >
                <Text as="span">{item.title}</Text>
              </Box>
            )
          },
        }),
      ),
    )
    setIsLoading(false)
  }

  const busy = loading || isLoading

  return (
    <AsyncSearch
      size={size}
      colored={colored}
      key="island-helpdesk"
      placeholder="Leitaðu á þjónustuvefnum"
      options={options}
      loading={busy}
      initialInputValue={initialInputValue}
      inputValue={searchTerms}
      onInputValueChange={(value) => {
        setIsLoading(true)
        setSearchTerms(value)
      }}
      closeMenuOnSubmit
      onSubmit={(value, selectedOption) => {
        setOptions([])

        if (selectedOption && activeItem) {
          return onSelect(activeItem)
        }

        Router.push({
          pathname: linkResolver('helpdesksearch').href,
          query: { q: value },
        })
      }}
    />
  )
}
