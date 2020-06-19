import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useApolloClient } from 'react-apollo'
import { GET_SEARCH_RESULTS_QUERY } from '@island.is/web/screens/queries'
import {
  ContentLanguage,
  QuerySearchResultsArgs,
  Query,
} from '@island.is/api/schema'
import {
  AsyncSearch,
  AsyncSearchOption,
  Typography,
  Box,
} from '@island.is/island-ui/core'

interface SearchInputProps {
  activeLocale: string
  initialInputValue?: string
  onSubmit?: (inputValue: string, selectedOption: AsyncSearchOption) => void
}

export const SearchInput = ({
  activeLocale,
  initialInputValue,
  onSubmit,
}: SearchInputProps) => {
  const [options, setOptions] = useState([])
  const [prevOptions, setPrevOptions] = useState([])
  const [queryString, setQueryString] = useState('')
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState<boolean>(false)
  const client = useApolloClient()
  const isFirstRun = useRef(true)
  const timer = useRef(null)

  const fetchData = useCallback(async () => {
    const {
      data: { searchResults },
    } = await client.query<Query, QuerySearchResultsArgs>({
      query: GET_SEARCH_RESULTS_QUERY,
      variables: {
        query: {
          queryString: queryString ? `${queryString}*` : '',
          language: activeLocale as ContentLanguage,
        },
      },
    })

    setOptions(
      searchResults.items.map((x) => ({
        label: x.title,
        value: x.slug,
        component: (props) => (
          <ItemContainer {...props}>
            <Typography
              variant="eyebrow"
              as="span"
              color={props.active ? 'blue400' : 'dark400'}
            >
              {x.category} {x.group}
            </Typography>
            <Typography variant="intro" as="span">
              {x.title}
            </Typography>
          </ItemContainer>
        ),
      })),
    )

    setLoading(false)
  }, [queryString, activeLocale, client])

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false
      return
    }

    fetchData()
  }, [queryString, fetchData])

  useEffect(() => {
    if (options.length) {
      setPrevOptions(options)
    }
  }, [options])

  return (
    <AsyncSearch
      size="large"
      placeholder="Leitaðu á Ísland.is"
      initialInputValue={initialInputValue}
      inputValue={inputValue}
      onInputValueChange={(value) => {
        setInputValue(value)
        clearTimeout(timer.current)
        setLoading(false)

        if (value === '') {
          setOptions([])
        } else if (value === queryString) {
          setOptions(prevOptions)
        } else {
          setLoading(true)
          timer.current = setTimeout(() => setQueryString(value), 300)
        }
      }}
      onSubmit={onSubmit}
      options={options}
      loading={loading}
      closeMenuOnSubmit
      colored
    />
  )
}

const ItemContainer = ({ active, colored, children }) => {
  const activeColor = colored ? 'white' : 'blue100'
  const inactiveColor = colored ? 'blue100' : 'white'

  return (
    <Box
      display="flex"
      background={active ? activeColor : inactiveColor}
      flexDirection="column"
      padding={2}
      paddingY={3}
    >
      {children}
    </Box>
  )
}

export default SearchInput
