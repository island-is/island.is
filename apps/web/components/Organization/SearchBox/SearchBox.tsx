import React, { useEffect, useState } from 'react'
import { Box, AsyncSearch, Text, Button } from '@island.is/island-ui/core'
import { useLazyQuery } from '@apollo/client'
import {
  Query,
  QueryGetArticlesArgs,
  SortField,
} from '@island.is/web/graphql/schema'
import { GET_ORGANIZATION_SERVICES_QUERY } from '@island.is/web/screens/queries'
import { LinkType, useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import { useRouter } from 'next/router'
import { useDebounce } from 'react-use'

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
  searchAllText
}: SearchBoxProps) => {
  const { linkResolver } = useLinkResolver()
  const Router = useRouter()

  const [value, setValue] = useState('')
  const [options, setOptions] = useState([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [fetch, { data }] = useLazyQuery<Query, QueryGetArticlesArgs>(
    GET_ORGANIZATION_SERVICES_QUERY)

  useDebounce(
    () => {
      if (value) {
        fetch({
          variables: {
            input: {
              lang: 'is',
              organization: organizationPage.slug,
              size: 500,
              sort: SortField.Popular,
            },
          },
        })

        setIsLoading(false)
      }
    },
    300,
    [value],
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
          paddingX={2}
          paddingY={1}
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
        .concat(
          {
            label: 'searchAll',
            value: '',
            component: () => (
              <Box padding={2}>
                <Button
                  type="button"
                  variant="text"
                  onClick={() =>
                    Router.push({
                      pathname: linkResolver('search').href,
                      query: { q: value },
                    })
                  }
                >
                  {searchAllText}
                </Button>
              </Box>
            )
          }
        )
        : [
            {
              component: () => (
                <Box padding={2} disabled>
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
        loading={isLoading}
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
