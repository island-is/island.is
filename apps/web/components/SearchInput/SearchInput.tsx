/* eslint-disable jsx-a11y/anchor-is-valid */
import React, {
  FC,
  useState,
  useEffect,
  useCallback,
  useRef,
  forwardRef,
  ReactElement,
  useReducer,
} from 'react'
import Link from 'next/link'
import Downshift from 'downshift'
import { useMeasure } from 'react-use'
import { useRouter } from 'next/router'
import { useApolloClient } from 'react-apollo'
import {
  GET_SEARCH_RESULTS_QUERY,
  GET_SEARCH_AUTOCOMPLETE_TERM_QUERY,
} from '@island.is/web/screens/queries'
import {
  AsyncSearchInput,
  AsyncSearchSizes,
  Box,
  Typography,
  Stack,
} from '@island.is/island-ui/core'
import routeNames from '@island.is/web/i18n/routeNames'
import * as styles from './SearchInput.treat'
import { Locale } from '@island.is/web/i18n/I18n'
import {
  GetSearchResultsQuery,
  QuerySearchResultsArgs,
  ContentLanguage,
  QueryWebSearchAutocompleteArgs,
  AutocompleteTermResultsQuery,
  Article,
  SearchableContentTypes,
} from '@island.is/web/graphql/schema'

const DEBOUNCE_TIMER = 150
const STACK_WIDTH = 400

type SearchState = {
  term: string
  results?: GetSearchResultsQuery['searchResults']
  suggestions: string[]
  prefix: string
  isLoading: boolean
}

const isEmpty = ({ results, suggestions }: SearchState): boolean =>
  suggestions?.length === 0 && (results?.total ?? 0) === 0

const initialSearchState: Readonly<SearchState> = {
  term: '',
  suggestions: [],
  prefix: '',
  isLoading: false,
}

const searchReducer = (state, action): SearchState => {
  switch (action.type) {
    case 'startLoading': {
      return { ...state, isLoading: true }
    }
    case 'suggestions': {
      return { ...state, suggestions: action.suggestions }
    }
    case 'searchResults': {
      return { ...state, results: action.results, isLoading: false }
    }
    case 'searchString': {
      return { ...state, term: action.term, prefix: action.prefix }
    }
    case 'reset': {
      return initialSearchState
    }
  }
}

