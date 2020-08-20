import React, {
  FC,
  useState,
  useEffect,
  useCallback,
  useRef,
  forwardRef,
} from 'react'
import Link from 'next/link'
import Downshift from 'downshift'
import cn from 'classnames'
import { uniq, sortBy } from 'lodash'
import { useRouter } from 'next/router'
import { useApolloClient } from 'react-apollo'
import { GET_SEARCH_RESULTS_QUERY } from '@island.is/web/screens/queries'
import {
  ContentLanguage,
  QuerySearchResultsArgs,
  Query,
  SearchResult,
} from '@island.is/api/schema'
import {
  AsyncSearchInput,
  AsyncSearchSizes,
  Box,
  Typography,
  Stack,
} from '@island.is/island-ui/core'
import useRouteNames from '@island.is/web/i18n/useRouteNames'
import * as styles from './SearchInput.treat'
import { Locale } from '@island.is/web/i18n/I18n'

const DEBOUNCE_TIMER = 300

type SearchState = {
  term: string
  results?: SearchResult
  suggestions: string[]
  isLoading: boolean
}

const emptyState: Readonly<SearchState> = {
  term: '',
  suggestions: [],
  isLoading: false,
}

const isEmpty = ({ results, suggestions }: SearchState): boolean =>
  suggestions.length === 0 && (results?.total ?? 0) === 0

const useSearch = (locale: Locale, term?: string): SearchState => {
  const [state, setState] = useState<SearchState>(emptyState)
  const client = useApolloClient()
  const timer = useRef(null)

  useEffect(() => {
    if (term == null) {
      setState(emptyState)
      return
    }

    if (term === '') {
      setState({
        isLoading: false,
        term: '',
        // hardcoded while not supported by search
        suggestions: [
          'Covid-19',
          'Hlutabætur',
          'Atvinnuleysisbætur',
          'Fæðingarorlof',
          'Mannanafnanefnd',
          'Rekstrarleyfi',
          'Heimilisfang',
        ],
      })
      return
    }

    setState({ ...state, isLoading: true })

    const thisTimerId = (timer.current = setTimeout(async () => {
      const {
        data: { searchResults: results },
      } = await client.query<Query, QuerySearchResultsArgs>({
        query: GET_SEARCH_RESULTS_QUERY,
        variables: {
          query: {
            queryString: term,
            language: locale as ContentLanguage,
          },
        },
      })

      if (thisTimerId === timer.current) {
        // hack while not supported by search service
        let suggestions = results.items
          .map((r) => r.title.split(/\s+/g))
          .reduce((acc, words) => acc.concat(words), [])
          .map((s) => s.trim().toLowerCase())
          .filter((s) => s.startsWith(term.trim().toLowerCase()))
        suggestions = sortBy(uniq(suggestions), (s) => s.length)

        setState({
          isLoading: false,
          term,
          results,
          suggestions,
        })
      }
    }, DEBOUNCE_TIMER))

    return () => clearTimeout(thisTimerId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, locale, term, setState])

  return state
}

const useSubmit = (locale: Locale) => {
  const Router = useRouter()
  const { makePath } = useRouteNames(locale)

  return useCallback(
    (q: string) => {
      if (q) {
        Router.push({
          pathname: makePath('search'),
          query: { q },
        }).then(() => {
          window.scrollTo({ top: 0 })
        })
      }
    },
    [Router, makePath],
  )
}

interface SearchInputProps {
  activeLocale: Locale
  initialInputValue?: string
  size?: AsyncSearchSizes
  autocomplete?: boolean
  openOnFocus?: boolean
  placeholder?: string
  white?: boolean
  colored?: boolean
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      placeholder = '',
      activeLocale: locale,
      initialInputValue = '',
      autocomplete = true,
      openOnFocus = false,
      size = 'medium',
      white = false,
      colored = true,
    },
    ref,
  ) => {
    const [searchTerm, setSearchTerm] = useState(initialInputValue)
    const search = useSearch(locale, autocomplete ? searchTerm : null)
    const onSubmit = useSubmit(locale)

    return (
      <Downshift<string>
        id="downshift"
        initialInputValue={initialInputValue}
        onChange={(q) => onSubmit(q)}
        onInputValueChange={(q) => setSearchTerm(q)}
        itemToString={(v) => v ?? ''}
      >
        {({
          highlightedIndex,
          isOpen,
          getRootProps,
          getInputProps,
          getItemProps,
          getMenuProps,
          openMenu,
          closeMenu,
          inputValue,
        }) => (
          <AsyncSearchInput
            ref={ref}
            white={white}
            hasFocus={isOpen}
            loading={search.isLoading}
            rootProps={getRootProps()}
            menuProps={{
              comp: 'div',
              ...getMenuProps(),
            }}
            buttonProps={{
              onClick: () => onSubmit(inputValue),
              onSubmit: () => onSubmit(inputValue),
            }}
            inputProps={getInputProps({
              inputSize: size,
              onFocus: () => openOnFocus && openMenu(),
              placeholder,
              colored,
              onKeyDown: (e) => {
                if (e.key === 'Enter' && highlightedIndex == null) {
                  closeMenu()
                  onSubmit(e.currentTarget.value)
                }
              },
            })}
          >
            {!isEmpty(search) && (
              <Results
                search={search}
                highlightedIndex={highlightedIndex}
                getItemProps={getItemProps}
                locale={locale}
              />
            )}
          </AsyncSearchInput>
        )}
      </Downshift>
    )
  },
)

