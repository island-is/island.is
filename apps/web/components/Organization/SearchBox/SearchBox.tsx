import React, { useEffect, useState } from 'react'
import { useDebounce } from 'react-use'
import { useRouter } from 'next/router'
import { useLazyQuery } from '@apollo/client'

import {
  AsyncSearch,
  AsyncSearchOption,
  Box,
  Button,
  ResponsiveSpace,
  Text,
} from '@island.is/island-ui/core'
import { trackSearchQuery } from '@island.is/plausible'
import {
  Query,
  QueryGetArticlesArgs,
  SortField,
} from '@island.is/web/graphql/schema'
import { LinkType, useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import { GET_ORGANIZATION_SERVICES_QUERY } from '@island.is/web/screens/queries'

interface AsyncSearchOptionWithIsArticleField extends AsyncSearchOption {
  isArticle: boolean
}

interface SearchBoxProps {
  id?: string
  organizationSlug: string
  placeholder: string
  noResultsText: string
  searchAllText: string
  marginTop?: ResponsiveSpace
}

export const SearchBox = ({
  id = 'id',
  organizationSlug,
  placeholder,
  noResultsText,
  searchAllText,
  marginTop = 0,
}: SearchBoxProps) => {
  const { linkResolver } = useLinkResolver()
  const router = useRouter()

  const [value, setValue] = useState('')
  const [options, setOptions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [waitingForNextPageToLoad, setWaitingForNextPageToLoad] =
    useState(false)

  const [fetch, { data, loading }] = useLazyQuery<Query, QueryGetArticlesArgs>(
    GET_ORGANIZATION_SERVICES_QUERY,
  )

  useDebounce(
    () => {
      if (value) {
        fetch({
          variables: {
            input: {
              lang: router.asPath.includes('/en/') ? 'en' : 'is',
              organization: organizationSlug,
              size: 500,
              sort: SortField.Popular,
            },
          },
        })
      }
      setIsLoading(false)
    },
    300,
    [value],
  )

  const items = data?.getArticles?.map((item, index) => ({
    label: item.title,
    value: item.slug,
    isArticle: true,
    component: ({ active }: { active: boolean }) => {
      return (
        <Box
          key={`article-${item.id ?? ''}-${index}`}
          cursor="pointer"
          outline="none"
          paddingX={2}
          paddingY={1}
          role="button"
          background={active ? 'blue100' : 'white'}
          onClick={() => {
            trackSearchQuery(value, 'Organization Sidebar Suggestion')
            setOptions([])
          }}
        >
          <Text as="span">{item.title}</Text>
        </Box>
      )
    },
  }))

  const clearAll = () => {
    setIsLoading(false)
    setOptions([])
  }

  const handleOptionSelect = (
    selectedItem: AsyncSearchOptionWithIsArticleField,
    value: string,
  ) => {
    setOptions([])
    if (!value) return
    setWaitingForNextPageToLoad(true)

    let pathname: string
    let searchAll = false

    if (selectedItem && selectedItem?.isArticle) {
      const newValue = selectedItem.value
      pathname = linkResolver('Article' as LinkType, [newValue]).href
      setValue(selectedItem.label)
    } else {
      pathname = linkResolver('search').href
      searchAll = true
    }

    router
      .push({
        pathname,
        query: searchAll ? { q: value } : {},
      })
      .then(() => window.scrollTo(0, 0))
  }

  const updateOptions = () => {
    const newOpts = items
      ? items
          .filter(
            (item) =>
              value && item.label.toLowerCase().includes(value.toLowerCase()),
          )
          .slice(0, 5)
      : []

    if (!value) {
      clearAll()
    }

    setOptions(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore make web strict
      newOpts.length
        ? newOpts.concat({
            label: value,
            value: '',
            isArticle: false,
            component: ({ active }: { active: boolean }) => (
              <Box
                padding={2}
                background={active ? 'blue100' : 'white'}
                cursor="pointer"
              >
                <Button
                  type="button"
                  variant="text"
                  onClick={() => {
                    setWaitingForNextPageToLoad(true)
                    router
                      .push({
                        pathname: linkResolver('search').href,
                        query: { q: value },
                      })
                      .then(() => window.scrollTo(0, 0))
                  }}
                >
                  {searchAllText}
                </Button>
              </Box>
            ),
          })
        : [
            {
              label: value,
              value: '',
              isArticle: false,
              component: () => (
                <Box padding={2} disabled>
                  <Text as="span">{noResultsText}</Text>
                  <Box cursor="pointer">
                    <Button
                      type="button"
                      variant="text"
                      onClick={() => {
                        setWaitingForNextPageToLoad(true)
                        router
                          .push({
                            pathname: linkResolver('search').href,
                            query: { q: value },
                          })
                          .then(() => window.scrollTo(0, 0))
                      }}
                    >
                      {searchAllText}
                    </Button>
                  </Box>
                </Box>
              ),
            },
          ],
    )
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(updateOptions, [value, loading, data])

  const busy = loading || isLoading || waitingForNextPageToLoad

  return (
    <Box marginTop={marginTop}>
      <AsyncSearch
        id={`organization-search-box-${id}`}
        size={'medium'}
        colored={false}
        key="island-organization"
        placeholder={placeholder}
        options={options}
        loading={busy}
        initialInputValue={''}
        inputValue={value}
        onInputValueChange={(newValue) => {
          setIsLoading(newValue !== value)
          setValue(newValue ?? '')
        }}
        closeMenuOnSubmit
        onSubmit={(value, selectedOption) => {
          handleOptionSelect(
            selectedOption as AsyncSearchOptionWithIsArticleField,
            value,
          )
        }}
        onChange={(i, option) => {
          handleOptionSelect(
            option.selectedItem as AsyncSearchOptionWithIsArticleField,
            value,
          )
        }}
      />
    </Box>
  )
}
