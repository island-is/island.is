import React, { useEffect, useState } from 'react'
import { Box, AsyncSearch, Text } from '@island.is/island-ui/core'
import { useQuery } from '@apollo/client'
import {
  Query,
  QueryGetArticlesArgs,
  SortField,
} from '@island.is/web/graphql/schema'
import { GET_ORGANIZATION_SERVICES_QUERY } from '@island.is/web/screens/queries'
import { LinkType, useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import { useRouter } from 'next/router'

interface SearchBoxProps {
  organizationPage: Query['getOrganizationPage']
  placeholder: string
  noResultsText: string
  searchAllText: string
}

export const SearchBox = ({
  organizationPage,
  placeholder,
  noResultsText,
}: SearchBoxProps) => {
  const { linkResolver } = useLinkResolver()
  const Router = useRouter()

  const { data, loading } = useQuery<Query, QueryGetArticlesArgs>(
    GET_ORGANIZATION_SERVICES_QUERY,
    {
      variables: {
        input: {
          lang: 'is',
          organization: organizationPage.slug,
          size: 500,
          sort: SortField.Popular,
        },
      },
    },
  )

  const items = data?.getArticles?.map((item, index) => ({
    label: item.title,
    value: item.slug,
    component: ({ active }) => {
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
          }}
        >
          <Text as="span">{item.title}</Text>
        </Box>
      )
    },
  }))

  const [value, setValue] = useState('')
  const [options, setOptions] = useState([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const busy = loading || isLoading

  const clearAll = () => {
    setIsLoading(false)
    setOptions([])
  }

  useEffect(() => {
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
      newOpts.length
        ? newOpts
        : [
            {
              component: () => (
                <Box padding={2} background="blue100" disabled>
                  <Text as="span">{noResultsText}</Text>
                </Box>
              ),
            },
          ],
    )
  }, [value])

  return (
    <Box marginTop={3}>
      <AsyncSearch
        size={'medium'}
        colored={false}
        key="island-organization"
        placeholder={placeholder}
        options={options}
        loading={busy}
        initialInputValue={''}
        inputValue={value}
        onInputValueChange={(value) => {
          setIsLoading(true)
          setValue(value)
        }}
        closeMenuOnSubmit
        onSubmit={(value, selectedOption) => {
          setOptions([])

          value &&
            Router.push({
              pathname: selectedOption
                ? linkResolver('Article' as LinkType, [selectedOption.value])
                    .href
                : linkResolver('search').href,
              query: { q: value },
            })
        }}
        onChange={(i, option) => {
          setOptions([])

          value &&
            Router.push({
              pathname: linkResolver('Article' as LinkType, [
                option.selectedItem.value,
              ]).href,
              query: { q: value.toLowerCase() },
            })
        }}
      />
    </Box>
  )
}
