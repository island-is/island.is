import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/router'
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
  AsyncSearchSizes,
  Typography,
  Box,
} from '@island.is/island-ui/core'
import { Locale } from '@island.is/web/i18n/I18n'
import useRouteNames from '@island.is/web/i18n/useRouteNames'
import { input } from 'libs/island-ui/core/src/lib/AsyncSearch/shared/Input/Input.treat'

interface SearchInputProps {
  activeLocale: string
  initialInputValue?: string
  size?: AsyncSearchSizes
  autocomplete?: boolean
  onSubmit?: (inputValue: string, selectedOption: AsyncSearchOption) => void
}

export const SearchInput = ({
  activeLocale,
  initialInputValue,
  size = 'medium',
  autocomplete = true,
  onSubmit,
}: SearchInputProps) => {
  const Router = useRouter()
  const [options, setOptions] = useState([])
  const [prevOptions, setPrevOptions] = useState([])
  const [queryString, setQueryString] = useState('')
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState<boolean>(false)
  const client = useApolloClient()
  const isFirstRun = useRef(true)
  const timer = useRef(null)
  const { makePath } = useRouteNames(activeLocale as Locale)

  const insert = (mainStr: string, insStr: string, pos: number) => {
    if (typeof pos == 'undefined') {
      pos = 0
    }

    if (typeof insStr == 'undefined') {
      insStr = ''
    }

    return mainStr.slice(0, pos) + insStr + mainStr.slice(pos)
  }

  const defaultOnSubmit = (inputValue, selectedOption) => {
    const cleanInputValue = cleanString(inputValue)

    if (selectedOption) {
      return Router.push(
        `${makePath('article')}/[slug]`,
        makePath('article', selectedOption.value),
      )
    }

    return Router.push({
      pathname: makePath('search'),
      query: { q: cleanInputValue },
    })
  }

  const cleanString = (string: string) => {
    const regex = /[a-zA-Z\u00C0-\u00FF]+/
    const words = [...queryString['matchAll'](new RegExp(regex, 'gi'))]
    return words.join(' ')
  }

  const fetchData = useCallback(async () => {
    const cleanedQueryString = cleanString(queryString)

    const {
      data: { searchResults },
    } = await client.query<Query, QuerySearchResultsArgs>({
      query: GET_SEARCH_RESULTS_QUERY,
      variables: {
        query: {
          queryString: cleanedQueryString ? `${cleanedQueryString}*` : '',
          language: activeLocale as ContentLanguage,
        },
      },
    })

    setOptions(
      searchResults.items.map((x) => ({
        label: x.title,
        value: x.slug,
        component: (props) => {
          const qs = cleanedQueryString.toLowerCase()
          const str = x.title.toLowerCase()

          const indexes = [...str['matchAll'](new RegExp(qs, 'gi'))]
            .map((a) => a.index)
            .reverse()

          let newStr = `<strong>${x.title}</strong>`

          indexes.forEach((idx) => {
            const newIdx = idx + 8
            newStr = insert(newStr, '</strong>', newIdx)
            newStr = insert(newStr, '<strong>', newIdx + 9 + qs.length)
          })

          const optionString = newStr

          return (
            <ItemContainer {...props}>
              <span dangerouslySetInnerHTML={{ __html: optionString }} />
            </ItemContainer>
          )
        },
      })),
    )

    setLoading(false)
  }, [queryString, activeLocale, client])

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false
      return
    }

    if (autocomplete) {
      fetchData()
    }
  }, [autocomplete, queryString, fetchData])

  useEffect(() => {
    if (options.length) {
      setPrevOptions(options)
    }
  }, [options])

  return (
    <AsyncSearch
      size={size}
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
          if (autocomplete) {
            setLoading(true)
          }

          timer.current = setTimeout(() => setQueryString(value), 30)
        }
      }}
      onSubmit={onSubmit || defaultOnSubmit}
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
