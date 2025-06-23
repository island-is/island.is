import React, {
  forwardRef,
  ReactElement,
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react'
import { useMeasure } from 'react-use'
import Downshift from 'downshift'
import { useRouter } from 'next/router'
import { useApolloClient } from '@apollo/client/react'

import {
  AsyncSearchInput,
  AsyncSearchInputProps,
  AsyncSearchSizes,
  Box,
  Link,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { TestSupport } from '@island.is/island-ui/utils'
import { trackSearchQuery } from '@island.is/plausible'
import { Locale } from '@island.is/shared/types'
import {
  AnchorPage,
  Article,
  ContentLanguage,
  GetSearchResultsQuery,
  LifeEventPage,
  News,
  OrganizationParentSubpage,
  OrganizationSubpage,
  QuerySearchResultsArgs,
  SearchableContentTypes,
  SearchableTags,
  SubArticle,
} from '@island.is/web/graphql/schema'
import { LinkType, useLinkResolver } from '@island.is/web/hooks/useLinkResolver'
import { GET_SEARCH_RESULTS_QUERY } from '@island.is/web/screens/queries'
import { extractAnchorPageLinkType } from '@island.is/web/utils/anchorPage'

import * as styles from './SearchInput.css'

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

const searchReducer = (state: any, action: any): SearchState => {
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
    default:
      return initialSearchState
  }
  return initialSearchState
}

const useSearch = (
  locale: Locale,
  term?: string,
  autocomplete?: boolean,
  organization?: string,
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
    const thisTimerId =
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore make web strict
      (timer.current = setTimeout(async () => {
        client
          .query<GetSearchResultsQuery, QuerySearchResultsArgs>({
            query: GET_SEARCH_RESULTS_QUERY,
            variables: {
              query: {
                queryString: term?.trim() ?? '',
                language: locale as ContentLanguage,
                types: [
                  // RÁ suggestions has only been searching particular types for some time - SYNC SUGGESTIONS SCOPE WITH DEFAULT - keep it in sync
                  SearchableContentTypes['WebArticle'],
                  SearchableContentTypes['WebSubArticle'],
                  SearchableContentTypes['WebProjectPage'],
                  SearchableContentTypes['WebOrganizationPage'],
                  SearchableContentTypes['WebOrganizationSubpage'],
                  SearchableContentTypes['WebDigitalIcelandService'],
                  SearchableContentTypes['WebDigitalIcelandCommunityPage'],
                  SearchableContentTypes['WebManual'],
                  SearchableContentTypes['WebOrganizationParentSubpage'],
                ],
                highlightResults: true,
                useQuery: 'suggestions',
                tags: organization
                  ? [{ key: organization, type: SearchableTags.Organization }]
                  : undefined,
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
        if (term) {
          const indexOfLastSpace = term.lastIndexOf(' ')
          const hasSpace = indexOfLastSpace !== -1
          const prefix = hasSpace ? term.slice(0, indexOfLastSpace) : ''
          dispatch({
            type: 'searchString',
            term,
            prefix,
          })
        }
      }, DEBOUNCE_TIMER))

    return () => clearTimeout(thisTimerId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client, locale, term, dispatch])

  return state
}

type SubmitType = {
  type: 'query' | 'link'
  string: string
}

const useSubmit = (
  locale: Locale,
  onRouting?: () => void,
  organization?: string,
) => {
  const Router = useRouter()
  const { linkResolver } = useLinkResolver()

  return useCallback(
    (item: SubmitType) => {
      const query: Record<string, string | string[]> = {
        q: item.string,
      }

      if (Router.query.referencedBy) {
        query.referencedBy = Router.query.referencedBy
      }

      if (organization) {
        query.organization = organization
      }

      Router.push({
        ...(item.type === 'query' && {
          pathname: linkResolver('search').href,
          query,
        }),
        ...(item.type === 'link' && {
          pathname: item.string,
        }),
      }).then(() => {
        window.scrollTo(0, 0)
      })

      if (onRouting) {
        onRouting()
      }
    },
    [Router, linkResolver, onRouting, organization],
  )
}

interface SearchInputProps {
  activeLocale: Locale
  initialInputValue?: string
  size?: AsyncSearchSizes
  autocomplete?: boolean
  autosuggest?: boolean
  openOnFocus?: boolean
  placeholder?: string
  white?: boolean
  colored?: boolean
  id?: string
  onRouting?: () => void
  skipContext?: boolean
  quickContentLabel?: string
  organization?: string
}

export const SearchInput = forwardRef<
  HTMLInputElement,
  SearchInputProps & TestSupport
>(
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
      autosuggest = true,
      id = 'downshift',
      onRouting,
      skipContext,
      quickContentLabel,
      dataTestId,
      organization,
    },
    ref,
  ) => {
    const [searchTerm, setSearchTerm] = useState(initialInputValue)
    const search = useSearch(locale, searchTerm, autocomplete, organization)

    const onSubmit = useSubmit(locale, undefined, organization)
    const [hasFocus, setHasFocus] = useState(false)
    const onBlur = useCallback(() => setHasFocus(false), [setHasFocus])
    const onFocus = useCallback(() => {
      setHasFocus(true)
    }, [setHasFocus])

    return (
      <Downshift<SubmitType>
        id={id}
        // Since the search supports '*' we don't want to display it in the UI
        initialInputValue={initialInputValue === '*' ? '' : initialInputValue}
        onChange={(item) => {
          if (!item?.string) {
            return false
          }

          if (item?.type === 'query') {
            return onSubmit({
              ...item,
              string: `${search.prefix} ${item.string}`.trim() || '',
            })
          }

          if (item?.type === 'link') {
            return onSubmit(item)
          }
        }}
        onInputValueChange={(q) => setSearchTerm(q)}
        itemToString={(item) => {
          if (item?.type === 'query') {
            return `${search.prefix ? search.prefix + ' ' : ''}${
              item.string
            }`.trim()
          }

          return ''
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
            dataTestId={dataTestId}
            skipContext={skipContext}
            rootProps={{
              'aria-controls': id + '-menu',
              ...getRootProps(),
            }}
            menuProps={{
              comp: 'div',
              ...getMenuProps(),
            }}
            buttonProps={{
              onClick: () => {
                if (!inputValue) {
                  return false
                }

                closeMenu()
                onSubmit({
                  type: 'query',
                  string: inputValue,
                })
              },
              onFocus,
              onBlur,
              'aria-label': locale === 'is' ? 'Leita' : 'Search',
            }}
            inputProps={getInputProps<AsyncSearchInputProps['inputProps']>({
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
                const v = e.currentTarget.value

                if (!v) {
                  return false
                }

                if (e.key === 'Enter' && highlightedIndex == null) {
                  e.currentTarget.blur()
                  closeMenu()
                  onSubmit({
                    type: 'query',
                    string: v,
                  })
                }
              },
            })}
          >
            {isOpen && !isEmpty(search) && (
              <Results
                quickContentLabel={quickContentLabel}
                search={search}
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore make web strict
                highlightedIndex={highlightedIndex}
                getItemProps={getItemProps}
                autosuggest={autosuggest}
                onRouting={() => {
                  if (onRouting) {
                    onRouting()
                  }
                }}
                highlightedResults={true}
              />
            )}
          </AsyncSearchInput>
        )}
      </Downshift>
    )
  },
)

type SearchResultItem =
  | Article
  | AnchorPage
  | LifeEventPage
  | News
  | SubArticle
  | OrganizationSubpage
  | OrganizationParentSubpage

type ResultsProps = {
  search: SearchState
  highlightedIndex: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getItemProps: any
  autosuggest: boolean
  onRouting?: () => void
  quickContentLabel?: string
  highlightedResults?: boolean | false
}

const Results = ({
  search,
  highlightedIndex,
  getItemProps,
  autosuggest,
  onRouting,
  quickContentLabel = 'Beint að efninu',
  highlightedResults,
}: ResultsProps) => {
  const { linkResolver } = useLinkResolver()

  if (!search.term) {
    const suggestions = search.suggestions.map((suggestion, i) => (
      <div key={suggestion} {...getItemProps({ item: suggestion })}>
        <Text color={i === highlightedIndex ? 'blue400' : 'dark400'}>
          {suggestion}
        </Text>
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
      {autosuggest && search.results && search.results.items.length > 0 && (
        <div className={styles.menuRow}>
          <Stack space={2}>
            <Text variant="eyebrow" color="purple400">
              {quickContentLabel}
            </Text>
            {search.results.items
              .slice(0, 5)
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore make web strict
              .map((item: SearchResultItem, i) => {
                const typename = item.__typename?.toLowerCase() as
                  | LinkType
                  | 'anchorpage'
                  | 'organizationparentsubpage'
                let variables: string[] = []

                if ('slug' in item) {
                  variables = item.slug.split('/')
                }

                if (typename === 'organizationsubpage') {
                  variables = (item as OrganizationSubpage).url
                }

                const { onClick, ...itemProps } = getItemProps({
                  item: {
                    type: 'link',
                    string:
                      typename === 'organizationparentsubpage'
                        ? (item as OrganizationParentSubpage).href
                        : linkResolver(
                            typename === 'anchorpage'
                              ? extractAnchorPageLinkType(item as AnchorPage)
                              : typename === 'organizationsubpage' &&
                                (item as OrganizationSubpage)?.url?.length === 3
                              ? 'organizationparentsubpagechild'
                              : typename,
                            variables,
                          )?.href,
                  },
                })
                return (
                  <Link
                    key={item.id}
                    {...itemProps}
                    onClick={(e: any) => {
                      trackSearchQuery(search.term, 'Web Suggestion')
                      onClick(e)
                      onRouting?.()
                    }}
                    color="blue400"
                    underline="normal"
                    dataTestId="search-result"
                    pureChildren
                    underlineVisibility={
                      search.suggestions.length + i === highlightedIndex
                        ? 'always'
                        : 'hover'
                    }
                    skipTab
                  >
                    {highlightedResults ? (
                      <span
                        dangerouslySetInnerHTML={{ __html: item.title }}
                      ></span>
                    ) : (
                      item.title
                    )}
                  </Link>
                )
              })}
          </Stack>
        </div>
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
            <Text variant="eyebrow" color="blue400">
              Algeng leitarorð
            </Text>
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