const Results: FC<{
  locale: Locale
  search: SearchState
  highlightedIndex: number
  getItemProps: any
}> = ({ locale, search, highlightedIndex, getItemProps }) => {
  const { makePath } = useRouteNames(locale)

  if (!search.term) {
    const suggestions = search.suggestions.map((suggestion, i) => (
      <div key={suggestion} {...getItemProps({ item: suggestion })}>
        <Typography color={i === highlightedIndex ? 'blue400' : 'dark400'}>
          {suggestion}
        </Typography>
      </div>
    ))

    const splitAt = Math.min(search.suggestions.length / 2)
    const left = suggestions.slice(0, splitAt)
    const right = suggestions.slice(splitAt)

    return (
      <Box display="flex" background="blue100" paddingY={2} paddingX={3}>
        <div className={styles.menuColumn}>
          <Stack space={2}>
            <Typography variant="eyebrow" color="blue400">
              Algeng leitarorð
            </Typography>
            {left}
          </Stack>
        </div>
        <div className={styles.separator} />
        <div className={styles.menuColumn}>
          <Stack space={2}>{right}</Stack>
        </div>
      </Box>
    )
  }

  return (
    <Box display="flex" background="blue100" paddingY={2} paddingX={3}>
      <div className={styles.menuColumn}>
        <Stack space={1}>
          {search.suggestions.map((suggestion, i) => (
            <div key={suggestion} {...getItemProps({ item: suggestion })}>
              <Typography
                color={i === highlightedIndex ? 'blue400' : 'dark400'}
              >
                {suggestion.slice(0, search.term.length)}
                <strong>{suggestion.slice(search.term.length)}</strong>
              </Typography>
            </div>
          ))}
        </Stack>
      </div>
      <div className={styles.separator} />
      <div className={styles.menuColumn}>
        {search.results && (
          <Stack space={2}>
            <Typography variant="eyebrow" color="purple400">
              Beint að efninu
            </Typography>
            {search.results.items.map(({ id, title, slug }) => (
              <Typography key={id} links variant="h5" color="blue400">
                <Link href={makePath('article', slug)}>
                  <a>{title}</a>
                </Link>
              </Typography>
            ))}
          </Stack>
        )}
      </div>
    </Box>
  )
}

export default SearchInput