const useSearch = (
  locale: Locale,
  term?: string,
  autocomplete?: boolean,
): SearchState => {
  const [state, dispatch] = useReducer(searchReducer, initialSearchState)
  const client = useApolloClient()
  const timer = useRef(null)

  useEffect(() => {
    if (!autocomplete) {
      dispatch({
        type: 'reset',
      })
      return
    }
    if (term === '') {
      dispatch({
        type: 'reset',
      })
      return
    }

    dispatch({ type: 'startLoading' })

    const thisTimerId = (timer.current = setTimeout(async () => {
      client
        .query<GetSearchResultsQuery, QuerySearchResultsArgs>({
          query: GET_SEARCH_RESULTS_QUERY,
          variables: {
            query: {
              queryString: term.trim(),
              language: locale as ContentLanguage,
              types: [
                SearchableContentTypes['WebArticle'],
                SearchableContentTypes['WebLifeEventPage'],
              ],
            },
          },
        })
        .then(({ data: { searchResults: results } }) => {
          dispatch({
            type: 'searchResults',
            results,
          })
        })

      // the api only completes single terms get only single terms
      const indexOfLastSpace = term.lastIndexOf(' ')
      const hasSpace = indexOfLastSpace !== -1
      const prefix = hasSpace ? term.slice(0, indexOfLastSpace) : ''
      const queryString = hasSpace ? term.slice(indexOfLastSpace) : term

      client
        .query<AutocompleteTermResultsQuery, QueryWebSearchAutocompleteArgs>({
          query: GET_SEARCH_AUTOCOMPLETE_TERM_QUERY,
          variables: {
            input: {
              singleTerm: queryString.trim(),
              language: locale as ContentLanguage,
              size: 10, // only show top X completions to prevent long list
            },
          },
        })
        .then(
          ({
            data: {
              webSearchAutocomplete: { completions: suggestions },
            },
          }) => {
            dispatch({
              type: 'suggestions',
              suggestions,
            })
          },
        )

      dispatch({
        type: 'searchString',
        term,
        prefix,
      })
    }, DEBOUNCE_TIMER))

    return () => clearTimeout(thisTimerId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, locale, term, dispatch])

  return state
}

const useSubmit = (locale: Locale) => {
  const Router = useRouter()
  const { makePath } = routeNames(locale)

  return useCallback(
    (q: string) => {
      if (q) {
        Router.push({
          pathname: makePath('search'),
          query: { q },
        }).then(() => {
          window.scrollTo(0, 0)
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
  id?: string
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      placeholder = '',
      activeLocale: locale,
      initialInputValue = '',
      openOnFocus = false,
      size = 'medium',
      white = false,
      colored = true,
      autocomplete = true,
      id = 'downshift',
    },
    ref,
  ) => {
    const [searchTerm, setSearchTerm] = useState(initialInputValue)
    const search = useSearch(locale, searchTerm, autocomplete)
    const onSubmit = useSubmit(locale)
    const [hasFocus, setHasFocus] = useState(false)
    const onFocus = useCallback(() => setHasFocus(true), [setHasFocus])
    const onBlur = useCallback(() => setHasFocus(false), [setHasFocus])

    return (
      <Downshift<string>
        id={id}
        initialInputValue={initialInputValue}
        onChange={(q) => {
          return onSubmit(`${search.prefix} ${q}`.trim() || '')
        }}
        onInputValueChange={(q) => setSearchTerm(q)}
        itemToString={(v) => {
          const str = `${search.prefix ? search.prefix + ' ' : ''}${v}`.trim()

          if (str === 'null') {
            return ''
          }

          return str
        }}
        stateReducer={(state, changes) => {
          // pressing tab when input is not empty should move focus to the
          // search icon, so we need to prevent downshift from closing on blur
          const shouldIgnore =
            changes.type === Downshift.stateChangeTypes.mouseUp ||
            (changes.type === Downshift.stateChangeTypes.blurInput &&
              state.inputValue !== '')

          return shouldIgnore ? {} : changes
        }}
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
            hasFocus={hasFocus}
            loading={search.isLoading}
            rootProps={getRootProps()}
            menuProps={{
              comp: 'div',
              ...getMenuProps(),
            }}
            buttonProps={{
              onClick: () => {
                closeMenu()
                onSubmit(inputValue)
              },
              onFocus,
              onBlur,
            }}
            inputProps={getInputProps({
              inputSize: size,
              onFocus: () => {
                onFocus()
                if (openOnFocus) {
                  openMenu()
                }
              },
              onBlur,
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
            {isOpen && !isEmpty(search) && (
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getItemProps: any
}> = ({ locale, search, highlightedIndex, getItemProps }) => {
  const { makePath } = routeNames(locale)

  if (!search.term) {
    const suggestions = search.suggestions.map((suggestion, i) => (
      <div key={suggestion} {...getItemProps({ item: suggestion })}>
        <Typography
          links
          color={i === highlightedIndex ? 'blue400' : 'dark400'}
        >
          {suggestion}
        </Typography>
      </div>
    ))

    return <CommonSearchTerms suggestions={suggestions} />
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      background="blue100"
      paddingY={2}
      paddingX={3}
    >
      <div className={styles.menuRow}>
        <Stack space={1}>
          {search.suggestions &&
            search.suggestions.map((suggestion, i) => {
              const suggestionHasTerm = suggestion.startsWith(search.term)
              const startOfString = suggestionHasTerm ? search.term : suggestion
              const endOfString = suggestionHasTerm
                ? suggestion.replace(search.term, '')
                : ''
              return (
                <div key={suggestion} {...getItemProps({ item: suggestion })}>
                  <Typography
                    links
                    color={i === highlightedIndex ? 'blue400' : 'dark400'}
                  >
                    {`${search.prefix} ${startOfString}`}
                    <strong>{endOfString}</strong>
                  </Typography>
                </div>
              )
            })}
        </Stack>
      </div>{' '}
      {search.results && search.results.items.length > 0 && (
        <>
          <div className={styles.separatorHorizontal} />
          <div className={styles.menuRow}>
            <Stack space={2}>
              <Typography variant="eyebrow" color="purple400">
                Beint að efninu
              </Typography>
              {(search.results.items as Article[])
                .slice(0, 5)
                .map(({ id, title, slug }) => (
                  <div key={id} {...getItemProps({ item: '' })}>
                    <Typography links variant="h5" color="blue400">
                      <Link href={makePath('article', slug)}>
                        <a>{title}</a>
                      </Link>
                    </Typography>
                  </div>
                ))}
            </Stack>
          </div>
        </>
      )}
    </Box>
  )
}

const CommonSearchTerms = ({
  suggestions,
}: {
  suggestions: ReactElement[]
}) => {
  const [ref, { width }] = useMeasure()

  if (!suggestions.length) {
    return null
  }

  const splitAt = Math.min(suggestions.length / 2)
  const left = suggestions.slice(0, splitAt)
  const right = suggestions.slice(splitAt)

  return (
    <Box
      ref={ref}
      display="flex"
      background="blue100"
      paddingY={2}
      paddingX={3}
    >
      <div className={styles.menuColumn}>
        <Stack space={2}>
          <Box marginBottom={1}>
            <Typography variant="eyebrow" color="blue400">
              Algeng leitarorð
            </Typography>
          </Box>
          {width < STACK_WIDTH ? suggestions : left}
        </Stack>
      </div>
      {width > STACK_WIDTH - 1 ? (
        <>
          <div className={styles.separatorVertical} />
          <div className={styles.menuColumn}>
            <Stack space={2}>{right}</Stack>
          </div>
        </>
      ) : null}
    </Box>
  )
}

export default SearchInput
